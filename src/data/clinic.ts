/**
 * Single source of truth for clinic information shown across the site.
 * Values marked DEMO are placeholders for presentation and should be replaced
 * with real data before launch.
 */
import type { DayHours, Weekday } from '../lib/time'

export const CLINIC = {
  name: 'Rashley Smile Dental Clinic',
  shortName: 'Rashley Smile',
  tagline: 'Care with confidence.',
  motto: 'Your smile, our priority.',
  address: 'Cagayan de Oro',
  /** IANA time zone used for "open now" and appointment slot calculations. */
  timeZone: 'Asia/Manila',
  /** DEMO: placeholder founding date. */
  establishedYear: 2020,
  establishedMonth: 'June',
  /** DEMO: placeholder founding story. */
  story:
    'Rashley Smile Dental Clinic was established in June 2020, in the middle of a year when many people in Cagayan de Oro stopped seeing a dentist altogether. We opened with strict sterilisation, longer appointment slots and one guiding idea: patients deserve to understand their treatment and its cost before they sit in the chair. That idea still shapes everything we do, from clear price ranges to unhurried, gentle care.',
  doctor: {
    fullName: 'Rashley Jade B. Oguis',
    title: 'DMD',
    role: 'Doctor of Dental Medicine · General Dentist',
    /** DEMO: placeholder biography for presentation. */
    bio: 'Dr. Oguis is a general dentist who combines careful, evidence-based treatment with a calm chairside manner. She is known for patient explanations, a light touch with anxious patients, and for making sure every family that walks in leaves with a plan they understand.',
  },
  contact: {
    /** Shown exactly as supplied by the client. */
    phoneDisplay: '0904 6284 7922',
    phoneHref: 'tel:+6390462847922',
    email: 'rashleysmile@clinic.com',
  },
} as const

/**
 * Weekly opening hours in minutes from midnight (clinic local time).
 * `null` means closed for the whole day. 0 = Sunday … 6 = Saturday.
 */
export const WEEKLY_HOURS: Readonly<Record<Weekday, DayHours | null>> = {
  0: null,
  1: { open: 9 * 60, close: 17 * 60, breakStart: 12 * 60, breakEnd: 13 * 60 },
  2: { open: 9 * 60, close: 17 * 60, breakStart: 12 * 60, breakEnd: 13 * 60 },
  3: { open: 9 * 60, close: 17 * 60, breakStart: 12 * 60, breakEnd: 13 * 60 },
  4: { open: 9 * 60, close: 17 * 60, breakStart: 12 * 60, breakEnd: 13 * 60 },
  5: { open: 9 * 60, close: 17 * 60, breakStart: 12 * 60, breakEnd: 13 * 60 },
  6: { open: 9 * 60, close: 15 * 60 },
}

/** Human-readable summary of the break, shown next to the hours. */
export const BREAK_NOTE = 'Lunch break 12:00 – 1:00 PM on weekdays'

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
    priceMin: 400,
    priceMax: 700,
    durationMinutes: 30,
    description: 'A complete check of teeth, gums and bite, with your options and price range explained before anything starts.',
    icon: 'tooth',
  },
  {
    id: 'cleaning',
    name: 'Oral Prophylaxis (Cleaning)',
    category: 'Preventive',
    priceMin: 900,
    priceMax: 1400,
    durationMinutes: 45,
    description: 'Gentle scaling and polishing that removes plaque, tartar and surface stains for a fresh, confident smile.',
    icon: 'sparkle',
    popular: true,
  },
  {
    id: 'fluoride',
    name: 'Fluoride Treatment',
    category: 'Preventive',
    priceMin: 600,
    priceMax: 900,
    durationMinutes: 20,
    description: 'A protective varnish that strengthens enamel and helps prevent cavities between visits.',
    icon: 'shield',
  },
  {
    id: 'sealants',
    name: 'Pit & Fissure Sealants',
    category: 'Preventive',
    priceMin: 700,
    priceMax: 1100,
    priceUnit: 'per tooth',
    durationMinutes: 30,
    description: 'A thin coating over the chewing grooves of back teeth, where decay most often begins.',
    icon: 'shield',
  },
  {
    id: 'xray',
    name: 'Digital X-ray',
    category: 'Preventive',
    priceMin: 450,
    priceMax: 750,
    durationMinutes: 20,
    description: 'Low-dose imaging that shows what lies between and beneath the teeth before we decide on care.',
    icon: 'xray',
  },
  {
    id: 'filling',
    name: 'Tooth-coloured Filling',
    category: 'Restorative',
    priceMin: 1200,
    priceMax: 2800,
    priceUnit: 'per tooth',
    durationMinutes: 60,
    description: 'Composite fillings matched to your tooth shade. The range depends on the size of the cavity.',
    icon: 'drill',
    popular: true,
  },
  {
    id: 'extraction',
    name: 'Simple Tooth Extraction',
    category: 'Restorative',
    priceMin: 1200,
    priceMax: 3000,
    priceUnit: 'per tooth',
    durationMinutes: 45,
    description: 'Careful removal of a damaged or loose tooth under local anaesthesia, with clear aftercare instructions.',
    icon: 'extract',
  },
  {
    id: 'root-canal',
    name: 'Root Canal Therapy',
    category: 'Restorative',
    priceMin: 7000,
    priceMax: 14000,
    priceUnit: 'per tooth',
    durationMinutes: 90,
    description: 'Relieves pain and saves an infected tooth. Front teeth sit at the lower end of the range, molars at the higher.',
    icon: 'root',
  },
  {
    id: 'crown',
    name: 'Dental Crown',
    category: 'Restorative',
    priceMin: 10000,
    priceMax: 18000,
    priceUnit: 'per tooth',
    durationMinutes: 90,
    description: 'A custom cap that restores a weakened or heavily filled tooth. The range reflects the material chosen.',
    icon: 'crown',
  },
  {
    id: 'dentures',
    name: 'Partial & Complete Dentures',
    category: 'Restorative',
    priceMin: 12000,
    priceMax: 30000,
    durationMinutes: 60,
    description: 'Comfortable, natural-looking replacements for missing teeth, fitted over a few short visits.',
    icon: 'denture',
  },
  {
    id: 'night-guard',
    name: 'Custom Night Guard',
    category: 'Restorative',
    priceMin: 3500,
    priceMax: 5500,
    durationMinutes: 30,
    description: 'A made-to-measure guard that protects teeth from grinding and eases jaw tension overnight.',
    icon: 'shield',
  },
  {
    id: 'whitening',
    name: 'Teeth Whitening',
    category: 'Cosmetic',
    priceMin: 10000,
    priceMax: 16000,
    durationMinutes: 90,
    description: 'In-clinic professional whitening for a visibly brighter smile in a single visit.',
    icon: 'sparkle',
    popular: true,
  },
  {
    id: 'kids-checkup',
    name: 'Kids Check-up & Cleaning',
    category: 'Kids',
    priceMin: 700,
    priceMax: 1100,
    durationMinutes: 40,
    description: 'A friendly first visit with a gentle cleaning, a look at growing teeth and a prize for bravery.',
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
