import React from 'react';
import {
  Camera,
  Bike,
  Wrench,
  Gamepad2,
  Shirt,
  Laptop,
  BookOpen,
  Trophy,
  Package
} from 'lucide-react';

const iconMap = {
  camera: Camera,
  cameras: Camera,
  bike: Bike,
  bikes: Bike,
  wrench: Wrench,
  tools: Wrench,
  gamepad2: Gamepad2,
  gaming: Gamepad2,
  shirt: Shirt,
  dresses: Shirt,
  laptop: Laptop,
  electronics: Laptop,
  bookopen: BookOpen,
  books: BookOpen,
  trophy: Trophy,
  sports: Trophy
};

export const getCategoryIcon = (categoryNameOrIcon, className = 'w-5 h-5') => {
  if (!categoryNameOrIcon) return <Package className={className} />;
  const key = categoryNameOrIcon.toLowerCase().trim();
  const IconComponent = iconMap[key] || Package;
  return <IconComponent className={className} />;
};
