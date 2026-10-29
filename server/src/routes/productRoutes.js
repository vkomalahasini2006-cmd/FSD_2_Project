import { Router } from 'express';
import prisma from '../utils/prisma.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// Map DB Listing format to FSD_2_Project Product format
const formatListingToProduct = (listing) => {
  const categoryNameMap = {
    'Cameras': 'Electronics & Cameras',
    'Electronics': 'Electronics & Cameras',
    'Bikes': 'Bikes & Cycles',
    'Dresses': 'Fashion & Dresses',
    'Gaming': 'Gaming Consoles',
    'Tools': 'Tools & Equipment',
    'Books': 'Books & Calculators',
    'Sports': 'Sports & Outdoor'
  };

  const rawCat = listing.category?.name || 'Electronics & Cameras';
  const category = categoryNameMap[rawCat] || rawCat;
  const image = listing.images && listing.images.length > 0
    ? listing.images[0]
    : 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85';

  return {
    id: listing.id,
    ownerId: listing.ownerId,
    title: listing.title,
    description: listing.description,
    category,
    image,
    dailyPrice: Number(listing.pricePerDay),
    securityDeposit: Number(listing.depositAmount),
    location: listing.area || 'Vijayawada',
    owner: {
      name: listing.owner?.name || 'Verified Owner',
      rating: 4.8,
      verified: true
    },
    rating: 4.8,
    reviews: 24,
    condition: 'Like new',
    popular: true,
    availableDates: ['2026-10-28', '2026-10-29', '2026-10-30', '2026-10-31'],
    createdAt: listing.createdAt
  };
};

// GET /api/products
router.get('/', async (req, res, next) => {
  try {
    const listings = await prisma.listing.findMany({
      where: { isActive: true },
      include: { category: true, owner: true },
      orderBy: { createdAt: 'desc' }
    });

    const products = listings.map(formatListingToProduct);
    return res.json(products);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/owner
router.get('/owner', authenticate, async (req, res, next) => {
  try {
    const listings = await prisma.listing.findMany({
      where: { ownerId: req.user.id },
      include: { category: true, owner: true },
      orderBy: { createdAt: 'desc' }
    });

    const products = listings.map(formatListingToProduct);
    return res.json(products);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: req.params.id },
      include: { category: true, owner: true }
    });

    if (!listing) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(formatListingToProduct(listing));
  } catch (err) {
    next(err);
  }
});

// POST /api/products
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { title, description, category, dailyPrice, securityDeposit, location, image } = req.body;

    // Find or create category
    let cat = await prisma.category.findFirst({
      where: { name: { contains: 'Electronics', mode: 'insensitive' } }
    });
    if (!cat) {
      cat = await prisma.category.findFirst();
    }

    const created = await prisma.listing.create({
      data: {
        ownerId: req.user.id,
        title,
        description,
        categoryId: cat.id,
        pricePerDay: Number(dailyPrice),
        depositAmount: Number(securityDeposit),
        area: location || 'Vijayawada',
        privateAddress: location || 'Vijayawada',
        images: image ? [image] : [],
        pickupPreference: 'Self Pickup',
        isActive: true
      },
      include: { category: true, owner: true }
    });

    return res.status(201).json(formatListingToProduct(created));
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const listing = await prisma.listing.findUnique({ where: { id: req.params.id } });
    if (!listing) return res.status(404).json({ message: 'Not found' });
    if (listing.ownerId !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    await prisma.listing.delete({ where: { id: req.params.id } });
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
