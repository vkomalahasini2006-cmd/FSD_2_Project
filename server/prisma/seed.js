import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting RentKart database seed...');

  // 1. Clean existing data in reverse dependency order
  await prisma.emailOtp.deleteMany({});
  await prisma.listing.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = await bcrypt.hash('Demo@1234', 10);

  // 2. Create Users (1 Admin, 3 Owners, 3 Renters)
  console.log('👤 Creating users...');
  const admin = await prisma.user.create({
    data: {
      name: 'RentKart Admin',
      email: 'admin@rentkart.com',
      phone: '+91 98765 00001',
      passwordHash,
      role: 'ADMIN',
      isEmailVerified: true
    }
  });

  const owner1 = await prisma.user.create({
    data: {
      name: 'Ramesh Sharma',
      email: 'owner1@rentkart.com',
      phone: '+91 98480 11111',
      passwordHash,
      role: 'OWNER',
      isEmailVerified: true
    }
  });

  const owner2 = await prisma.user.create({
    data: {
      name: 'Priya Varma',
      email: 'owner2@rentkart.com',
      phone: '+91 98480 22222',
      passwordHash,
      role: 'OWNER',
      isEmailVerified: true
    }
  });

  const owner3 = await prisma.user.create({
    data: {
      name: 'Suresh Reddy',
      email: 'owner3@rentkart.com',
      phone: '+91 98480 33333',
      passwordHash,
      role: 'OWNER',
      isEmailVerified: true
    }
  });

  const renter1 = await prisma.user.create({
    data: {
      name: 'Ananya Rao',
      email: 'renter1@rentkart.com',
      phone: '+91 98480 44444',
      passwordHash,
      role: 'RENTER',
      isEmailVerified: true
    }
  });

  const renter2 = await prisma.user.create({
    data: {
      name: 'Karthik Naidu',
      email: 'renter2@rentkart.com',
      phone: '+91 98480 55555',
      passwordHash,
      role: 'RENTER',
      isEmailVerified: true
    }
  });

  const renter3 = await prisma.user.create({
    data: {
      name: 'Divya Chowdary',
      email: 'renter3@rentkart.com',
      phone: '+91 98480 66666',
      passwordHash,
      role: 'RENTER',
      isEmailVerified: true
    }
  });

  // 3. Create 8 Categories
  console.log('🏷️ Creating categories...');
  const categoryData = [
    { name: 'Cameras', icon: 'Camera' },
    { name: 'Bikes', icon: 'Bike' },
    { name: 'Tools', icon: 'Wrench' },
    { name: 'Gaming', icon: 'Gamepad2' },
    { name: 'Dresses', icon: 'Shirt' },
    { name: 'Electronics', icon: 'Laptop' },
    { name: 'Books', icon: 'BookOpen' },
    { name: 'Sports', icon: 'Trophy' }
  ];

  const categories = {};
  for (const cat of categoryData) {
    const created = await prisma.category.create({ data: cat });
    categories[cat.name] = created.id;
  }

  // 4. Create 20 Realistic Listings
  console.log('📦 Creating 20 realistic listings across Vijayawada, Guntur, and Hyderabad...');
  const listingsData = [
    // Cameras
    {
      ownerId: owner1.id,
      categoryId: categories['Cameras'],
      title: 'Sony Alpha A7 IV Mirrorless Camera with 24-70mm GM Lens',
      description: 'Professional full-frame mirrorless camera with 33MP sensor, 4K 60p video, and lightning fast autofocus. Perfect for weddings, events, and cinematic shoots. Includes 2 high-capacity batteries, 128GB Pro SD card, and camera bag.',
      pricePerDay: 1800,
      depositAmount: 10000,
      area: 'Benz Circle, Vijayawada',
      privateAddress: 'Flat 402, Sri Krishna Heights, Near Sweet Magic, Benz Circle, Vijayawada - 520010',
      images: [
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=1000&q=80'
      ],
      pickupPreference: 'Self Pickup'
    },
    {
      ownerId: owner2.id,
      categoryId: categories['Cameras'],
      title: 'GoPro HERO 12 Black Action Camera with Creator Edition Kit',
      description: 'Waterproof 5.3K60 HDR video action camera with Volta battery grip, Media Mod, and Light Mod. Includes suction cup and chest harness for biking or travel vlogs.',
      pricePerDay: 750,
      depositAmount: 4000,
      area: 'Gachibowli, Hyderabad',
      privateAddress: 'Villa 18, Golf View Enclave, Opp. Biodiversity Park, Gachibowli, Hyderabad - 500032',
      images: [
        'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1000&q=80'
      ],
      pickupPreference: 'Doorstep Delivery'
    },
    {
      ownerId: owner3.id,
      categoryId: categories['Cameras'],
      title: 'DJI RS 3 Pro Gimbal Stabilizer',
      description: 'Carbon fiber 3-axis motorized gimbal for DSLR and cinema cameras with automated axis locks and 4.5kg payload capacity. Includes briefcase handle and focus motor.',
      pricePerDay: 900,
      depositAmount: 5000,
      area: 'Brodipet, Guntur',
      privateAddress: 'Door No. 4/12, Brodipet Main Road, Near Sri Chaitanya College, Guntur - 522002',
      images: [
        'https://images.unsplash.com/photo-1589872766857-2110abb95a08?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80'
      ],
      pickupPreference: 'Meet at Landmark'
    },

    // Bikes
    {
      ownerId: owner1.id,
      categoryId: categories['Bikes'],
      title: 'Royal Enfield Hunter 350 (Dapper Ash)',
      description: 'Nimble and stylish roadster with comfortable upright posture and smooth 349cc J-series engine. Fully serviced with dual-channel ABS, mobile phone mount, and crash guards. Helmet included.',
      pricePerDay: 800,
      depositAmount: 3000,
      area: 'Madhapur, Hyderabad',
      privateAddress: 'Apartment 203, Silicon Valley Residency, 100 Feet Road, Ayyappa Society, Madhapur, Hyderabad - 500081',
      images: [
        'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80'
      ],
      pickupPreference: 'Self Pickup'
    },
    {
      ownerId: owner2.id,
      categoryId: categories['Bikes'],
      title: 'Trek Marlin 7 Mountain Bike (Hydraulic Disc Brakes)',
      description: 'Trail-worthy mountain bike with RockShox fork, 1x10 Shimano Deore drivetrain, and wide 29-inch knobby tires. Great for fitness rides or trail exploration around Hyderabad outskirts.',
      pricePerDay: 450,
      depositAmount: 2000,
      area: 'Labbipet, Vijayawada',
      privateAddress: 'House # 39-8-14, Opp DV Manor Hotel, MG Road, Labbipet, Vijayawada - 520010',
      images: [
        'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=1000&q=80'
      ],
      pickupPreference: 'Self Pickup'
    },
    {
      ownerId: owner3.id,
      categoryId: categories['Bikes'],
      title: 'Ather 450X Gen 3 Electric Scooter',
      description: 'High-speed smart electric scooter with Warp mode, Google Maps navigation dashboard, and 105km true range. Fast charger included. Perfect for eco-friendly city commutes.',
      pricePerDay: 600,
      depositAmount: 2500,
      area: 'Arundelpet, Guntur',
      privateAddress: 'Plot 77, 8th Lane, Arundelpet, Near Old Bus Stand, Guntur - 522002',
      images: [
        'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1000&q=80'
      ],
      pickupPreference: 'Doorstep Delivery'
    },

    // Tools
    {
      ownerId: owner1.id,
      categoryId: categories['Tools'],
      title: 'Bosch Professional Cordless Drill & Impact Driver Combo Set (18V)',
      description: 'Heavy duty brushless drill set with 2x 4.0Ah batteries, rapid charger, and 35-piece screwdriver and masonry drill bit set. Ideal for home renovations, woodworking, and carpentry projects.',
      pricePerDay: 350,
      depositAmount: 1500,
      area: 'Governorpet, Vijayawada',
      privateAddress: '27-14-52, Rajagopalachari Street, Governorpet, Vijayawada - 520002',
      images: [
        'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=1000&q=80'
      ],
      pickupPreference: 'Self Pickup'
    },
    {
      ownerId: owner2.id,
      categoryId: categories['Tools'],
      title: 'Kärcher K3 High Pressure Washer (120 Bar)',
      description: 'Compact high-pressure washer with Quick Connect gun, 6m hose, dirt blaster spray lance, and detergent tank. Outstanding for car cleaning, patio wash, and AC outdoor coil deep cleaning.',
      pricePerDay: 500,
      depositAmount: 2000,
      area: 'Hitec City, Hyderabad',
      privateAddress: 'Flat 101, Cyber Heights, Behind Cyber Towers, Hitec City, Hyderabad - 500081',
      images: [
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80'
      ],
      pickupPreference: 'Doorstep Delivery'
    },

    // Gaming
    {
      ownerId: owner3.id,
      categoryId: categories['Gaming'],
      title: 'Sony PlayStation 5 Disc Console with 2 DualSense Controllers',
      description: 'PS5 console with ultra-high speed SSD, ray tracing, and 3 pre-installed games: Spider-Man 2, FIFA 24, and God of War Ragnarök. Includes HDMI 2.1 cable and charging dock.',
      pricePerDay: 950,
      depositAmount: 5000,
      area: 'Kondapur, Hyderabad',
      privateAddress: 'Tower B, Flat 804, My Home Mangala, Kothaguda Junction, Kondapur, Hyderabad - 500084',
      images: [
        'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80'
      ],
      pickupPreference: 'Meet at Landmark'
    },
    {
      ownerId: owner1.id,
      categoryId: categories['Gaming'],
      title: 'Meta Quest 3 VR Headset (128GB) with Elite Strap',
      description: 'Next-gen mixed reality headset with pancake lenses, 4K+ Infinite Display, and Touch Plus controllers. Comes with silicone protective covers and lens cleaning kit.',
      pricePerDay: 850,
      depositAmount: 4500,
      area: 'Benz Circle, Vijayawada',
      privateAddress: 'House 14, Chandramoulipuram, Near PVP Square Mall, Benz Circle, Vijayawada - 520010',
      images: [
        'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=1000&q=80'
      ],
      pickupPreference: 'Self Pickup'
    },
    {
      ownerId: owner2.id,
      categoryId: categories['Gaming'],
      title: 'Nintendo Switch OLED Model with Mario Kart 8 & Zelda',
      description: 'Vibrant 7-inch OLED screen console with dock, Joy-Con grip, wrist straps, and carrying case. Perfect for family weekends, trips, and local multiplayer parties.',
      pricePerDay: 600,
      depositAmount: 3000,
      area: 'Lakshmipuram, Guntur',
      privateAddress: 'Door 6-10-45, Lakshmipuram Main Road, Near Naaz Centre, Guntur - 522007',
      images: [
        'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=1000&q=80'
      ],
      pickupPreference: 'Self Pickup'
    },

    // Dresses
    {
      ownerId: owner3.id,
      categoryId: categories['Dresses'],
      title: 'Handloom Kanchipuram Pure Silk Bridal Saree (Crimson Red)',
      description: 'Exquisite authentic Kanchipuram silk saree with intricate gold zari brocade, peacock motifs, and heavy pallu. Professionally dry-cleaned, includes stitched blouse (size 36-38 alterable).',
      pricePerDay: 1200,
      depositAmount: 4000,
      area: 'Jubilee Hills, Hyderabad',
      privateAddress: 'Road No. 36, House 420, Near Peddamma Temple, Jubilee Hills, Hyderabad - 500033',
      images: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80'
      ],
      pickupPreference: 'Self Pickup'
    },
    {
      ownerId: owner1.id,
      categoryId: categories['Dresses'],
      title: 'Raymond Royal Velvet Bandhgala Tuxedo Suit (Navy Blue, Size 40)',
      description: 'Sharp tailored Italian fabric Bandhgala suit with satin lapels, brass crest buttons, and matching trousers. Dry cleaned and ready for receptions and gala evenings.',
      pricePerDay: 900,
      depositAmount: 3000,
      area: 'Labbipet, Vijayawada',
      privateAddress: 'Flat 3B, Sri Sai Residency, Bandar Road, Labbipet, Vijayawada - 520010',
      images: [
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80'
      ],
      pickupPreference: 'Self Pickup'
    },

    // Electronics
    {
      ownerId: owner2.id,
      categoryId: categories['Electronics'],
      title: 'Apple MacBook Pro 16-inch M3 Max (36GB RAM, 1TB SSD)',
      description: 'Powerhouse workstation for video editing, 3D rendering, and software compilation. Liquid Retina XDR display with 120Hz ProMotion. Includes 140W MagSafe charger and protective sleeve.',
      pricePerDay: 2200,
      depositAmount: 15000,
      area: 'Gachibowli, Hyderabad',
      privateAddress: 'Flat 502, Prestige High Fields, ISB Road, Financial District, Gachibowli, Hyderabad - 500032',
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80'
      ],
      pickupPreference: 'Meet at Landmark'
    },
    {
      ownerId: owner3.id,
      categoryId: categories['Electronics'],
      title: 'ViewSonic 4K UHD Portable Projector with Harman Kardon Speakers',
      description: '3000 ANSI Lumens cinema projector with HDR10, built-in dual Harman Kardon speakers, Wi-Fi screen mirroring, and HDMI input. Perfect for rooftop movies and client presentations.',
      pricePerDay: 800,
      depositAmount: 4000,
      area: 'Madhapur, Hyderabad',
      privateAddress: 'Lane 4, Kavuri Hills, Near Durgam Cheruvu, Madhapur, Hyderabad - 500081',
      images: [
        'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=1000&q=80'
      ],
      pickupPreference: 'Doorstep Delivery'
    },
    {
      ownerId: owner1.id,
      categoryId: categories['Electronics'],
      title: 'JBL PartyBox 310 Portable Bluetooth Speaker (240W)',
      description: 'Massive 240-watt punchy sound with dazzling dynamic light shows, splash-proof IPX4 design, built-in mic/guitar inputs, and 18-hour battery life on smooth wheels.',
      pricePerDay: 700,
      depositAmount: 3000,
      area: 'Governorpet, Vijayawada',
      privateAddress: 'Building 12, Besant Road, Near Alankar Theater, Governorpet, Vijayawada - 520002',
      images: [
        'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=80'
      ],
      pickupPreference: 'Self Pickup'
    },

    // Books
    {
      ownerId: owner2.id,
      categoryId: categories['Books'],
      title: 'Complete UPSC CSE Preparation Book Bundle (Prelims & Mains 2026)',
      description: 'Curated 14-book reference collection including Laxmikanth Polity, Ramesh Singh Economy, Spectrum Modern India, and NCERT compilations. Crisp pages with zero markings.',
      pricePerDay: 150,
      depositAmount: 1000,
      area: 'Brodipet, Guntur',
      privateAddress: '3rd Line, Brodipet, Opp. Gandhi Park, Guntur - 522002',
      images: [
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1000&q=80'
      ],
      pickupPreference: 'Self Pickup'
    },
    {
      ownerId: owner3.id,
      categoryId: categories['Books'],
      title: 'Collector Edition Hardcover Box Set: A Song of Ice and Fire',
      description: 'Deluxe slipcase box set of George R.R. Martin epic fantasy series with embossed leatherette covers, full-color foldout maps, and gilded page edges.',
      pricePerDay: 100,
      depositAmount: 800,
      area: 'Jubilee Hills, Hyderabad',
      privateAddress: 'Banjara Hills Road No 10, Near City Center Mall, Hyderabad - 500034',
      images: [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80'
      ],
      pickupPreference: 'Doorstep Delivery'
    },

    // Sports
    {
      ownerId: owner1.id,
      categoryId: categories['Sports'],
      title: 'Yonex Astrox 99 Pro Badminton Racket (Strung with BG65Ti at 28lbs)',
      description: 'Head-heavy professional badminton racket for devastating smash power. Includes Yonex padded thermal thermal bag, extra grip, and a can of AS-30 feather shuttlecocks.',
      pricePerDay: 250,
      depositAmount: 1200,
      area: 'Benz Circle, Vijayawada',
      privateAddress: 'Row House 5, Officers Colony, Near Indira Gandhi Stadium, Benz Circle, Vijayawada - 520010',
      images: [
        'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1613918108466-292b78a8ef95?auto=format&fit=crop&w=1000&q=80'
      ],
      pickupPreference: 'Self Pickup'
    },
    {
      ownerId: owner2.id,
      categoryId: categories['Sports'],
      title: 'Quechua 4-Person Waterproof Camping Tent with Inflatable Mattresses',
      description: 'Easy pop-up geodesic dome tent with Fresh & Black technology to stay cool in the sun. Includes foot pump, 2 double inflatable air mattresses, and camping lantern.',
      pricePerDay: 650,
      depositAmount: 2500,
      area: 'Hitec City, Hyderabad',
      privateAddress: 'Villa 33, Silpa Park, Near Shilparamam Craft Village, Hitec City, Hyderabad - 500084',
      images: [
        'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1000&q=80'
      ],
      pickupPreference: 'Doorstep Delivery'
    }
  ];

  for (const item of listingsData) {
    await prisma.listing.create({ data: item });
  }

  console.log(`✅ Seed completed successfully!`);
  console.log(`Users created: 1 Admin, 3 Owners, 3 Renters (Password: Demo@1234)`);
  console.log(`Categories created: ${Object.keys(categories).length}`);
  console.log(`Listings created: ${listingsData.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
