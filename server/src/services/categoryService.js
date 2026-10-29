import prisma from '../utils/prisma.js';

export const getAllCategories = async () => {
  return prisma.category.findMany({
    include: {
      _count: {
        select: { listings: { where: { isActive: true } } }
      }
    },
    orderBy: { name: 'asc' }
  });
};
