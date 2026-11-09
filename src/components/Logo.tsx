import { CLINIC } from '../data/clinic'
import logoSmall from '../assets/logo-192.png'
import logoLarge from '../assets/logo-512.png'

interface LogoMarkProps {
  className?: string
  /** Use the 512 px version for large placements. */
  large?: boolean
  /** Decorative by default; pass alt text to expose it to assistive tech. */
  alt?: string
}

/** The clinic's tooth-and-gold-ring emblem, taken from the client's artwork. */
export function LogoMark({ className, large = false, alt = '' }: LogoMarkProps) {
  const size = large ? 512 : 192
  return (
    <img
      className={className}
      src={large ? logoLarge : logoSmall}
      width={size}
      height={size}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      decoding="async"
    />
  )
}

interface BrandProps {
  onClick?: () => void
  href?: string
}

export function Brand({ onClick, href = '#home' }: BrandProps) {
  return (
    <a
      href={href}
      className="brand"
      aria-label={`${CLINIC.name} — back to top`}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <LogoMark className="brand__mark" />
      <span className="brand__text">
        <span className="brand__name">The Bright Smile</span>
        <span className="brand__sub">Philippines Dental Clinic</span>
      </span>
    </a>
  )
}
