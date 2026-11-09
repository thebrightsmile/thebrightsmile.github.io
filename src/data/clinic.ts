/**
 * Single source of truth for clinic information shown across the site.
 * Values marked DEMO are placeholders for presentation and should be replaced
 * with real data before launch.
 */
import type { DayHours, Weekday } from '../lib/time'

export const CLINIC = {
  name: 'The Bright Smile Philippines Dental Clinic',
  shortName: 'The Bright Smile',
  tagline: 'Healthy smiles, brighter futures.',
  motto: 'The only clinic that gives you the brightest smile to the world.',
  address: 'Seoul, Korea',
  /** IANA time zone used for "open now" and appointment slot calculations. */
  timeZone: 'Asia/Seoul',
  /** DEMO: placeholder founding date. */
  establishedYear: 2018,
  establishedMonth: 'September',
  /** DEMO: placeholder founding story. */
  story:
    'The Bright Smile opened in September 2018 to serve Filipino families living and working in Seoul, who told us the same thing again and again: they wanted a dentist who spoke their language, explained prices before treatment, and treated a routine cleaning with the same care as a cosmetic case. We built the clinic around that request. Every visit starts with a clear plan and a peso price range, and ends with a smile that is healthier, and a little brighter, than the one you walked in with.',
  doctor: {
    fullName: 'Ian Paul Tagaro',
    title: 'DMD',
    role: 'Doctor of Dental Medicine · General Dentist',
    /** DEMO: placeholder biography for presentation. */
    bio: 'Dr. Tagaro is a general dentist with a particular interest in preventive care and smile brightening. He is known for a steady hand, straightforward explanations, and for making sure every patient understands both the treatment and its price range before anything begins.',
  },
  contact: {
    phoneDisplay: '0908 765 4321',
    phoneHref: 'tel:+639087654321',
    email: 'thebrightsmile@clinic.com',
  },
} as const

/**
 * Weekly opening hours in minutes from midnight (clinic local time).
 * `null` means closed for the whole day. 0 = Sunday … 6 = Saturday.
 */
export const WEEKLY_HOURS: Readonly<Record<Weekday, DayHours | null>> = {
  0: null,
  1: { open: 9 * 60, close: 18 * 60, breakStart: 12 * 60 + 30, breakEnd: 13 * 60 + 30 },
  2: { open: 9 * 60, close: 18 * 60, breakStart: 12 * 60 + 30, breakEnd: 13 * 60 + 30 },
  3: { open: 9 * 60, close: 18 * 60, breakStart: 12 * 60 + 30, breakEnd: 13 * 60 + 30 },
  4: { open: 9 * 60, close: 18 * 60, breakStart: 12 * 60 + 30, breakEnd: 13 * 60 + 30 },
  5: { open: 9 * 60, close: 18 * 60, breakStart: 12 * 60 + 30, breakEnd: 13 * 60 + 30 },
  6: { open: 10 * 60, close: 16 * 60 },
}

/** Human-readable summary of the break, shown next to the hours. */
export const BREAK_NOTE = 'Lunch break 12:30 – 1:30 PM on weekdays'

/** Appointment slot granularity in minutes. */
export const SLOT_STEP_MINUTES = 30
/** Earliest same-day booking lead time in minutes. */
export const BOOKING_LEAD_MINUTES = 60
/** How far ahead patients may book, in days. */
export const BOOKING_HORIZON_DAYS = 60

export type ServiceCategory = 'Preventive' | 'Restorative' | 'Cosmetic' | 'Kids'

export interface Service {
  id: string
  name: string
  category: ServiceCategory
  /** Price range in Philippine pesos. DEMO values. */
  priceMin: number
  priceMax: number
  /** Appended to the price, e.g. "per tooth". */
  priceUnit?: string
  /** Appointment length in minutes; used to block slots. */
  durationMinutes: number
  description: string
  icon: ServiceIcon
  popular?: boolean
}

export type ServiceIcon =
  | 'tooth'
  | 'sparkle'
  | 'shield'
  | 'drill'
  | 'crown'
  | 'braces'
  | 'xray'
  | 'root'
  | 'extract'
  | 'implant'
  | 'denture'
  | 'child'

export const SERVICE_CATEGORIES: readonly ServiceCategory[] = [
  'Preventive',
  'Restorative',
  'Cosmetic',
  'Kids',
]

