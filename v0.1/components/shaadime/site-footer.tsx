"use client";

import { Mail, Phone, MapPin, Globe, Instagram, Facebook, Youtube, Linkedin } from "lucide-react";
import Image from "next/image";

type SiteFooterProps = {
  onOpenPlanner: () => void;
};

export function SiteFooter({ onOpenPlanner }: SiteFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer-v2">
      <div className="footer-container">
        {/* Top Section: Logo & Tagline */}
        <div className="footer-top">
          <Image
            alt="ShaadiMe logo"
            className="footer-logo-v2"
            height={60}
            src="/ShaadiMe Logo.png"
            width={200}
          />
          <p className="footer-tagline-v2">
            Wedding planning, handled with <em>care</em>.
          </p>
        </div>

        <div className="footer-divider" />

        {/* Middle Section: Links & Contact */}
        <div className="footer-grid">
          <div className="footer-col">
            <h4 className="footer-col-title">Company</h4>
            <ul className="footer-list">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Services</a></li>
              <li><a href="#">Testimonials</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-list">
              <li><a href="#themes">Wedding Themes</a></li>
              <li><a href="#venues">Types of Venues</a></li>
              <li><a href="#why">Why ShaadiMe</a></li>
              <li><a href="#cities">Launch Cities</a></li>
              <li><a href="#faq">Questions & Answers</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Contact</h4>
            <div className="contact-item">
              <span className="contact-icon"><Mail size={18} /></span>
              <a href="mailto:info@shaadi.me">info@shaadi.me</a>
            </div>
            <div className="contact-item">
              <span className="contact-icon"><Phone size={18} /></span>
              <a href="tel:+911234567890">+91 123 456 7890</a>
            </div>
            <div className="contact-item">
              <span className="contact-icon"><MapPin size={18} /></span>
              <span>Bengaluru, India</span>
            </div>
          </div>

          <div className="footer-col footer-right">
            <div className="language-selector">
              <Globe size={18} />
              <span>English</span>
              <span className="chevron">▾</span>
            </div>

            <div className="social-links">
              <a href="#" className="social-icon" aria-label="LinkedIn"><Linkedin size={20} /></a>
              <a href="#" className="social-icon" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="#" className="social-icon" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="#" className="social-icon" aria-label="YouTube"><Youtube size={20} /></a>
            </div>
          </div>
        </div>

        <div className="footer-divider" />

        {/* Bottom Section: Copyright & Legal */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            © {currentYear} ShaadiMe. All rights reserved.
          </div>
          <div className="footer-legal">
            <a href="#">Terms & Conditions</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
