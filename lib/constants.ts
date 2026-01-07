// Business information
export const BUSINESS_INFO = {
  name: 'Pro Barber Shop ZA',
  tagline: 'Sharp Cuts. Fresh Looks. Professional Service.',
  address: 'Durban, KwaZulu-Natal, South Africa',
  phone: '+27 68 218 8679',
  whatsapp: '27682188679',
  email: 'goodhopengcobo5@gmail.com',
  instagram: '@pro_barber_shop.za',
  instagramStats: { posts: 42, followers: 217 },
  hours: {
    weekdays: '08:00 - 18:00',
    saturday: '08:00 - 20:00',
    sunday: 'Closed or by special arrangement',
  },
  coordinates: {
    lat: -29.8587,
    lng: 31.0218,
  },
} 

// Services offered
export const SERVICES = [
  {
    id: 'professional-haircut',
    name: 'PROFESSIONAL HAIRCUT',
    description: 'Expert cuts tailored to your style and face shape',
    duration: 45,
    price: 0, // pricing to be added later
    image: '/Images/1767460998971.jpeg',
    category: 'Adults',
  },
  {
    id: 'modern-fade-taper',
    name: 'MODERN FADE & TAPER',
    description: 'Contemporary fades and tapering with precision finishing',
    duration: 60,
    price: 0,
    image: '/Images/1767460172187.webp',
    category: 'Adults',
  },
  {
    id: 'beard-grooming',
    name: 'BEARD GROOMING & SHAPING',
    description: 'Beard trims, sculpting and maintenance for a polished look',
    duration: 30,
    price: 0,
    image: '/Images/1767330787427.jpeg',
    category: 'Grooming',
  },
  {
    id: 'clean-shave',
    name: 'CLEAN SHAVE',
    description: 'Traditional straight-razor shave with hot towel finish',
    duration: 30,
    price: 0,
    image: '/Images/1767330865876.jpeg',
    category: 'Grooming',
  },
  {
    id: 'hot-towel',
    name: 'HOT TOWEL TREATMENT',
    description: 'Relaxing hot towel and facial treatment to finish your service',
    duration: 20,
    price: 0,
    image: '/Images/1767331692043.jpeg',
    category: 'Treatment',
  },
  {
    id: 'kids-haircut',
    name: "KIDS HAIRCUT",
    description: 'Friendly and efficient kids cuts',
    duration: 30,
    price: 0,
    image: '/Images/1767330787427.jpeg',
    category: 'Kids',
  },
  {
    id: 'styling-finishing',
    name: 'STYLING & FINISHING',
    description: 'Styling and finishing touches to complete the look',
    duration: 20,
    price: 0,
    image: '/Images/1767331960061.jpeg',
    category: 'Styling',
  },
]

// Barber profiles
export const BARBERS = [
  {
    id: 'mfanafuthi',
    name: 'Mfanafuthi Ngcobo',
    title: 'Professional Barber',
    experience: '7+ years',
    specialties: ['Professional Haircuts', 'Modern Fades', 'Beard Grooming', 'Hot Towel Treatments'],
    bio: 'Mfanafuthi is the master barber at Pro Barber Shop ZA, dedicated to delivering sharp, clean cuts with professional precision. With over 7 years of experience, he specializes in modern fades, traditional cuts, and expert beard sculpting. Every client receives personalized attention and consistent quality service.',
    image: '/Images/1767460998971.jpeg',
  },
]

// Booking time slots (in 24-hour format)
export const TIME_SLOTS = [
  '08:00','08:30','09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00','18:30','19:00','19:30','20:00'
]

// Operating hours by day
export const OPERATING_HOURS = {
  0: { open: '00:00', close: '00:00' }, // Sunday - closed / by arrangement
  1: { open: '08:00', close: '18:00' }, // Monday
  2: { open: '08:00', close: '18:00' }, // Tuesday
  3: { open: '08:00', close: '18:00' }, // Wednesday
  4: { open: '08:00', close: '18:00' }, // Thursday
  5: { open: '08:00', close: '18:00' }, // Friday
  6: { open: '08:00', close: '20:00' }, // Saturday
}
