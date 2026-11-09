import { CLINIC } from '../data/clinic'
import { CalendarIcon, HeartIcon, MailIcon, PhoneIcon, PinIcon, StarIcon } from './Icons'
import { Reveal } from './Reveal'

/** DEMO: placeholder milestones for presentation. */
const MILESTONES = [
  {
    year: '2020',
    title: 'Opening in a difficult year',
    text: 'The clinic opens in June 2020 with strict sterilisation protocols and longer, calmer appointment slots.',
  },
  {
    year: '2022',
    title: 'Digital X-rays arrive',
    text: 'Low-dose digital imaging replaces film, making diagnosis faster and safer for every patient.',
  },
  {
    year: '2024',
    title: 'Family Saturdays',
    text: 'Saturday hours are set aside for families, with a gentler first-visit routine for children.',
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
  const yearsOpen = new Date().getFullYear() - CLINIC.establishedYear

  return (
    <section id="about" className="section section--tint" aria-labelledby="about-title">
      <div className="container">
        {/* Full-width story */}
        <Reveal>
          <div className="story-grid">
            <div>
              <span className="eyebrow">About the clinic</span>
              <h2 id="about-title" className="h2">
                Why we <span className="italic-accent">started</span>
              </h2>
            </div>
            <div>
              <p className="story">{CLINIC.story}</p>
              <blockquote className="quote">
                &ldquo;{CLINIC.motto}&rdquo;
                <small>Dr. {CLINIC.doctor.fullName}, founder</small>
              </blockquote>
            </div>
          </div>
        </Reveal>

        {/* Fact strip */}
        <Reveal delay={80}>
          <ul className="factstrip" aria-label="Clinic facts">
            <li>
              <span className="factstrip__icon">
                <CalendarIcon />
              </span>
              <span>
                <span className="factstrip__label">Established</span>
                <span className="factstrip__value">
                  {CLINIC.establishedMonth} {CLINIC.establishedYear}
                </span>
              </span>
            </li>
            <li>
              <span className="factstrip__icon">
                <PinIcon />
              </span>
              <span>
                <span className="factstrip__label">Location</span>
                <span className="factstrip__value">{CLINIC.address}</span>
              </span>
            </li>
            <li>
              <span className="factstrip__icon">
                <HeartIcon />
              </span>
              <span>
                <span className="factstrip__label">Years of care</span>
                <span className="factstrip__value">{yearsOpen} and counting</span>
              </span>
            </li>
            <li>
              <span className="factstrip__icon">
                <StarIcon />
              </span>
              <span>
                <span className="factstrip__label">Patient rating</span>
                <span className="factstrip__value">4.9 / 5 (demo)</span>
              </span>
            </li>
          </ul>
        </Reveal>

        {/* Dentist strip + timeline */}
        <div className="about__lower">
          <Reveal delay={100}>
            <article className="dentist" aria-label={`About Dr. ${CLINIC.doctor.fullName}`}>
              <div className="dentist__mono" aria-hidden="true">
                {getInitials(CLINIC.doctor.fullName)}
              </div>
              <div className="dentist__body">
                <div className="dentist__kicker">Your dentist</div>
                <h3 className="dentist__name">
                  Dr. {CLINIC.doctor.fullName} <small>{CLINIC.doctor.title}</small>
                </h3>
                <p className="dentist__role">{CLINIC.doctor.role}</p>
                <p className="dentist__bio">{CLINIC.doctor.bio}</p>
                <div className="dentist__contact">
                  <a className="tag-link" href={CLINIC.contact.phoneHref}>
                    <PhoneIcon />
                    {CLINIC.contact.phoneDisplay}
                  </a>
                  <a className="tag-link" href={`mailto:${CLINIC.contact.email}`}>
                    <MailIcon />
                    {CLINIC.contact.email}
                  </a>
                  <span className="tag-link tag-link--static">
                    <PinIcon />
                    {CLINIC.name}, {CLINIC.address}
                  </span>
                </div>
              </div>
            </article>
          </Reveal>

          <Reveal delay={160}>
            <div className="milestones">
              <h3 className="milestones__title">Milestones</h3>
              <ol className="timeline" aria-label="Clinic milestones">
                {MILESTONES.map((m) => (
                  <li key={m.year}>
                    <div className="timeline__year">{m.year}</div>
                    <h4 className="timeline__title">{m.title}</h4>
                    <p className="timeline__text">{m.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
