"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

type PlanningModalProps = {
  open: boolean;
  onClose: () => void;
};

type FormState = {
  p1name: string;
  p2name: string;
  email: string;
  phone: string;
  community: string;
  city: string;
  weddingDate: string;
  guests: string;
  venueType: string;
  budget: number;
  styles: Set<string>;
  services: Set<string>;
  notes: string;
  referral: string;
};

const TOTAL_STEPS = 5;

const communities = [
  "Telugu",
  "Tamil",
  "Kannada",
  "Malayali",
  "Marathi",
  "Punjabi",
  "Gujarati",
  "Bengali",
  "Rajasthani",
  "Marwari",
  "Muslim",
  "Christian",
  "Other",
];

const planningCities = [
  "Hyderabad",
  "Bengaluru",
  "Chennai",
  "Mumbai",
  "Delhi",
  "Other",
];

const guestOptions = [
  "Under 50 (intimate)",
  "50 – 150",
  "150 – 300",
  "300 – 500",
  "500 – 1000",
  "1000+ (grand celebration)",
];

const venueOptions = [
  "Palace or heritage property",
  "Five star hotel",
  "Farmhouse or open lawn",
  "Banquet hall",
  "Beach or waterfront",
  "Destination (outside city)",
  "No preference — show me options",
];

