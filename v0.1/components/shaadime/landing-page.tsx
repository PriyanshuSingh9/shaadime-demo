"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import {
  cities,
  collageImages,
  decorStyles,
  faqs,
  heroSlides,
  heroStats,
  themes,
  venues,
  whyCards,
} from "./data";
import { PlanningModal } from "./planning-modal";
import { Reveal } from "./reveal";
import { SectionHeader } from "./section-header";
import { SiteHeader } from "./site-header";

export function LandingPage() {
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveHeroIndex((current) => (current + 1) % heroSlides.length);
    }, 7000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) {
        return;
      }

      if (index === activeHeroIndex) {
        video.currentTime = 0;
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    });
  }, [activeHeroIndex]);

  const closeMobileNav = () => setMobileNavOpen(false);
  const openPlanner = () => {
    setPlannerOpen(true);
    setMobileNavOpen(false);
  };

  const scrollToThemes = () => {
    document.querySelector("#themes")?.scrollIntoView({ behavior: "smooth" });
  };

  const activeHero = heroSlides[activeHeroIndex];

  return (
    <>
      <SiteHeader
        mobileNavOpen={mobileNavOpen}
        onCloseMobileNav={closeMobileNav}
        onOpenPlanner={openPlanner}
        onToggleMobileNav={() => setMobileNavOpen((current) => !current)}
        scrolled={scrolled}
      />

      <main className="shaadime-page">
        <section className="hero hero-carousel" id="hero">
          <div className="hero-media" aria-hidden="true">
            {heroSlides.map((slide, index) => (
              <video
                key={slide.id}
                ref={(node) => {
                  videoRefs.current[index] = node;
                }}
                autoPlay={index === activeHeroIndex}
                className={`hero-video${index === activeHeroIndex ? " is-active" : ""}`}
                loop
                muted
                playsInline
                preload={index === activeHeroIndex ? "auto" : "metadata"}
              >
                <source src={slide.video} type="video/mp4" />
              </video>
            ))}
            <div className="hero-media-overlay" />
          </div>

          <div className="hero-content">
            <div className="hero-shell">
              <div className="hero-copy">
                <div className="hero-slide-pill">
                  <span>{activeHero.label}</span>
                  <span className="hero-slide-dot">•</span>
                  <span>{activeHero.meta}</span>
                </div>

                <p className="hero-eyebrow">✦ Wedding planning, handled with care</p>
                <h1 className="hero-h1">
                  <span className="hero-h1-line">Craft a wedding worth</span>
                  <span className="hero-h1-line">
                    <span className="accent">arriving for</span>
                  </span>
                </h1>
                <p className="hero-tagline hero-tagline-on-video">
                  Tell us how you want the day to feel. We handle the planning,
                  coordination, and follow-through so you can stay present for the
                  moments that matter.
                </p>
              </div>

              <div className="hero-panel">
                <div className="hero-stats" aria-label="ShaadiMe highlights">
                  {heroStats.map((stat) => (
                    <div key={stat.label} className="hero-stat">
                      <strong>{stat.value}</strong>
                      <span>{stat.label}</span>
                    </div>
                  ))}
                </div>

                <div className="hero-cta-row hero-cta-row-surface">
                  <button
                    className="btn-primary hero-primary-cta"
                    type="button"
                    onClick={openPlanner}
                  >
                    Start my wedding planning
                    <span aria-hidden="true">→</span>
                  </button>
                  <button
                    className="btn-ghost hero-secondary-cta"
                    type="button"
                    onClick={scrollToThemes}
                  >
                    Explore themes
                  </button>
                </div>

                <p className="hero-cities-label">Now planning weddings across</p>
                <p className="hero-cities hero-cities-on-video">
                  <span>Hyderabad</span>
                  <span className="sep">|</span>
                  <span>Bengaluru</span>
                  <span className="sep">|</span>
                  <span>Chennai</span>
                </p>
              </div>
            </div>

            <div className="hero-controls" aria-label="Hero carousel controls">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  aria-label={`Show ${slide.label} slide`}
                  aria-pressed={index === activeHeroIndex}
                  className={`hero-dot${index === activeHeroIndex ? " is-active" : ""}`}
                  type="button"
                  onClick={() => setActiveHeroIndex(index)}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="section section-soft" id="themes">
          <div className="section-inner">
            <Reveal>
              <SectionHeader
                label="✦ Wedding Themes"
                subtitle="A wedding should feel like you, not like a template. These are some of the worlds we can help you build."
                title={
                  <>
                    Not every wedding should
                    <br />
                    look the <em>same</em>
                  </>
                }
              />
            </Reveal>
            <Reveal className="themes-grid" delay={0.1}>
              {themes.map((theme, index) => (
                <article
                  key={theme.name}
                  className={`theme-card${index === 0 ? " theme-card-featured" : ""}`}
                >
                  <div className="tc-photo">
                    <Image
                      alt={theme.name}
                      fill
                      priority={index === 0}
                      sizes={
                        index === 0
                          ? "(max-width: 960px) 100vw, 40vw"
                          : "(max-width: 960px) 50vw, 25vw"
                      }
                      src={theme.image}
                      style={theme.imageStyle}
                      unoptimized
                    />
                  </div>
                  <div className="tc-overlay" />
                  <div className="tc-body">
                    {theme.featured ? <span className="tc-pill">Most Loved</span> : null}
                    <p className="tc-name">{theme.name}</p>
                    <p className="tc-desc">{theme.description}</p>
                  </div>
                </article>
              ))}
            </Reveal>
          </div>
        </section>

        <section className="section section-muted" id="venues">
          <div className="section-inner">
            <Reveal>
              <SectionHeader
                label="✦ Types of Venues"
                subtitle="From heritage properties to polished hotel ballrooms, the setting shapes the entire experience of the day."
                title={
                  <>
                    The right venue changes
                    <br />
                    the whole <em>mood</em>
                  </>
                }
              />
            </Reveal>
            <Reveal className="venues-scroll" delay={0.1}>
              {venues.map((venue) => (
                <article key={venue.name} className="venue-card">
                  <div className="venue-photo">
                    <Image
                      alt={venue.name}
                      fill
                      sizes="240px"
                      src={venue.image}
                      style={venue.imageStyle}
                      unoptimized
                    />
                  </div>
                  <div className="venue-info">
                    <span className="venue-kicker">{venue.tag}</span>
                    <p className="venue-name">{venue.name}</p>
                    <p className="venue-desc">{venue.description}</p>
                  </div>
                </article>
              ))}
            </Reveal>
          </div>
        </section>

        <section className="section" id="decoration">
          <div className="section-inner">
            <Reveal>
              <SectionHeader
                label="✦ Decoration Styles"
                subtitle="Every detail should support the atmosphere you want to create, from the mandap to the last table setting."
                title={
                  <>
                    Decor that feels
                    <br />
                    thought through, not <em>thrown together</em>
                  </>
                }
              />
            </Reveal>
            <Reveal className="deco-grid" delay={0.1}>
              {decorStyles.map((decor) => (
                <article
                  key={decor.name}
                  className={`deco-card${decor.large ? " deco-card-large" : ""}`}
                >
                  <div className="deco-photo">
                    <div className="deco-photo-inner">
                      <Image
                        alt={decor.name}
                        fill
                        sizes={
                          decor.large
                            ? "(max-width: 960px) 100vw, 60vw"
                            : "(max-width: 960px) 100vw, 30vw"
                        }
                        src={decor.image}
                        style={decor.imageStyle}
                        unoptimized
                      />
                    </div>
                    <div className="deco-label">
                      <p className="deco-name">{decor.name}</p>
                    </div>
                  </div>
                </article>
              ))}
            </Reveal>
          </div>
        </section>

        <section className="section section-radial" id="why">
          <div className="section-inner">
            <Reveal>
              <SectionHeader
                centered
                compact
                label="✦ Why ShaadiMe"
                title={
                  <>
                    A calmer way to
                    <br />
                    plan an <em>Indian wedding.</em>
                  </>
                }
              />
            </Reveal>
            <div className="why-pillars">
              {whyCards.map((card, index) => (
                <Reveal
                  key={card.number}
                  className={`why-card${card.featured ? " feat" : ""}`}
                  delay={0.08 + index * 0.08}
                >
                  <span className="why-icon">{card.icon}</span>
                  <p className="why-num">{card.number}</p>
                  <h3 className="why-heading">{card.title}</h3>
                  <p className="why-text">{card.description}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal className="why-bottom">
            <div className="why-collage">
              {collageImages.map((image, index) => (
                <div key={image} className={`wc-item wc${index + 1}`}>
                  <Image
                    alt="Wedding inspiration"
                    fill
                    sizes="(max-width: 960px) 100vw, 33vw"
                    src={image}
                    style={index === 1 || index === 4 ? { objectPosition: "center top" } : undefined}
                    unoptimized
                  />
                </div>
              ))}
            </div>
            <div className="why-cta-col">
              <div className="why-cta-top">
                <p className="cta-eyebrow">✦ Decorations & Themes</p>
                <h3 className="cta-heading">
                  Bring the references.
                  <br />
                  We shape the <em>experience.</em>
                </h3>
                <p className="cta-text">
                  From ritual-focused ceremonies to highly styled celebrations, we
                  turn your ideas into a plan that is practical, cohesive, and
                  beautifully executed.
                </p>
              </div>
              <div className="why-cta-bottom">
                <p className="cta-eyebrow">✦ Start The Conversation</p>
                <h3 className="cta-heading cta-heading-small">
                  Tell us what you are
                  <br />
                  planning. We will take it <em>from there.</em>
                </h3>
                <div className="vendor-row">
                  <select className="vendor-select" defaultValue="">
                    <option value="">What do you need help with?</option>
                    <option>Full wedding planning</option>
                    <option>Venue and coordination</option>
                    <option>Decor and experience design</option>
                    <option>Guest flow and logistics</option>
                    <option>Unsure, need guidance</option>
                  </select>
                  <select className="vendor-select" defaultValue="">
                    <option value="">Wedding city</option>
                    <option>Bengaluru</option>
                    <option>Chennai</option>
                    <option>Hyderabad</option>
                  </select>
                </div>
                <button className="btn-vendor" type="button" onClick={openPlanner}>
                  Start Planning →
                </button>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="section section-city" id="cities">
          <div className="section-inner">
            <Reveal>
              <SectionHeader
                centered
                label="✦ Now Live In"
                subtitle="We are starting in three South Indian metros, with the same promise in each one: less coordination for you, more confidence on the day."
                title={
                  <>
                    Planning weddings in
                    <br />
                    the cities we know <em>best</em>
                  </>
                }
              />
            </Reveal>
            <div className="cities-row">
              {cities.map((city, index) => (
                <Reveal key={city.name} className="city-item" delay={0.1 + index * 0.08}>
                  <div className="city-orb">
                    <Image
                      alt={city.name}
                      fill
                      sizes="148px"
                      src={city.image}
                      style={city.imageStyle}
                      unoptimized
                    />
                  </div>
                  <p className="city-name">{city.name}</p>
                  <p className="city-tag">{city.tagline}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-faq" id="faq">
          <div className="faq-wrap">
            <Reveal>
              <SectionHeader
                centered
                label="✦ Questions"
                title={
                  <>
                    A few things couples
                    <br />
                    usually <em>ask first</em>
                  </>
                }
              />
            </Reveal>
            <Reveal className="faq-list" delay={0.1}>
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;

                return (
                  <div key={faq.question} className={`faq-item${isOpen ? " open" : ""}`}>
                    <button
                      aria-expanded={isOpen}
                      className="faq-q"
                      type="button"
                      onClick={() =>
                        setOpenFaqIndex((current) => (current === index ? null : index))
                      }
                    >
                      {faq.question}
                      <span className="faq-icon">+</span>
                    </button>
                    <div className="faq-a">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                );
              })}
            </Reveal>
            <Reveal className="faq-footer">
              <p>Still thinking it through? Start the form and we will take the conversation from there.</p>
              <button className="btn-primary" type="button" onClick={openPlanner}>
                Start Planning →
              </button>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="s">Shaadi</span>
            <span className="m">Me</span>
          </div>
          <p className="footer-cities">Bengaluru · Chennai · Hyderabad</p>
        </div>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Contact</a>
          <button className="footer-cta" type="button" onClick={openPlanner}>
            Begin Your Plan →
          </button>
        </div>
      </footer>

      <PlanningModal open={plannerOpen} onClose={() => setPlannerOpen(false)} />
    </>
  );
}
