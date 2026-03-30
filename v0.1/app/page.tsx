"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { LandingPage } from "@/components/shaadime/landing-page";

export default function Page() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submittedNames, setSubmittedNames] = useState({ p1: "", p2: "" });

  const handleFormSubmit = useCallback(async (form: any) => {
    const inquiryPayload = {
      p1name: form.p1name,
      p2name: form.p2name,
      email: form.email ?? "",
      phone: form.phone ?? "",
      community: form.community,
      city: form.city,
      weddingDate: form.weddingDate,
      guests: form.guests,
      venueType: form.venueType ?? "",
      budget: form.budget,
      styles: [...(form.styles as Set<string>)],
      services: [...(form.services as Set<string>)],
      events: (form.events ?? []).map(
        ({ type, name, daysBefore, included }: any) => ({
          type, name, daysBefore, included,
        })
      ),
      notes: form.notes ?? "",
      referral: form.referral ?? "",
    };

    try {
      const res = await fetch("/api/save-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiryPayload),
      });
      const data = await res.json();
      console.log("[save-inquiry] response:", data);

      if (!res.ok) {
        console.error("[save-inquiry] Server error:", data);
      }
    } catch (err) {
      console.error("[save-inquiry] Network error:", err);
    }

    setSubmittedNames({ p1: form.p1name, p2: form.p2name });
    setShowConfirmation(true);
  }, []);

  return (
    <>
      <LandingPage onFormSubmit={handleFormSubmit} />

      {/* ── Confirmation Dialog ── */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            key="confirmation-overlay"
            className="confirmation-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setShowConfirmation(false)}
          >
            <motion.div
              className="confirmation-dialog"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative top accent */}
              <div className="confirmation-accent" />

              <div className="confirmation-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>

              <h2 className="confirmation-title">You&apos;re All Set!</h2>

              <p className="confirmation-message">
                Thank you{submittedNames.p1 ? `, ${submittedNames.p1} & ${submittedNames.p2}` : ""}!
                Our wedding planning team will reach out to you shortly to begin crafting your perfect celebration.
              </p>

              <div className="confirmation-divider" />

              <p className="confirmation-note">
                Expect a call or email within 24 hours
              </p>

              <button
                className="confirmation-btn"
                onClick={() => setShowConfirmation(false)}
              >
                Back to Home
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}