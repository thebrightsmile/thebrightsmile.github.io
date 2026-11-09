import { useState } from 'react'
import {
  formatPriceRange,
  SERVICE_CATEGORIES,
  SERVICES,
  type Service,
  type ServiceCategory,
} from '../data/clinic'
import { ArrowRightIcon, ServiceGlyph } from './Icons'
import { Reveal } from './Reveal'

type Filter = 'All' | ServiceCategory

interface ServicesProps {
  onBook: (service: Service) => void
}

export function Services({ onBook }: ServicesProps) {
  const [filter, setFilter] = useState<Filter>('All')
  const visible = filter === 'All' ? SERVICES : SERVICES.filter((s) => s.category === filter)

  return (
    <section id="services" className="section" aria-labelledby="services-title">
      <div className="container">
        <Reveal>
          <div className="section__head section__head--center">
            <span className="eyebrow">Services &amp; price ranges</span>
            <h2 id="services-title" className="h2">
              Everyday dentistry, <span className="italic-accent">clearly priced</span>
            </h2>
            <p className="lede">
              Every treatment is listed with a price range so you can plan with confidence. Your
              exact quote is confirmed at your consultation, before anything begins.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="filters" role="group" aria-label="Filter services by category">
            {(['All', ...SERVICE_CATEGORIES] as Filter[]).map((cat) => (
              <button
                key={cat}
                type="button"
                className="chip"
                aria-pressed={filter === cat}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="svc-grid" aria-live="polite">
          {visible.map((service, i) => (
            <article
              // Keying on filter re-runs the entrance animation after filtering.
              key={`${filter}-${service.id}`}
              className="service"
              style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}
            >
              <div className="service__top">
                <span className="service__icon">
                  <ServiceGlyph icon={service.icon} />
                </span>
                <span className={`service__cat ${service.popular ? 'service__cat--popular' : ''}`}>
                  {service.popular ? 'Popular' : service.category}
                </span>
              </div>
              <h3 className="service__name">{service.name}</h3>
              <p className="service__desc">{service.description}</p>
              <div className="service__foot">
                <div>
                  <span className="price__label">Price range</span>
                  <span className="price__value">{formatPriceRange(service)}</span>
                  {service.priceUnit ? <span className="price__unit">{service.priceUnit}</span> : null}
                  <span className="price__dur">≈ {service.durationMinutes} min</span>
                </div>
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => onBook(service)}
                  aria-label={`Book ${service.name}`}
                >
                  Book
                  <ArrowRightIcon className="btn__icon" />
                </button>
              </div>
            </article>
          ))}
        </div>

        <p className="services__note">
          Ranges are in Philippine pesos (₱) and cover typical cases; complex cases are quoted
          individually. Senior citizen and PWD discounts apply as provided by law.
        </p>
      </div>
    </section>
  )
}
