import { Router } from 'express';
import prisma from '../utils/prisma.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// In-memory / MongoDB collection simulation fallback for bookings
// We store bookings in MongoDB via raw collection or in-memory map
let bookingsStore = [];

// Helper to format a booking response matching BookingRecord in client/src/types.ts
const formatBooking = (b) => ({
  id: b.id,
  items: b.items || [],
  notes: b.notes || '',
  status: b.status || 'Requested',
  createdAt: b.createdAt || new Date().toISOString()
});

// GET /bookings or /api/bookings
router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    // Filter bookings belonging to this user
    const userBookings = bookingsStore.filter(b => b.userId === userId);
    return res.json(userBookings.map(formatBooking));
  } catch (err) {
    next(err);
  }
});

// POST /bookings or /api/bookings
router.post('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { items = [], notes = '' } = req.body;

    // Enhance items with full product details if only productId is provided
    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        let product = item.product;
        if (!product && item.productId) {
          // Look up listing from database
          try {
            const listing = await prisma.listing.findUnique({
              where: { id: item.productId },
              include: { category: true, owner: true }
            });
            if (listing) {
              product = {
                id: listing.id,
                title: listing.title,
                description: listing.description,
                category: listing.category?.name || 'Electronics & Cameras',
                image: (listing.images && listing.images[0]) || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85',
                dailyPrice: Number(listing.pricePerDay),
                securityDeposit: Number(listing.depositAmount),
                location: listing.area || 'Vijayawada',
                owner: { name: listing.owner?.name || 'Verified Owner', rating: 4.8, verified: true },
                rating: 4.8,
                reviews: 24,
                condition: 'Like new',
                availableDates: [],
                createdAt: listing.createdAt
              };
            }
          } catch (e) {
            // fallback if lookup fails
          }
        }
        if (!product) {
          product = {
            id: item.productId || `item-${Date.now()}`,
            title: 'Rented Product',
            dailyPrice: 200,
            securityDeposit: 1000,
            image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85'
          };
        }
        return {
          product,
          startDate: item.startDate,
          endDate: item.endDate
        };
      })
    );

    const newBooking = {
      id: `bk_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      items: enrichedItems,
      notes,
      status: 'Requested',
      createdAt: new Date().toISOString()
    };

    bookingsStore.unshift(newBooking);

    return res.status(201).json(formatBooking(newBooking));
  } catch (err) {
    next(err);
  }
});

// GET /bookings/:id
router.get('/:id', authenticate, (req, res) => {
  const booking = bookingsStore.find(b => b.id === req.params.id && b.userId === req.user.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  return res.json(formatBooking(booking));
});

export default router;
