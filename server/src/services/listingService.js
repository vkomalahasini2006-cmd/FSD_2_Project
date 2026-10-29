import prisma from '../utils/prisma.js';
import { AppError } from '../utils/apiResponse.js';

// Select fields for public listings (Excludes privateAddress, excludes owner phone/email)
const publicListingSelect = {
  id: true,
  title: true,
  description: true,
  pricePerDay: true,
  depositAmount: true,
  area: true,
  images: true,
  pickupPreference: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  category: {
    select: {
      id: true,
      name: true,
      icon: true
    }
  },
  owner: {
    select: {
      id: true,
      name: true,
      createdAt: true
    }
  }
};

export const getListings = async ({
  category,
  minPrice,
  maxPrice,
  area,
  search,
  page = 1,
  limit = 12,
  sort = 'newest'
}) => {
  const where = {
    isActive: true
  };

  if (category) {
    where.OR = [
      { categoryId: category },
      { category: { name: { equals: category, mode: 'insensitive' } } }
    ];
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.pricePerDay = {};
    if (minPrice !== undefined) where.pricePerDay.gte = minPrice;
    if (maxPrice !== undefined) where.pricePerDay.lte = maxPrice;
  }

  if (area) {
    where.area = { contains: area, mode: 'insensitive' };
  }

  if (search) {
    where.OR = [
      ...(where.OR || []),
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }

  let orderBy = { createdAt: 'desc' };
  if (sort === 'price_asc') {
    orderBy = { pricePerDay: 'asc' };
  } else if (sort === 'price_desc') {
    orderBy = { pricePerDay: 'desc' };
  }

  const skip = (page - 1) * limit;

  const [total, listings] = await Promise.all([
    prisma.listing.count({ where }),
    prisma.listing.findMany({
      where,
      select: publicListingSelect,
      orderBy,
      skip,
      take: limit
    })
  ]);

  return {
    listings,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getListingById = async (id, requesterUserId = null) => {
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          icon: true
        }
      },
      owner: {
        select: {
          id: true,
          name: true,
          createdAt: true
        }
      }
    }
  });

  if (!listing) {
    throw new AppError('Listing not found', 404, 'LISTING_NOT_FOUND');
  }

  // Strictly enforce security rule: NEVER leak privateAddress to the public!
  // Only include privateAddress if the requester is the owner of this listing
  if (requesterUserId !== listing.ownerId) {
    delete listing.privateAddress;
  }

  return listing;
};

export const getMyListings = async (ownerId) => {
  return prisma.listing.findMany({
    where: { ownerId },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          icon: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const createListing = async (ownerId, data, imageUrls = []) => {
  // Ensure category exists
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId }
  });

  if (!category) {
    throw new AppError('The selected category does not exist.', 400, 'INVALID_CATEGORY');
  }

  return prisma.listing.create({
    data: {
      ownerId,
      title: data.title,
      description: data.description,
      categoryId: data.categoryId,
      pricePerDay: data.pricePerDay,
      depositAmount: data.depositAmount,
      area: data.area,
      privateAddress: data.privateAddress,
      images: imageUrls,
      pickupPreference: data.pickupPreference,
      isActive: true
    },
    include: {
      category: true
    }
  });
};

export const updateListing = async (listingId, ownerId, data, newImageUrls = null) => {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId }
  });

  if (!listing) {
    throw new AppError('Listing not found.', 404, 'LISTING_NOT_FOUND');
  }

  if (listing.ownerId !== ownerId) {
    throw new AppError('You do not have permission to modify this listing.', 403, 'FORBIDDEN');
  }

  const updatePayload = { ...data };
  if (newImageUrls && newImageUrls.length > 0) {
    updatePayload.images = newImageUrls;
  }

  return prisma.listing.update({
    where: { id: listingId },
    data: updatePayload,
    include: {
      category: true
    }
  });
};

export const deleteListing = async (listingId, ownerId) => {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId }
  });

  if (!listing) {
    throw new AppError('Listing not found.', 404, 'LISTING_NOT_FOUND');
  }

  if (listing.ownerId !== ownerId) {
    throw new AppError('You do not have permission to delete this listing.', 403, 'FORBIDDEN');
  }

  await prisma.listing.delete({
    where: { id: listingId }
  });

  return { message: 'Listing deleted successfully.' };
};