/** DEMO: general-dentistry services with indicative peso price ranges. */
export const SERVICES: readonly Service[] = [
  {
    id: 'consultation',
    name: 'Consultation & Oral Exam',
    category: 'Preventive',
    priceMin: 600,
    priceMax: 900,
    durationMinutes: 30,
    description: 'A thorough look at teeth, gums and bite, followed by a plan and a price range before anything begins.',
    icon: 'tooth',
  },
  {
    id: 'cleaning',
    name: 'Oral Prophylaxis (Cleaning)',
    category: 'Preventive',
    priceMin: 1200,
    priceMax: 1800,
    durationMinutes: 45,
    description: 'Ultrasonic scaling and a polish that lifts plaque, tartar and everyday stains.',
    icon: 'sparkle',
    popular: true,
  },
  {
    id: 'fluoride',
    name: 'Fluoride Treatment',
    category: 'Preventive',
    priceMin: 800,
    priceMax: 1100,
    durationMinutes: 20,
    description: 'A quick varnish that hardens enamel and helps keep cavities away between visits.',
    icon: 'shield',
  },
  {
    id: 'sealants',
    name: 'Pit & Fissure Sealants',
    category: 'Preventive',
    priceMin: 900,
    priceMax: 1300,
    priceUnit: 'per tooth',
    durationMinutes: 30,
    description: 'A protective coating over the grooves of molars, where decay tends to start.',
    icon: 'shield',
  },
  {
    id: 'xray',
    name: 'Digital X-ray',
    category: 'Preventive',
    priceMin: 600,
    priceMax: 900,
    durationMinutes: 20,
    description: 'Low-dose imaging that reveals what sits between and beneath the teeth.',
    icon: 'xray',
  },
  {
    id: 'filling',
    name: 'Tooth-coloured Filling',
    category: 'Restorative',
    priceMin: 1800,
    priceMax: 3500,
    priceUnit: 'per tooth',
    durationMinutes: 60,
    description: 'Composite fillings shaded to match your tooth. The range follows the size of the cavity.',
    icon: 'drill',
    popular: true,
  },
  {
    id: 'extraction',
    name: 'Simple Tooth Extraction',
    category: 'Restorative',
    priceMin: 1800,
    priceMax: 4000,
    priceUnit: 'per tooth',
    durationMinutes: 45,
    description: 'Careful removal of a damaged or loose tooth under local anaesthesia, with written aftercare.',
    icon: 'extract',
  },
  {
    id: 'root-canal',
    name: 'Root Canal Therapy',
    category: 'Restorative',
    priceMin: 9000,
    priceMax: 16000,
    priceUnit: 'per tooth',
    durationMinutes: 90,
    description: 'Relieves pain and saves an infected tooth. Front teeth sit low in the range, molars higher.',
    icon: 'root',
  },
  {
    id: 'crown',
    name: 'Dental Crown',
    category: 'Restorative',
    priceMin: 14000,
    priceMax: 22000,
    priceUnit: 'per tooth',
    durationMinutes: 90,
    description: 'A custom cap that restores a weakened tooth. The range reflects the material you choose.',
    icon: 'crown',
  },
  {
    id: 'dentures',
    name: 'Partial & Complete Dentures',
    category: 'Restorative',
    priceMin: 18000,
    priceMax: 40000,
    durationMinutes: 60,
    description: 'Comfortable, natural-looking replacements for missing teeth, fitted over a few short visits.',
    icon: 'denture',
  },
  {
    id: 'night-guard',
    name: 'Custom Night Guard',
    category: 'Restorative',
    priceMin: 4500,
    priceMax: 7000,
    durationMinutes: 30,
    description: 'A made-to-measure guard that protects against grinding and eases jaw tension overnight.',
    icon: 'shield',
  },
  {
    id: 'whitening',
    name: 'Teeth Whitening',
    category: 'Cosmetic',
    priceMin: 14000,
    priceMax: 20000,
    durationMinutes: 90,
    description: 'Our signature in-clinic brightening for a visibly whiter smile in a single visit, with a take-home kit.',
    icon: 'sparkle',
    popular: true,
  },
  {
    id: 'kids-checkup',
    name: 'Kids Check-up & Cleaning',
    category: 'Kids',
    priceMin: 900,
    priceMax: 1300,
    durationMinutes: 40,
    description: 'A friendly first visit: gentle cleaning, a look at growing teeth and a prize for bravery.',
    icon: 'child',
  },
]

export function findService(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id)
}

const pesoFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  maximumFractionDigits: 0,
})

export function formatPeso(amount: number): string {
  return pesoFormatter.format(amount)
}

/** "₱1,000 – ₱1,500" or a single figure when min and max match. */
export function formatPriceRange(service: Pick<Service, 'priceMin' | 'priceMax'>): string {
  if (service.priceMin === service.priceMax) return formatPeso(service.priceMin)
  return `${formatPeso(service.priceMin)} – ${formatPeso(service.priceMax)}`
}
