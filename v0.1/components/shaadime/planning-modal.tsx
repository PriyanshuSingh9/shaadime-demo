"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { plannerSteps } from "./data";

type PlanningModalProps = {
  open: boolean;
  onClose: () => void;
};

type FormState = {
  bride: string;
  groom: string;
  phone: string;
  date: string;
  approximateDate: string;
  budget: string;
  relationshipType: string;
  guests: string;
  preference: string;
  inspirationFiles: string[];
  city: string;
};

type Particle = {
  id: number;
  left: number;
  top: number;
  size: number;
  color: string;
  duration: number;
  x: number;
  y: number;
  rotate: number;
  shape: "circle" | "rounded";
};

const initialState: FormState = {
  bride: "",
  groom: "",
  phone: "",
  date: "",
  approximateDate: "",
  budget: "",
  relationshipType: "",
  guests: "",
  preference: "",
  inspirationFiles: [],
  city: "",
};

const particleColors = ["#ff5757", "#fad6d6", "#c9a96e", "#ffffff"];

export function PlanningModal({ open, onClose }: PlanningModalProps) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>(initialState);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const progress = submitted ? 100 : (step / plannerSteps.length) * 100;

  const confirmationNames = useMemo(() => {
    const bride = form.bride || "Bride";
    const groom = form.groom || "Groom";
    return `Congratulations, ${bride} & ${groom}!`;
  }, [form.bride, form.groom]);

  const handleClose = () => {
    onClose();
    window.setTimeout(() => {
      setStep(1);
      setSubmitted(false);
      setParticles([]);
      setForm(initialState);
    }, 220);
  };

  const nextStep = () => setStep((current) => Math.min(current + 1, plannerSteps.length));
  const prevStep = () => setStep((current) => Math.max(current - 1, 1));

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = () => {
    setSubmitted(true);
    setParticles(
      Array.from({ length: 32 }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        top: 70 + Math.random() * 20,
        size: 4 + Math.random() * 8,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        duration: 1.4 + Math.random() * 1.8,
        x: (Math.random() - 0.5) * 240,
        y: -180 - Math.random() * 180,
        rotate: Math.random() * 360,
        shape: Math.random() > 0.5 ? "circle" : "rounded",
      })),
    );
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="modal-overlay open"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              handleClose();
            }
          }}
        >
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="modal-box"
            exit={{ opacity: 0, scale: 0.97, y: 24 }}
            initial={{ opacity: 0, scale: 0.97, y: 28 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              aria-label="Close planner form"
              className="modal-close"
              type="button"
              onClick={handleClose}
            >
              ✕
            </button>

            <div className="modal-progress">
              <motion.div
                animate={{ width: `${progress}%` }}
                className="modal-bar"
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>

            <div className="modal-particles" aria-hidden="true">
              {particles.map((particle) => (
                <motion.span
                  key={particle.id}
                  animate={{
                    opacity: [0, 1, 0],
                    x: particle.x,
                    y: particle.y,
                    rotate: particle.rotate,
                    scale: [0.8, 1, 0.85],
                  }}
                  className={`modal-particle modal-particle-${particle.shape}`}
                  initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.7 }}
                  style={{
                    left: `${particle.left}%`,
                    top: `${particle.top}%`,
                    width: particle.size,
                    height: particle.size,
                    background: particle.color,
                  }}
                  transition={{ duration: particle.duration, ease: "easeOut" }}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="confirmation"
                  animate={{ opacity: 1, y: 0 }}
                  className="m-confirm active"
                  exit={{ opacity: 0, y: -12 }}
                  initial={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="confirm-anim">🎊</div>
                  <p className="confirm-names">{confirmationNames} 🎉</p>
                  <p className="confirm-msg">
                    Thank you for choosing ShaadiMe.
                    <br />
                    We are going to take care of everything.
                    <br />
                    <br />
                    <em>Enjoy the process.</em>
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={step}
                  animate={{ opacity: 1, y: 0 }}
                  className="m-step active"
                  exit={{ opacity: 0, y: -12 }}
                  initial={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.28 }}
                >
                  <div className="m-emoji">{plannerSteps[step - 1].emoji}</div>
                  <p className="m-micro">
                    Step {step} of {plannerSteps.length}
                  </p>
                  <h3 className="m-q">{plannerSteps[step - 1].title}</h3>

                  {step === 1 ? (
                    <>
                      <div className="m-input-row">
                        <input
                          className="m-input"
                          placeholder="Bride's first name"
                          value={form.bride}
                          onChange={(event) => updateField("bride", event.target.value)}
                        />
                        <input
                          className="m-input"
                          placeholder="Groom's first name"
                          value={form.groom}
                          onChange={(event) => updateField("groom", event.target.value)}
                        />
                      </div>
                      <div className="m-nav">
                        <span className="m-counter">1 / 9</span>
                        <button className="btn-next" type="button" onClick={nextStep}>
                          Continue →
                        </button>
                      </div>
                    </>
                  ) : null}

                  {step === 2 ? (
                    <>
                      <input
                        className="m-input"
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="Your 10-digit mobile number"
                        type="tel"
                        value={form.phone}
                        onChange={(event) => updateField("phone", event.target.value)}
                      />
                      <div className="m-nav">
                        <button className="btn-back" type="button" onClick={prevStep}>
                          ← Back
                        </button>
                        <button className="btn-next" type="button" onClick={nextStep}>
                          Continue →
                        </button>
                      </div>
                    </>
                  ) : null}

                  {step === 3 ? (
                    <>
                      <input
                        className="m-input"
                        type="date"
                        value={form.date}
                        onChange={(event) => updateField("date", event.target.value)}
                      />
                      <select
                        className="m-select"
                        value={form.approximateDate}
                        onChange={(event) =>
                          updateField("approximateDate", event.target.value)
                        }
                      >
                        <option value="">Or pick an approximate timeframe...</option>
                        <option>Within 3 months</option>
                        <option>3–6 months</option>
                        <option>6–12 months</option>
                        <option>More than a year away</option>
                        <option>Not decided yet</option>
                      </select>
                      <div className="m-nav">
                        <button className="btn-back" type="button" onClick={prevStep}>
                          ← Back
                        </button>
                        <button className="btn-next" type="button" onClick={nextStep}>
                          Continue →
                        </button>
                      </div>
                    </>
                  ) : null}

                  {step === 4 ? (
                    <>
                      <ChoiceGroup
                        options={[
                          "Under ₹5 Lakh",
                          "₹5 to 15 Lakh",
                          "₹15 to 30 Lakh",
                          "₹30 Lakh and above",
                          "Flexible",
                        ]}
                        value={form.budget}
                        onChange={(value) => updateField("budget", value)}
                      />
                      <StepNav onBack={prevStep} onNext={nextStep} />
                    </>
                  ) : null}

                  {step === 5 ? (
                    <>
                      <ChoiceGroup
                        options={["Arranged Marriage", "Love Marriage"]}
                        value={form.relationshipType}
                        onChange={(value) => updateField("relationshipType", value)}
                      />
                      <StepNav onBack={prevStep} onNext={nextStep} />
                    </>
                  ) : null}

                  {step === 6 ? (
                    <>
                      <ChoiceGroup
                        options={[
                          "Under 100 — intimate gathering",
                          "100 to 300",
                          "300 to 600",
                          "600 to 1000",
                          "Above 1000 — grand celebration",
                        ]}
                        value={form.guests}
                        onChange={(value) => updateField("guests", value)}
                      />
                      <StepNav onBack={prevStep} onNext={nextStep} />
                    </>
                  ) : null}

                  {step === 7 ? (
                    <>
                      <ChoiceGroup
                        options={[
                          "I want to be involved in every detail",
                          "Share my vision and let ShaadiMe handle the rest",
                          "Take care of everything — I trust ShaadiMe completely",
                        ]}
                        value={form.preference}
                        onChange={(value) => updateField("preference", value)}
                      />
                      <StepNav onBack={prevStep} onNext={nextStep} />
                    </>
                  ) : null}

                  {step === 8 ? (
                    <>
                      <p className="m-help-text">
                        Upload any photos that show how you want your wedding to look.
                        JPG, PNG or PDF, up to 10 files.
                      </p>
                      <input
                        className="m-input m-file-input"
                        multiple
                        accept=".jpg,.jpeg,.png,.pdf"
                        type="file"
                        onChange={(event) =>
                          updateField(
                            "inspirationFiles",
                            Array.from(event.target.files ?? []).map((file) => file.name),
                          )
                        }
                      />
                      {form.inspirationFiles.length > 0 ? (
                        <p className="m-file-list">
                          {form.inspirationFiles.join(", ")}
                        </p>
                      ) : null}
                      <StepNav onBack={prevStep} onNext={nextStep} />
                    </>
                  ) : null}

                  {step === 9 ? (
                    <>
                      <ChoiceGroup
                        options={["🏙️ Bengaluru", "🌊 Chennai", "💎 Hyderabad"]}
                        value={form.city}
                        onChange={(value) => updateField("city", value)}
                      />
                      <div className="m-nav">
                        <button className="btn-back" type="button" onClick={prevStep}>
                          ← Back
                        </button>
                        <button
                          className="btn-next btn-submit"
                          type="button"
                          onClick={submit}
                        >
                          Submit 🎉
                        </button>
                      </div>
                    </>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

type ChoiceGroupProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

function ChoiceGroup({ options, value, onChange }: ChoiceGroupProps) {
  return (
    <div className="mcq-opts">
      {options.map((option) => {
        const selected = value === option;

        return (
          <button
            key={option}
            className={`mcq-opt${selected ? " sel" : ""}`}
            type="button"
            onClick={() => onChange(option)}
          >
            <span className="mcq-radio" />
            {option}
          </button>
        );
      })}
    </div>
  );
}

type StepNavProps = {
  onBack: () => void;
  onNext: () => void;
};

function StepNav({ onBack, onNext }: StepNavProps) {
  return (
    <div className="m-nav">
      <button className="btn-back" type="button" onClick={onBack}>
        ← Back
      </button>
      <button className="btn-next" type="button" onClick={onNext}>
        Continue →
      </button>
    </div>
  );
}
