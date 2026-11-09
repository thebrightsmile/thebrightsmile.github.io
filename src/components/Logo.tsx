import { CLINIC } from '../data/clinic'
import logoUrl from '../assets/logo.svg'

interface LogoMarkProps {
  className?: string
  /** Decorative by default; pass alt text to expose it to assistive tech. */
  alt?: string
}

/** Outlined tooth with a small plus sign, in the clinic's plum. */
export function LogoMark({ className, alt = '' }: LogoMarkProps) {
  return (
    <img
      className={className}
      src={logoUrl}
      width={64}
      height={64}
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
      <span className="brand__badge">
        <LogoMark className="brand__mark" />
      </span>
      <span className="brand__text">
        <span className="brand__name">Rashley Smile</span>
        <span className="brand__sub">Dental Clinic</span>
      </span>
    </a>
  )
}