const styleOptions = [
  {
    name: "Royal Grandeur",
    image:
      "https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    name: "Intimate Garden",
    image:
      "https://images.pexels.com/photos/169190/pexels-photo-169190.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    name: "Traditional South Indian",
    image:
      "https://images.pexels.com/photos/1444450/pexels-photo-1444450.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    name: "Minimalist Modern",
    image:
      "https://images.pexels.com/photos/1035665/pexels-photo-1035665.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    name: "Floral Extravaganza",
    image:
      "https://images.pexels.com/photos/2814831/pexels-photo-2814831.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    name: "Destination",
    image:
      "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

const serviceOptions = [
  "Venue",
  "Photography",
  "Videography",
  "Decoration & Florals",
  "Catering",
  "Bridal Makeup",
  "Mehendi",
  "Music & DJ",
  "Wedding Invitations",
  "Bridal Wear",
  "Guest Management",
  "Wedding Favours",
];

const referralOptions = [
  "Instagram",
  "Google search",
  "Friend or family",
  "Shaadi.com",
  "Wedding expo",
  "Other",
];

const stepLabels = [
  { num: "01", label: "The couple" },
  { num: "02", label: "The day" },
  { num: "03", label: "Your vision" },
  { num: "04", label: "Priorities" },
  { num: "05", label: "Confirm" },
];

function formatBudget(v: number): string {
  if (v < 100) return `₹${v} Lakhs`;
  if (v >= 200) return "₹2 Crore+";
  return `₹${(v / 100).toFixed(1)} Crore`;
}

const initialState: FormState = {
  p1name: "",
  p2name: "",
  email: "",
  phone: "",
  community: "",
  city: "",
  weddingDate: "",
  guests: "",
  venueType: "",
  budget: 25,
  styles: new Set(),
  services: new Set(),
  notes: "",
  referral: "",
};

export function PlanningModal({ open, onClose }: PlanningModalProps) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>({ ...initialState, styles: new Set(), services: new Set() });
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(0);
      setSubmitted(false);
      setForm({ ...initialState, styles: new Set(), services: new Set() });
    }, 300);
  };

  const goToStep = (n: number) => {
    setStep(n);
    bodyRef.current?.scrollTo({ top: 0 });
  };

  const nextStep = () => {
    if (step < TOTAL_STEPS - 1) {
      goToStep(step + 1);
    } else {
      setSubmitted(true);
    }
  };

  const prevStep = () => {
    if (step > 0) goToStep(step - 1);
  };

  const jumpTo = (n: number) => {
    if (n <= step) goToStep(n);
  };

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleStyle = (name: string) => {
    setForm((prev) => {
      const next = new Set(prev.styles);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return { ...prev, styles: next };
    });
  };

  const toggleService = (name: string) => {
    setForm((prev) => {
      const next = new Set(prev.services);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return { ...prev, services: next };
    });
  };

  const reviewRows = useMemo(() => {
    const dateStr = form.weddingDate
      ? new Date(form.weddingDate).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "—";
    return [
      { label: "The couple", value: `${form.p1name || "—"} & ${form.p2name || "—"}` },
      { label: "City", value: form.city || "—" },
      { label: "Community", value: form.community || "—" },
      { label: "Wedding date", value: dateStr },
      { label: "Guests", value: form.guests || "—" },
      { label: "Budget", value: formatBudget(form.budget) },
      { label: "Styles", value: form.styles.size ? [...form.styles].join(", ") : "—" },
      { label: "Priorities", value: form.services.size ? [...form.services].join(", ") : "—" },
    ];
  }, [form]);

  const dateStr = form.weddingDate
    ? new Date(form.weddingDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "TBD";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="pf-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <motion.div
            className="pf-card"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.34, 1.36, 0.64, 1] }}
          >
            {/* Close button */}
            <button
              className="pf-close"
              type="button"
              aria-label="Close"
              onClick={handleClose}
            />

            {/* Inner border decoration */}
            <div className="pf-border-decor" />

            {/* Top ornament band */}
            <div className="pf-top">
              <div className="pf-ornament-row">
                <span className="pf-orn-line" />
                <span className="pf-orn-diamond" />
                <span className="pf-orn-center">✦ ShaadiMe ✦</span>
                <span className="pf-orn-diamond" />
                <span className="pf-orn-line" />
              </div>
              <p className="pf-top-title">Your Wedding Planning Begins Here</p>
            </div>

            {/* Step progress */}
            {!submitted && (
              <div className="pf-progress-strip">
                {stepLabels.map((s, i) => (
                  <button
                    key={s.num}
                    type="button"
                    className={`pf-progress-step${i === step ? " active" : ""}${i < step ? " done" : ""}`}
                    onClick={() => jumpTo(i)}
                  >
                    <span className="pf-step-num">{s.num}</span>
                    <span className="pf-step-label">{s.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Scrollable body */}
            <div className="pf-body" ref={bodyRef}>
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    className="pf-success"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="pf-success-ornament">✦</span>
                    <h2 className="pf-success-title">Your planning begins</h2>
                    <p className="pf-success-sub">
                      Your dedicated planner will reach out within 24 hours to
                      schedule your first conversation. Your AI wedding report
                      is being prepared.
                    </p>
                    <div className="pf-review-card">
                      <div className="pf-review-row">
                        <span>Couple</span>
                        <span>{form.p1name || "You"} &amp; {form.p2name || "your partner"}</span>
                      </div>
                      <div className="pf-review-row">
                        <span>City</span>
                        <span>{form.city || "—"}</span>
                      </div>
                      <div className="pf-review-row">
                        <span>Wedding date</span>
                        <span>{dateStr}</span>
                      </div>
                      <div className="pf-review-row">
                        <span>Budget</span>
                        <span>{formatBudget(form.budget)}</span>
                      </div>
                      <div className="pf-review-row">
                        <span>Report status</span>
                        <span className="pf-generating">Generating…</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                  >
                    {/* ── STEP 1: THE COUPLE ── */}
                    {step === 0 && (
                      <div className="pf-step-panel">
                        <div className="pf-step-heading">
                          <span className="pf-step-eyebrow">A love story begins</span>
                          <h2 className="pf-step-title">
                            Tell us about<br /><em>the two of you</em>
                          </h2>
                          <p className="pf-step-sub">
                            We will assign your planner based on this
                          </p>
                        </div>
                        <div className="pf-divider">
                          <span className="pf-divider-line" />
                          <span className="pf-divider-mark">✦</span>
                          <span className="pf-divider-line" />
                        </div>
                        <div className="pf-field-row">
                          <div className="pf-field">
                            <label>Partner 1 — name</label>
                            <input
                              type="text"
                              placeholder="Ananya"
                              value={form.p1name}
                              onChange={(e) => updateField("p1name", e.target.value)}
                            />
                          </div>
                          <div className="pf-field">
                            <label>Partner 2 — name</label>
                            <input
                              type="text"
                              placeholder="Arjun"
                              value={form.p2name}
                              onChange={(e) => updateField("p2name", e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="pf-field-row">
                          <div className="pf-field">
                            <label>Your email</label>
                            <input
                              type="email"
                              placeholder="you@example.com"
                              value={form.email}
                              onChange={(e) => updateField("email", e.target.value)}
                            />
                          </div>
                          <div className="pf-field">
                            <label>Phone number</label>
                            <input
                              type="tel"
                              placeholder="+91 98765 43210"
                              value={form.phone}
                              onChange={(e) => updateField("phone", e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="pf-field-row">
                          <div className="pf-field">
                            <label>Community / tradition</label>
                            <select
                              value={form.community}
                              onChange={(e) => updateField("community", e.target.value)}
                            >
                              <option value="" disabled>Select your tradition</option>
                              {communities.map((c) => (
                                <option key={c}>{c}</option>
                              ))}
                            </select>
                          </div>
                          <div className="pf-field">
                            <label>Planning city</label>
                            <select
                              value={form.city}
                              onChange={(e) => updateField("city", e.target.value)}
                            >
                              <option value="" disabled>Select city</option>
                              {planningCities.map((c) => (
                                <option key={c}>{c}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── STEP 2: THE DAY ── */}
                    {step === 1 && (
                      <div className="pf-step-panel">
                        <div className="pf-step-heading">
                          <span className="pf-step-eyebrow">Mark it in gold</span>
                          <h2 className="pf-step-title">
                            Tell us about<br /><em>the day itself</em>
                          </h2>
                          <p className="pf-step-sub">
                            Every detail shapes how we plan for you
                          </p>
                        </div>
                        <div className="pf-divider">
                          <span className="pf-divider-line" />
                          <span className="pf-divider-mark">✦</span>
                          <span className="pf-divider-line" />
                        </div>
                        <div className="pf-field-row">
                          <div className="pf-field">
                            <label>Wedding date</label>
                            <input
                              type="date"
                              value={form.weddingDate}
                              onChange={(e) => updateField("weddingDate", e.target.value)}
                            />
                          </div>
                          <div className="pf-field">
                            <label>Guest count</label>
                            <select
                              value={form.guests}
                              onChange={(e) => updateField("guests", e.target.value)}
                            >
                              <option value="" disabled>How many guests?</option>
                              {guestOptions.map((g) => (
                                <option key={g}>{g}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="pf-field-row pf-full">
                          <div className="pf-field">
                            <label>Venue type preference</label>
                            <select
                              value={form.venueType}
                              onChange={(e) => updateField("venueType", e.target.value)}
                            >
                              <option value="" disabled>What kind of space?</option>
                              {venueOptions.map((v) => (
                                <option key={v}>{v}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="pf-field-row pf-full" style={{ marginTop: 4 }}>
                          <div className="pf-field">
                            <label>Total wedding budget</label>
                            <div className="pf-budget-display">
                              <span className="pf-budget-val">
                                {formatBudget(form.budget)}
                              </span>
                              <span className="pf-budget-label">estimated total</span>
                            </div>
                            <div className="pf-range-wrap">
                              <input
                                type="range"
                                min={3}
                                max={200}
                                step={1}
                                value={form.budget}
                                style={
                                  {
                                    "--track-fill": `${((form.budget - 3) / (200 - 3)) * 100}%`,
                                  } as React.CSSProperties
                                }
                                onChange={(e) =>
                                  updateField("budget", parseInt(e.target.value))
                                }
                              />
                            </div>
                            <div className="pf-range-labels">
                              <span>₹3L</span>
                              <span>₹2 Crore+</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── STEP 3: YOUR VISION ── */}
                    {step === 2 && (
                      <div className="pf-step-panel">
                        <div className="pf-step-heading">
                          <span className="pf-step-eyebrow">
                            A picture worth a thousand words
                          </span>
                          <h2 className="pf-step-title">
                            Choose the moods<br /><em>that feel like you</em>
                          </h2>
                          <p className="pf-step-sub">
                            Pick all that resonate — no wrong answers
                          </p>
                        </div>
                        <div className="pf-divider">
                          <span className="pf-divider-line" />
                          <span className="pf-divider-mark">✦</span>
                          <span className="pf-divider-line" />
                        </div>
                        <div className="pf-style-grid">
                          {styleOptions.map((s) => (
                            <button
                              key={s.name}
                              type="button"
                              className={`pf-style-option${form.styles.has(s.name) ? " selected" : ""}`}
                              onClick={() => toggleStyle(s.name)}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={s.image} alt={s.name} loading="lazy" />
                              <span className="pf-style-label">{s.name}</span>
                              <span className="pf-style-check" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ── STEP 4: PRIORITIES ── */}
                    {step === 3 && (
                      <div className="pf-step-panel">
                        <div className="pf-step-heading">
                          <span className="pf-step-eyebrow">What matters most</span>
                          <h2 className="pf-step-title">
                            Which services are<br /><em>highest priority?</em>
                          </h2>
                          <p className="pf-step-sub">
                            We build your plan around what you care about most
                          </p>
                        </div>
                        <div className="pf-divider">
                          <span className="pf-divider-line" />
                          <span className="pf-divider-mark">✦</span>
                          <span className="pf-divider-line" />
                        </div>
                        <div className="pf-service-grid">
                          {serviceOptions.map((s) => (
                            <button
                              key={s}
                              type="button"
                              className={`pf-service-pill${form.services.has(s) ? " selected" : ""}`}
                              onClick={() => toggleService(s)}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                        <div style={{ marginTop: 20 }}>
                          <div className="pf-field">
                            <label>Anything else we should know?</label>
                            <textarea
                              rows={3}
                              placeholder="Special requests, family traditions, must-haves, concerns…"
                              value={form.notes}
                              onChange={(e) => updateField("notes", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── STEP 5: CONFIRM ── */}
                    {step === 4 && (
                      <div className="pf-step-panel">
                        <div className="pf-step-heading">
                          <span className="pf-step-eyebrow">Almost there</span>
                          <h2 className="pf-step-title">
                            Your planning brief<br /><em>is ready to send</em>
                          </h2>
                          <p className="pf-step-sub">
                            Review before we match you with your planner
                          </p>
                        </div>
                        <div className="pf-divider">
                          <span className="pf-divider-line" />
                          <span className="pf-divider-mark">✦</span>
                          <span className="pf-divider-line" />
                        </div>
                        <div className="pf-review-card">
                          {reviewRows.map((r) => (
                            <div key={r.label} className="pf-review-row">
                              <span>{r.label}</span>
                              <span>{r.value}</span>
                            </div>
                          ))}
                        </div>
                        <div className="pf-field-row pf-full">
                          <div className="pf-field">
                            <label>How did you hear about ShaadiMe?</label>
                            <select
                              value={form.referral}
                              onChange={(e) => updateField("referral", e.target.value)}
                            >
                              <option value="" disabled>Select one</option>
                              {referralOptions.map((r) => (
                                <option key={r}>{r}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="pf-privacy-notice">
                          <p>
                            By submitting this form you agree to be contacted by
                            your dedicated ShaadiMe planner within 24 hours. We
                            do not share your details with any vendor before you
                            have spoken with your planner.
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {!submitted && (
              <div className="pf-footer">
                <button
                  className="pf-btn-back"
                  type="button"
                  disabled={step === 0}
                  onClick={prevStep}
                >
                  Back
                </button>
                <span className="pf-step-counter">
                  Step {step + 1} of {TOTAL_STEPS}
                </span>
                <button
                  className={`pf-btn-next${step === TOTAL_STEPS - 1 ? " pf-btn-submit" : ""}`}
                  type="button"
                  onClick={nextStep}
                >
                  <span>
                    {step === TOTAL_STEPS - 1 ? "Send my brief" : "Continue"}
                  </span>
                </button>
              </div>
            )}

            {/* Bottom band */}
            <div className="pf-bottom">
              <p className="pf-bottom-text">
                ShaadiMe · Wedding planning, handled with care
              </p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
