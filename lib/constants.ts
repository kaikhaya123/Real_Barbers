// Business information
export const BUSINESS_INFO = {
  name: 'Real Barbershop ™️',
  tagline: 'Premium Haircuts in the Heart of Durban',
  address: 'Mbhele Street, Durban, KwaZulu Natal, South Africa',
  phone: '+27 68 277 0367',
  whatsapp: '27682770367',
  email: 'info@realbarbershop.co.za',
  hours: {
    weekdays: '9:00 AM - 7:00 PM',
    saturday: '8:00 AM - 6:00 PM',
    sunday: '9:00 AM - 3:00 PM',
  },
  coordinates: {
    lat: -29.8587,
    lng: 31.0218,
  },
}

// Services offered
export const SERVICES = [
  {
    id: 'high-fade-dye',
    name: 'HIGH FADE & DYE',
    description: 'Traditional haircut with modern finishing touches',
    duration: 45,
    price: 150,
    image: '/Images/1767460998971.jpeg',
    category: 'Adults',
  },
  {
    id: 'taper-fade-dye',
    name: 'TAPER FADE & DYE',
    description: 'Precision fade with personalized styling',
    duration: 60,
    price: 150,
    image: '/Images/1767460172187.webp',
    category: 'Adults',
  },
  {
    id: 'kiddies-cut-style',
    name: 'KIDDIES CUT & STYLE',
    description: 'Haircut and style for children',
    duration: 30,
    price: 80,
    image: '/Images/1767330787427.jpeg',
    category: 'Kids',
  },
  {
    id: 'plain-fade',
    name: 'PLAIN FADE',
    description: 'Clean, classic fade',
    duration: 45,
    price: 60,
    image: '/Images/1767460172187.webp',
    category: 'Adults',
  },
  {
    id: 'chiskop',
    name: 'CHISKOP',
    description: 'Deep cleanse with premium products',
    duration: 20,
    price: 50,
    image: '/Images/1767460998971.jpeg',
    category: 'Treatment',
  },
]

// Barber profiles
export const BARBERS = [
  {
    id: 'Mfanafuthi',
    name: 'Mfanafuthi Ngcobo',
    title: 'Master Barber',
    experience: '7 years',
    specialties: ['Fades', 'Beard Sculpting', 'Traditional Cuts'],
    bio: 'Mfanafuthu has been perfecting his craft for his years of experience. Known for his precision fades and attention to detail.',
    image: '/Images/1767460998971.jpeg',
    available: true,
  },
  {
    id: 'Sbonga',
    name: 'Sbonga',
    title: 'Senior Barber',
    experience: ' 2 years',
    specialties: ['Modern Styles', 'Hair Designs', 'Color'],
    bio: 'Sbonga stays on top of the latest trends and brings creative energy to every cut as a young barber.',
    image: '/Images/1767460172187.webp',
    available: true,
  },
  {
    id: 'john',
    name: 'John Dlamini',
    title: 'Barber',
    experience: '5 years',
    specialties: ['Classic Cuts', 'Hot Towel Shaves', 'Grooming'],
    bio: 'John specializes in traditional barbering techniques and provides a relaxing experience.',
    image: '/Images/1767330787427.jpeg',
    available: true,
  },
]

// Booking time slots (in 24-hour format)
export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
]

// Operating hours by day
export const OPERATING_HOURS = {
  0: { open: '09:00', close: '15:00' }, // Sunday
  1: { open: '09:00', close: '19:00' }, // Monday
  2: { open: '09:00', close: '19:00' }, // Tuesday
  3: { open: '09:00', close: '19:00' }, // Wednesday
  4: { open: '09:00', close: '19:00' }, // Thursday
  5: { open: '09:00', close: '19:00' }, // Friday
  6: { open: '08:00', close: '18:00' }, // Saturday
}
