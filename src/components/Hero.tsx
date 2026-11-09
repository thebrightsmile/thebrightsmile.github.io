import { useMemo } from 'react'
import { BREAK_NOTE, CLINIC, WEEKLY_HOURS } from '../data/clinic'
import { useNow } from '../hooks/useNow'
import {
  formatHoursRange,
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
import { ArrowRightIcon, PhoneIcon } from './Icons'
import { LogoMark } from './Logo'
import { Reveal } from './Reveal'

const DAY_ORDER: Weekday[] = [1, 2, 3, 4, 5, 6, 0]

/** DEMO: presentation-only trust figures. */
const STATS = [
  { value: '6', label: 'Years in Cagayan de Oro' },
  { value: '4.9★', label: 'Average patient rating' },
  { value: '4,200+', label: 'Confident smiles' },
] as const

export function Hero() {
  const now = useNow(15_000)
  const parts = useMemo(() => getZonedParts(now, CLINIC.timeZone), [now])
  const status = useMemo(() => getOpenStatus(parts, WEEKLY_HOURS), [parts])
  const clock = formatMinutes(minutesOfDay(parts))
  const dateLabel = `${WEEKDAY_SHORT[parts.weekday]}, ${MONTH_NAMES[parts.month - 1]} ${parts.day}`

  return (
    <section id="home" className="hero" aria-labelledby="home-title">
      <div className="hero__bg" aria-hidden="true">
        <span className="deco deco--plus" style={{ left: '6%', top: '18%' }} />
        <span className="deco deco--plus deco--sm" style={{ left: '44%', top: '8%' }} />
        <span className="deco deco--dot" style={{ right: '8%', top: '14%' }} />
        <span className="deco deco--dot deco--sm" style={{ right: '5%', top: '20%' }} />
        <span className="deco deco--plus deco--sm" style={{ right: '12%', bottom: '10%' }} />
        <span className="deco deco--dot" style={{ left: '12%', bottom: '14%' }} />
      </div>

      <div className="container hero__grid">
        <div>
          <Reveal>
            <div className={`status status--${status.state}`} role="status" aria-live="polite">
              <span className="status__dot" aria-hidden="true" />
              <span>{status.headline}</span>
              <span className="status__detail">· {status.detail}</span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1 id="home-title" className="h1 hero__title">
              Care with <span className="italic-accent">confidence</span>.
            </h1>
            <p className="hero__motto">{CLINIC.motto}</p>
          </Reveal>

          <Reveal delay={160}>
            <p className="lede">
              {CLINIC.name} is a general dentistry practice in {CLINIC.address}. Dr.{' '}
              {CLINIC.doctor.fullName}, {CLINIC.doctor.title}, offers thoughtful, gentle care with
              clear price ranges, so you always know what to expect.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="hero__actions">
              <button type="button" className="btn btn--primary" onClick={() => scrollToSection('appointment')}>
                Book an appointment
                <ArrowRightIcon className="btn__icon" />
              </button>
              <a className="btn btn--ghost" href={CLINIC.contact.phoneHref}>
                <PhoneIcon className="btn__icon" />
                {CLINIC.contact.phoneDisplay}
              </a>
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
          <article className="hcard" aria-labelledby="avail-title">
            <div className="hcard__side">
              <LogoMark className="hcard__logo" />
              <div>
                <div className="hcard__name">
                  Rashley Smile
                  <br />
                  Dental Clinic
                </div>
                <div className="hcard__tag">{CLINIC.tagline}</div>
              </div>
            </div>
            <div className="hcard__main">
              <div className="hcard__head">
                <div>
                  <h2 id="avail-title" className="hcard__status">
                    {status.headline}
                  </h2>
                  <p className="hcard__detail">{status.detail}</p>
                </div>
                <div className="hcard__clock" aria-live="off">
                  <div className="hcard__time">{clock}</div>
                  <div className="hcard__date">{dateLabel}</div>
                </div>
              </div>

              <ul className="hours">
                {DAY_ORDER.map((day) => {
                  const hours = WEEKLY_HOURS[day]
                  const isToday = day === parts.weekday
                  return (
                    <li key={day} className={`hours__row ${isToday ? 'hours__row--today' : ''}`}>
                      <span className="hours__day">
                        {WEEKDAY_NAMES[day]}
                        {isToday ? <span className="hours__badge">Today</span> : null}
                      </span>
                      <span className={`hours__time ${hours ? '' : 'hours__time--closed'}`}>
                        {formatHoursRange(hours)}
                      </span>
                    </li>
                  )
                })}
              </ul>

              <div className="hcard__foot">
                <span>{BREAK_NOTE}</span>
                <button type="button" className="btn btn--primary btn--sm" onClick={() => scrollToSection('appointment')}>
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
