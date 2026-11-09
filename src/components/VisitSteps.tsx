import { CalendarIcon, CheckIcon, HeartIcon, ToothIcon } from './Icons'
import { Reveal } from './Reveal'

const STEPS = [
  {
    icon: CalendarIcon,
    title: 'Book in a minute',
    text: 'Pick a treatment and an open slot online. We confirm by text or email.',
  },
  {
    icon: ToothIcon,
    title: 'Consult and quote',
    text: 'A gentle exam, then a plan with a price inside the range you saw before you came.',
  },
  {
    icon: HeartIcon,
    title: 'Care at your pace',
    text: 'Numbing first, no rushing, and a running explanation of every step.',
  },
  {
    icon: CheckIcon,
    title: 'Leave confident',
    text: 'Written aftercare and a reminder when your next check-up is due.',
  },
] as const

/** Four-step "what to expect" band shown under the hero. */
export function VisitSteps() {
  return (
    <section className="visit" aria-labelledby="visit-title">
      <div className="container">
        <Reveal>
          <div className="visit__head">
            <h2 id="visit-title" className="visit__title">
              What to expect at your visit
            </h2>
            <p className="visit__sub">Four simple steps, the same every time.</p>
          </div>
        </Reveal>
        <ol className="visit__steps">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            return (
              <Reveal key={s.title} as="li" delay={i * 70} className="visit__step">
                <span className="visit__num">0{i + 1}</span>
                <span className="visit__icon" aria-hidden="true">
                  <Icon />
                </span>
                <h3 className="visit__step-title">{s.title}</h3>
                <p className="visit__text">{s.text}</p>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
