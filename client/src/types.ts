export type Category = 'Electronics & Cameras' | 'Bikes & Cycles' | 'Fashion & Dresses' | 'Gaming Consoles' | 'Tools & Equipment' | 'Books & Calculators' | 'Sports & Outdoor' | 'Event & Party';

export type Product = {
  id: string;
  ownerId?: string;
  title: string;
  description: string;
  category: Category;
  image: string;
  dailyPrice: number;
  securityDeposit: number;
  location: string;
  owner: { name: string; rating: number; verified: boolean };
  rating: number;
  reviews: number;
  condition: 'Like new' | 'Excellent' | 'Good';
  availableDates: string[];
  createdAt: string;
  popular?: boolean;
};

export type CartItem = { product: Product; startDate: string; endDate: string };

export type Booking = CartItem & { status: 'Requested' | 'Approved' | 'Paid' | 'Active' | 'Returned' | 'Completed' | 'Cancelled'; };

export type UserRole = 'renter' | 'owner';

export type BookingRecord = {
  id: string;
  items: CartItem[];
  notes: string;
  status: Booking['status'];
  createdAt: string;
};
