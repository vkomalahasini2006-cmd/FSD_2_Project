import { Category, Product } from './types';

export const categories: { name: Category; icon: string; tint: string }[] = [
  { name: 'Electronics & Cameras', icon: 'camera', tint: 'blue' },
  { name: 'Bikes & Cycles', icon: 'bike', tint: 'mint' },
  { name: 'Fashion & Dresses', icon: 'shirt', tint: 'coral' },
  { name: 'Gaming Consoles', icon: 'gamepad', tint: 'purple' },
  { name: 'Tools & Equipment', icon: 'wrench', tint: 'amber' },
  { name: 'Books & Calculators', icon: 'book', tint: 'slate' },
  { name: 'Sports & Outdoor', icon: 'dumbbell', tint: 'green' },
  { name: 'Event & Party', icon: 'party', tint: 'pink' },
];

const images = {
  camera: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85',
  laptop: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85',
  bike: 'https://images.pexels.com/photos/31935904/pexels-photo-31935904.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  gaming: 'https://images.pexels.com/photos/4522995/pexels-photo-4522995.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  fashion: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85',
  tools: 'https://images.unsplash.com/photo-1581147036324-c17ac41d8f6b?auto=format&fit=crop&w=900&q=85',
  sports: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=85',
  party: 'https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=900&q=85',
  book: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=85',
  projector: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=900&q=85',
};

const dates = ['2026-10-18', '2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23', '2026-10-24', '2026-10-25', '2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29', '2026-10-30'];

const item = (id: string, title: string, category: Category, image: string, dailyPrice: number, securityDeposit: number, location: string, rating: number, owner: string, condition: Product['condition'], popular = false): Product => ({
  id, title, category, image, dailyPrice, securityDeposit, location, rating, reviews: Math.round(rating * 117), condition, popular, availableDates: dates, createdAt: '2026-09-24', owner: { name: owner, rating: Math.min(5, rating + 0.1), verified: true },
  description: `Well-maintained ${title.toLowerCase()} available for flexible rentals. Clean, tested, and ready for your next project or experience. Pickup is arranged at a convenient public spot in ${location}.`,
});

export const products: Product[] = [
  item('canon-eos', 'Canon EOS 1500D DSLR Camera', 'Electronics & Cameras', images.camera, 500, 3000, 'Guntur', 4.8, 'Arjun R.', 'Like new', true),
  item('sony-headphones', 'Sony WH-1000XM5 Headphones', 'Electronics & Cameras', images.laptop, 180, 1200, 'Vijayawada', 4.7, 'Niharika S.', 'Excellent', true),
  item('macbook-air', 'MacBook Air M2 13-inch', 'Electronics & Cameras', images.laptop, 850, 8000, 'Hyderabad', 4.9, 'Vikram K.', 'Like new', true),
  item('gopro', 'GoPro HERO 11 Black', 'Electronics & Cameras', images.camera, 350, 2500, 'Vizag', 4.6, 'Suresh P.', 'Excellent'),
  item('city-bike', 'Urban Commuter Bicycle', 'Bikes & Cycles', images.bike, 220, 1500, 'Guntur', 4.7, 'Karthik N.', 'Excellent', true),
  item('mountain-bike', 'Trek Marlin Mountain Bike', 'Bikes & Cycles', images.bike, 450, 3500, 'Vijayawada', 4.8, 'Sai Teja', 'Like new'),
  item('sherwani', 'Designer Wedding Sherwani', 'Fashion & Dresses', images.fashion, 700, 4000, 'Hyderabad', 4.5, 'Rhea Closet', 'Excellent', true),
  item('evening-gown', 'Midnight Blue Evening Gown', 'Fashion & Dresses', images.fashion, 550, 3000, 'Guntur', 4.6, 'Style Studio', 'Like new'),
  item('ps5', 'PlayStation 5 with 2 Controllers', 'Gaming Consoles', images.gaming, 900, 6000, 'Vijayawada', 4.9, 'Rohan M.', 'Excellent', true),
  item('xbox', 'Xbox Series X Gaming Bundle', 'Gaming Consoles', images.gaming, 750, 5500, 'Hyderabad', 4.6, 'Game On Rentals', 'Good'),
  item('drill', 'Bosch Professional Drill Kit', 'Tools & Equipment', images.tools, 300, 1800, 'Guntur', 4.7, 'BuildRight', 'Excellent'),
  item('ladder', 'Aluminium Extension Ladder', 'Tools & Equipment', images.tools, 180, 1000, 'Vijayawada', 4.4, 'Ravi Tools', 'Good'),
  item('calculator', 'Casio Scientific Calculator', 'Books & Calculators', images.book, 60, 400, 'Guntur', 4.8, 'Campus Rentals', 'Excellent'),
  item('textbooks', 'Engineering Exam Book Set', 'Books & Calculators', images.book, 100, 600, 'Hyderabad', 4.5, 'BookLoop', 'Good'),
  item('treadmill', 'Foldable Home Treadmill', 'Sports & Outdoor', images.sports, 650, 5000, 'Vijayawada', 4.6, 'FitLife', 'Excellent'),
  item('tent', '4-Person Camping Tent', 'Sports & Outdoor', images.sports, 300, 2000, 'Vizag', 4.8, 'Trail Blazers', 'Like new'),
  item('projector', 'Full HD Event Projector', 'Event & Party', images.projector, 800, 4500, 'Guntur', 4.7, 'Pixel Events', 'Excellent', true),
  item('speaker', 'JBL PartyBox 310 Speaker', 'Event & Party', images.party, 550, 3500, 'Vijayawada', 4.8, 'Beat Rentals', 'Like new'),
  item('fairy-lights', 'Warm Fairy Light Decoration Set', 'Event & Party', images.party, 180, 800, 'Hyderabad', 4.5, 'Celebrate Co.', 'Good'),
  item('tripod', 'Carbon Fibre Camera Tripod', 'Electronics & Cameras', images.camera, 140, 800, 'Guntur', 4.4, 'Lens Lab', 'Excellent'),
];

export const featuredProducts = products.filter((product) => product.popular);
