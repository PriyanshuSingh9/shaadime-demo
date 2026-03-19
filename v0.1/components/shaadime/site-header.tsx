"use client";

import { AnimatePresence, motion } from "framer-motion";

import { BrandLogo } from "./brand-logo";
import { navItems } from "./data";

type SiteHeaderProps = {
  scrolled: boolean;
  mobileNavOpen: boolean;
  onOpenPlanner: () => void;
  onToggleMobileNav: () => void;
  onCloseMobileNav: () => void;
};

export function SiteHeader({
  scrolled,
  mobileNavOpen,
  onOpenPlanner,
  onToggleMobileNav,
  onCloseMobileNav,
}: SiteHeaderProps) {
  return (
    <>
      <nav className={`site-nav${scrolled ? " is-scrolled" : ""}`}>
        <a className="nav-logo-wrap" href="#hero" onClick={onCloseMobileNav}>
          <BrandLogo className="nav-logo" priority />
        </a>

        <ul className="nav-links" aria-label="Primary">
          {navItems.map((item) => (
            <li key={item.href}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>

        <div className="nav-right">
          <button className="nav-cta" type="button" onClick={onOpenPlanner}>
            Start Planning →
          </button>
          <button
            aria-expanded={mobileNavOpen}
            aria-label="Toggle menu"
            className={`hamburger${mobileNavOpen ? " is-open" : ""}`}
            type="button"
            onClick={onToggleMobileNav}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileNavOpen ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mobile-nav"
            exit={{ opacity: 0, y: -10 }}
            initial={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={onCloseMobileNav}>
                {item.label}
              </a>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
