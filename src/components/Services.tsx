import { useState } from 'react'
import {
  formatPriceRange,
  SERVICE_CATEGORIES,
  SERVICES,
  type Service,
  type ServiceCategory,
} from '../data/clinic'
import { ArrowRightIcon } from './Icons'
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
            <span className="eyebrow">Treatment menu &amp; price ranges</span>
            <h2 id="services-title" className="h2">
              General dentistry, <span className="italic-accent">transparently</span> priced
            </h2>
            <p className="lede">
              Every treatment is listed with a peso price range. Your exact quote is confirmed
              at your consultation, before anything begins.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="filters" role="group" aria-label="Filter treatments by category">
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

        <Reveal delay={120}>
          <div className="menu frame" aria-live="polite">
            {visible.map((service, i) => (
              <article
                // Keying on filter re-runs the entrance animation after filtering.
                key={`${filter}-${service.id}`}
                className="menu__item service"
                style={{ animationDelay: `${Math.min(i, 10) * 35}ms` }}
              >
                <div className="menu__line">
                  <h3 className="menu__name">
                    {service.name}
                    {service.popular ? <small>Popular</small> : null}
                  </h3>
                  <span className="menu__leader" aria-hidden="true" />
                  <span className="menu__price">{formatPriceRange(service)}</span>
                </div>
                <div className="menu__meta">
                  <p className="menu__desc">
                    {service.description}{' '}
                    <span className="menu__unit">
                      · {service.category}
                      {service.priceUnit ? ` · ${service.priceUnit}` : ''} · ≈ {service.durationMinutes} min
                    </span>
                  </p>
                  <button
                    type="button"
                    className="menu__book"
                    onClick={() => onBook(service)}
                    aria-label={`Book ${service.name}`}
                  >
                    Reserve
                    <ArrowRightIcon />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </Reveal>

        <p className="services__note">
          Ranges are in Philippine pesos (₱) and cover typical cases; complex cases are quoted
          individually.
        </p>
      </div>
    </section>
  )
}
