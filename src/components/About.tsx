import { CLINIC } from '../data/clinic'
import { CheckIcon, GlobeIcon, MailIcon, PhoneIcon, PinIcon } from './Icons'
import { Reveal } from './Reveal'

/** DEMO: placeholder milestones for presentation. */
const MILESTONES = [
  {
    year: '2018',
    title: 'Opening in Seoul',
    text: 'The clinic opens with one chair and a promise to explain every treatment and its price in plain Filipino and English.',
  },
  {
    year: '2021',
    title: 'Signature brightening',
    text: 'In-clinic whitening becomes the signature treatment, with a take-home kit included in every session.',
  },
  {
    year: '2024',
    title: 'Family Saturdays',
    text: 'Saturday hours are reserved for families, with a gentler first-visit routine for children.',
  },
] as const

const VALUES = [
  {
    title: 'A price range before any treatment',
    text: 'You see the range on this site and the exact quote at your consultation.',
  },
  {
    title: 'Gentle, unhurried care',
    text: 'Numbing first, a steady pace and a running explanation of each step.',
  },
  {
    title: 'Your language, your comfort',
    text: 'Consultations in Filipino or English, whichever puts you at ease.',
  },
] as const

function getInitials(fullName: string): string {
  return fullName
    .split(/\s+/)
    .filter((part) => part.length > 2)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

export function About() {
  return (
    <section id="about" className="section section--tint" aria-labelledby="about-title">
      <div className="container">
        <div className="about__grid">
          <div>
            <Reveal>
              <div className="section__head" style={{ marginBottom: 0 }}>
                <span className="eyebrow">Our story</span>
                <h2 id="about-title" className="h2">
                  Why <span className="italic-accent">The Bright Smile</span> exists
                </h2>
                <p className="story">{CLINIC.story}</p>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <ol className="numerals" aria-label="Clinic milestones">
                {MILESTONES.map((m) => (
                  <li key={m.year} className="numeral">
                    <div className="numeral__year">{m.year}</div>
                    <h3 className="numeral__title">{m.title}</h3>
                    <p className="numeral__text">{m.text}</p>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal delay={120}>
              <ul className="values" aria-label="What we stand for">
                {VALUES.map((v) => (
                  <li key={v.title}>
                    <span className="values__check" aria-hidden="true">
                      <CheckIcon />
                    </span>
                    <div>
                      <strong>{v.title}</strong>
                      <span>{v.text}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={100}>
            <article className="dentist frame" aria-label={`About Dr. ${CLINIC.doctor.fullName}`}>
              <div className="dentist__mono" aria-hidden="true">
                {getInitials(CLINIC.doctor.fullName)}
              </div>
              <div className="dentist__kicker">Your dentist</div>
              <h3 className="dentist__name">
                Dr. {CLINIC.doctor.fullName}
                <small>{CLINIC.doctor.title}</small>
              </h3>
              <p className="dentist__role">{CLINIC.doctor.role}</p>
              <p className="dentist__bio">{CLINIC.doctor.bio}</p>

              <div className="dentist__contact">
                <a className="contact-row" href={CLINIC.contact.phoneHref}>
                  <span className="contact-row__icon">
                    <PhoneIcon />
                  </span>
                  <span>
                    <span className="contact-row__label">Call or text</span>
                    {CLINIC.contact.phoneDisplay}
                  </span>
                </a>
                <a className="contact-row" href={`mailto:${CLINIC.contact.email}`}>
                  <span className="contact-row__icon">
                    <MailIcon />
                  </span>
                  <span>
                    <span className="contact-row__label">Email</span>
                    {CLINIC.contact.email}
                  </span>
                </a>
                <span className="contact-row">
                  <span className="contact-row__icon">
                    <GlobeIcon />
                  </span>
                  <span>
                    <span className="contact-row__label">Website</span>
                    thebrightsmile.github.io
                  </span>
                </span>
                <span className="contact-row">
                  <span className="contact-row__icon">
                    <PinIcon />
                  </span>
                  <span>
                    <span className="contact-row__label">Clinic</span>
                    {CLINIC.name}, {CLINIC.address}
                  </span>
                </span>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
