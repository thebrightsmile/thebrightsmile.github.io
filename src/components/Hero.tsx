import { useMemo } from 'react'
import { BREAK_NOTE, CLINIC, WEEKLY_HOURS } from '../data/clinic'
import { useNow } from '../hooks/useNow'
import {
  formatMinutes,
  getOpenStatus,
  getZonedParts,
  minutesOfDay,
  MONTH_NAMES,
  WEEKDAY_NAMES,
  WEEKDAY_SHORT,
  type Weekday,
} from '../lib/time'
import { scrollToSection } from '../lib/scroll'
import { ArrowRightIcon } from './Icons'
import { LogoMark } from './Logo'
import { Reveal } from './Reveal'

const DAY_ORDER: Weekday[] = [1, 2, 3, 4, 5, 6, 0]

/** DEMO: presentation-only trust figures. */
const STATS = [
  { value: '7', label: 'Years in Seoul' },
  { value: '4.9★', label: 'Patient rating' },
  { value: '5,000+', label: 'Brighter smiles' },
] as const

export function Hero() {
  const now = useNow(15_000)
  const parts = useMemo(() => getZonedParts(now, CLINIC.timeZone), [now])
  const status = useMemo(() => getOpenStatus(parts, WEEKLY_HOURS), [parts])
  const clock = formatMinutes(minutesOfDay(parts))
  const dateLabel = `${WEEKDAY_NAMES[parts.weekday]}, ${MONTH_NAMES[parts.month - 1]} ${parts.day}`

  return (
    <section id="home" className="hero" aria-labelledby="home-title">
      <div className="hero__glow" aria-hidden="true" />

      <div className="container">
        <div className="hero__content">
          <Reveal>
            <LogoMark className="hero__emblem" large />
          </Reveal>

          <Reveal delay={60}>
            <span className="eyebrow">
              {CLINIC.shortName} · Philippines Dental Clinic · {CLINIC.address}
            </span>
          </Reveal>

          <Reveal delay={120}>
            <h1 id="home-title" className="h1 hero__title">
              Healthy smiles, <span className="italic-accent">brighter</span> futures.
            </h1>
            <p className="hero__script script">{CLINIC.motto}</p>
          </Reveal>

          <Reveal delay={200}>
            <p className="lede">
              General dentistry and signature smile brightening for Filipino families in Seoul,
              led by Dr. {CLINIC.doctor.fullName}, {CLINIC.doctor.title}. Every treatment comes
              with a peso price range before you sit in the chair.
            </p>
          </Reveal>

          <Reveal delay={260}>
            <div className="hero__actions">
              <div className={`status status--${status.state}`} role="status" aria-live="polite">
                <span className="status__dot" aria-hidden="true" />
                <span>{status.headline}</span>
                <span className="status__detail">· {status.detail}</span>
              </div>
            </div>
            <div className="hero__actions" style={{ marginTop: 14 }}>
              <button type="button" className="btn btn--gold" onClick={() => scrollToSection('appointment')}>
                Reserve a visit
                <ArrowRightIcon className="btn__icon" />
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => scrollToSection('services')}>
                View treatments
              </button>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <dl className="hero__trust">
              {STATS.map((s) => (
                <div key={s.label} className="stat">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="stat__value" style={{ margin: 0 }}>
                    {s.value}
                  </dd>
                  <dd className="stat__label" style={{ margin: 0 }}>
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <article className="ticket frame" aria-labelledby="avail-title">
            <div className="ticket__side">
              <div className="ticket__label">Clinic availability</div>
              <h2 id="avail-title" className="ticket__status">
                {status.headline}
              </h2>
              <p className="ticket__detail">{status.detail}</p>
              <div className="ticket__clock" aria-live="off">
                <div className="ticket__time">{clock}</div>
                <div className="ticket__date">{dateLabel} · Seoul time</div>
              </div>
            </div>
            <div className="ticket__main">
              <ul className="days" aria-label="Weekly hours">
                {DAY_ORDER.map((day) => {
                  const hours = WEEKLY_HOURS[day]
                  const isToday = day === parts.weekday
                  return (
                    <li
                      key={day}
                      className={`day ${isToday ? 'day--today' : ''} ${hours ? '' : 'day--closed'}`}
                    >
                      <span className="day__name">{WEEKDAY_SHORT[day]}</span>
                      {hours ? (
                        <span className="day__time">
                          {formatMinutes(hours.open)}
                          <br />
                          {formatMinutes(hours.close)}
                        </span>
                      ) : (
                        <span className="day__time day__time--closed">Closed</span>
                      )}
                      {isToday ? <span className="day__badge">Today</span> : null}
                    </li>
                  )
                })}
              </ul>
              <div className="ticket__foot">
                <span>{BREAK_NOTE}</span>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => scrollToSection('appointment')}>
                  See open slots
                </button>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  )
}
