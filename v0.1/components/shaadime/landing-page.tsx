"use client";

import Image from "next/image";
import type { ComponentProps } from "react";
import { useEffect, useRef, useState } from "react";

import {
  cities,
  decorStyles,
  faqs,
  heroSlides,
  themes,
  venues,
} from "./data";
import { PlanningModal } from "./planning-modal";
import { Reveal } from "./reveal";
import { SectionHeader } from "./section-header";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { Heart } from "lucide-react";

type LandingPageProps = {
  onFormSubmit?: ComponentProps<typeof PlanningModal>["onSubmit"];
};

export function LandingPage({ onFormSubmit }: LandingPageProps) {
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
            <div className="hero-vignette" />
          </div>

          <div className="hero-content">
            <div className="hero-shell">
              <div className="hero-copy">
                <p className="hero-eyebrow hero-stagger hero-stagger-1">✦ Wedding planning, handled with care</p>
                <h1 className="hero-h1 hero-stagger hero-stagger-2">
                  <span className="hero-h1-line">Craft a wedding worth</span>
                  <span className="hero-h1-line">
                    <span className="accent">arriving for</span>
                  </span>
                </h1>
                <p className="hero-highlight hero-stagger hero-stagger-3">Plan your wedding in minutes</p>
                <p className="hero-tagline hero-tagline-on-video hero-stagger hero-stagger-4">
                  Tell us how you want the day to feel. We handle the planning,
                  coordination, and follow-through so you can stay present for the
                  moments that matter.
                </p>

                <div className="hero-divider hero-stagger hero-stagger-5" />

                <div className="hero-cta-simple hero-stagger hero-stagger-5">
                  <button
                    className="btn-primary hero-primary-cta"
                    type="button"
                    onClick={openPlanner}
                  >
                    Start my wedding planning
                    <span aria-hidden="true">→</span>
                  </button>
                  <button
                    className="btn-ghost"
                    type="button"
                    onClick={scrollToThemes}
                  >
                    Explore themes
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-ticker" aria-hidden="true">
            <div className="ticker-track">
              {[0, 1].map((group) => (
                <span className="ticker-content" key={group}>
                  {heroSlides.map((slide) => (
                    <span key={`${group}-${slide.id}`}>
                      <span className="ticker-dot">✦</span> {slide.meta}
                    </span>
                  ))}
                  <span><span className="ticker-dot">✦</span> Coming Soon: Mumbai &amp; Delhi</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── 2nd: Cities / Locations ─────────────────────── */}
        <section className="section section-city" id="cities">
          <div className="section-inner">
            <Reveal>
              <SectionHeader
                centered
                label="✦ Now Live In"
                subtitle="We are starting in Hyderabad, Bengaluru, and Chennai, with more cities launching soon. We bring the same promise to each: less coordination for you, more confidence on the day."
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
            <Reveal>
              <p className="cities-soon">More cities launching soon</p>
            </Reveal>
          </div>
        </section>

        {/* ── 3rd: Decoration Styles ─────────────────────── */}
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

        {/* ── 4th: Wedding Themes ─────────────────────── */}
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
                  {theme.featured ? (
                    <span className="tc-pill" aria-label="Most loved" title="Most loved">
                      <Heart size={16} />
                    </span>
                  ) : null}
                  <div className="tc-body">
                    <p className="tc-name">{theme.name}</p>
                    <p className="tc-desc">{theme.description}</p>
                  </div>
                </article>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ── 5th: Venues ─────────────────────── */}
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

      <SiteFooter onOpenPlanner={openPlanner} />

      <PlanningModal open={plannerOpen} onClose={() => setPlannerOpen(false)} onSubmit={onFormSubmit} />
    </>
  );
}
