"use client";

// GeneratingScreen.tsx
// ─────────────────────────────────────────────────────────────────────────────
// The moment between form submission and the dashboard.
// This is the first time the couple feels ShaadiMe is doing real work for them.
//
// It calls POST /api/generate-report with the form data, shows a sequential
// animated progress sequence while Gemini processes, then calls onComplete
// with the ReportData when ready.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import type { GenerateReportRequest, ReportData } from "@/lib/types/report";

// ─────────────────────────────────────────────────────────────────────────────

type Props = {
    request: GenerateReportRequest;
    onComplete: (report: ReportData) => void;
    onError: (message: string) => void;
};

// ── Animated steps shown while the API call runs ─────────────────────────────
// Each step has a label and a minimum display duration (ms).
// Steps cycle regardless of actual API progress — pure UX.

const BASE_STEPS = [
    { label: "Reading your wedding profile", duration: 1400 },
    { label: "Understanding your traditions", duration: 1600 },
    { label: "Analysing budget across all events", duration: 1500 },
    { label: "Matching venues in", duration: 1400, appendCity: true },
    { label: "Building your ceremony sequence", duration: 1500 },
    { label: "Scoring vendor fits", duration: 1600 },
    { label: "Drafting your planning timeline", duration: 1400 },
    { label: "Preparing your report", duration: 800 },
];

// ─────────────────────────────────────────────────────────────────────────────

export function GeneratingScreen({ request, onComplete, onError }: Props) {
    const [stepIndex, setStepIndex] = useState(0);
    const [done, setDone] = useState(false);
    const reportRef = useRef<ReportData | null>(null);
    const stepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const steps = BASE_STEPS.map((s) => ({
        ...s,
        label: s.appendCity ? `${s.label} ${request.city}` : s.label,
    }));

    // ── Advance steps on a timer ───────────────────────────────────────────────
    useEffect(() => {
        if (stepIndex >= steps.length - 1) return;

        stepTimerRef.current = setTimeout(() => {
            setStepIndex((i) => i + 1);
        }, steps[stepIndex].duration);

        return () => {
            if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
        };
    }, [stepIndex, steps]);

    // ── Fire the API call once on mount ───────────────────────────────────────
    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const res = await fetch("/api/generate-report", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(request),
                });

                if (!res.ok) {
                    const err = await res.json().catch(() => ({ error: "Unknown error" }));
                    if (!cancelled) onError(err.error ?? "Report generation failed.");
                    return;
                }

                const report: ReportData = await res.json();
                if (!cancelled) {
                    reportRef.current = report;
                    // Let the final step finish displaying before transitioning
                    setStepIndex(steps.length - 1);
                    setTimeout(() => {
                        if (!cancelled) setDone(true);
                    }, 900);
                }
            } catch {
                if (!cancelled) onError("Network error — please check your connection.");
            }
        })();

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Once done animation plays, hand off the report ────────────────────────
    useEffect(() => {
        if (done && reportRef.current) {
            const t = setTimeout(() => onComplete(reportRef.current!), 700);
            return () => clearTimeout(t);
        }
    }, [done, onComplete]);

    const includedEvents = request.events.filter((e) => e.included);
    const p1 = request.p1name || "You";
    const p2 = request.p2name || "your partner";

    return (
        <div className="gs-root">
            {/* Background ornamental circles */}
            <div className="gs-bg">
                <div className="gs-circle gs-circle-1" />
                <div className="gs-circle gs-circle-2" />
                <div className="gs-circle gs-circle-3" />
            </div>

            <div className="gs-content">
                {/* Logo / brand mark */}
                <div className="gs-brand">
                    <Image src="/ShaadiMe_Logo.png" alt="ShaadiMe" width={140} height={40} style={{ objectFit: 'contain' }} />
                </div>

                <AnimatePresence mode="wait">
                    {!done ? (
                        <motion.div
                            key="generating"
                            className="gs-main"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.4 }}
                        >
                            {/* Spinner */}
                            <div className="gs-spinner-wrap">
                                <div className="gs-spinner" />
                                <span className="gs-spinner-mark">✦</span>
                            </div>

                            <h1 className="gs-headline">
                                Building your wedding plan,<br />
                                <em>{p1} &amp; {p2}</em>
                            </h1>

                            {/* Step sequence */}
                            <div className="gs-steps">
                                {steps.map((s, i) => (
                                    <div
                                        key={i}
                                        className={[
                                            "gs-step",
                                            i < stepIndex ? "gs-step-done" : "",
                                            i === stepIndex ? "gs-step-active" : "",
                                            i > stepIndex ? "gs-step-pending" : "",
                                        ].filter(Boolean).join(" ")}
                                    >
                                        <span className="gs-step-dot" />
                                        <span className="gs-step-label">{s.label}</span>
                                        {i < stepIndex && <span className="gs-step-check">✓</span>}
                                    </div>
                                ))}
                            </div>

                            {/* Event pills */}
                            {includedEvents.length > 0 && (
                                <div className="gs-events">
                                    <p className="gs-events-label">Planning {includedEvents.length} events</p>
                                    <div className="gs-events-pills">
                                        {includedEvents.map((e) => (
                                            <span key={e.type} className="gs-event-pill">{e.name}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <p className="gs-footer-note">
                                This usually takes 30–60 seconds
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="done"
                            className="gs-done"
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, ease: [0.34, 1.36, 0.64, 1] }}
                        >
                            <div className="gs-done-mark">✦</div>
                            <h1 className="gs-done-title">Your report is ready</h1>
                            <p className="gs-done-sub">Opening your personalised wedding dashboard…</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style>{`
        .gs-root {
          position: fixed;
          inset: 0;
          background: var(--purple-dark, #300b2e);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 900;
          font-family: var(--font-josefin), 'Josefin Sans', sans-serif;
          overflow: hidden;
        }

        /* ── Background circles ── */
        .gs-bg { position: absolute; inset: 0; pointer-events: none; }
        .gs-circle {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .gs-circle-1 {
          width: 600px; height: 600px;
          top: -200px; right: -200px;
          background: radial-gradient(circle at center, rgba(229, 152, 155, 0.07), transparent 60%);
          animation: gs-rotate 25s linear infinite;
        }
        .gs-circle-2 {
          width: 400px; height: 400px;
          bottom: -120px; left: -100px;
          background: radial-gradient(circle at center, rgba(255, 87, 87, 0.06), transparent 60%);
          animation: gs-rotate 35s linear infinite reverse;
        }
        .gs-circle-3 {
          width: 200px; height: 200px;
          top: 40%; left: 50%;
          transform: translate(-50%, -50%);
          border-color: rgba(229, 152, 155, 0.05);
          animation: gs-pulse 4s ease-in-out infinite;
        }
        @keyframes gs-rotate { to { transform: rotate(360deg); } }
        @keyframes gs-pulse {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
          50%       { opacity: 0.7; transform: translate(-50%, -50%) scale(1.08); }
        }

        /* ── Content ── */
        .gs-content {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 440px;
          padding: 0 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .gs-brand {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 40px;
        }

        /* ── Spinner ── */
        .gs-spinner-wrap {
          position: relative;
          width: 64px;
          height: 64px;
          margin: 0 auto 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .gs-spinner {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1.5px solid rgba(229, 152, 155, 0.2);
          border-top-color: var(--coral, #ff5757);
          animation: gs-spin 1.4s linear infinite;
        }
        @keyframes gs-spin { to { transform: rotate(360deg); } }
        .gs-spinner-mark {
          font-size: 20px;
          color: var(--blush, #e5989b);
          animation: gs-pulse-mark 2s ease-in-out infinite;
        }
        @keyframes gs-pulse-mark {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }

        /* ── Headline ── */
        .gs-headline {
          font-family: inherit;
          font-size: 26px;
          font-weight: 500;
          color: var(--off-white, #fdfaf9);
          line-height: 1.3;
          margin: 0 0 32px;
        }
        .gs-headline em {
          color: var(--blush, #e5989b);
          font-style: italic;
        }

        /* ── Steps ── */
        .gs-steps {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0;
          margin-bottom: 28px;
          text-align: left;
        }
        .gs-step {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 7px 0;
          border-bottom: 1px solid rgba(229, 152, 155, 0.08);
          transition: opacity 0.3s;
        }
        .gs-step:last-child { border-bottom: none; }
        .gs-step-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
          transition: background 0.3s;
        }
        .gs-step-label {
          font-size: 14px;
          flex: 1;
          transition: color 0.3s;
        }
        .gs-step-check {
          font-size: 11px;
          flex-shrink: 0;
        }

        /* State: done */
        .gs-step-done .gs-step-dot   { background: var(--blush, #e5989b); }
        .gs-step-done .gs-step-label { color: rgba(253, 250, 249, 0.5); }
        .gs-step-done .gs-step-check { color: var(--blush, #e5989b); }

        /* State: active */
        .gs-step-active .gs-step-dot {
          background: var(--coral, #ff5757);
          box-shadow: 0 0 6px rgba(255, 87, 87, 0.6);
          animation: gs-dot-pulse 1.2s ease-in-out infinite;
        }
        .gs-step-active .gs-step-label { color: var(--off-white, #fdfaf9); font-weight: 500; }
        @keyframes gs-dot-pulse {
          0%, 100% { box-shadow: 0 0 4px rgba(255, 87, 87, 0.5); }
          50%       { box-shadow: 0 0 10px rgba(255, 87, 87, 0.9); }
        }

        /* State: pending */
        .gs-step-pending .gs-step-dot   { background: rgba(229, 152, 155, 0.15); }
        .gs-step-pending .gs-step-label { color: rgba(253, 250, 249, 0.3); }

        /* ── Event pills ── */
        .gs-events { margin-bottom: 28px; width: 100%; }
        .gs-events-label {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(253, 250, 249, 0.5);
          margin: 0 0 8px;
        }
        .gs-events-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          justify-content: center;
        }
        .gs-event-pill {
          font-size: 12px;
          padding: 4px 12px;
          border-radius: 20px;
          background: rgba(255, 87, 87, 0.08);
          border: 1px solid rgba(255, 87, 87, 0.15);
          color: var(--blush, #e5989b);
        }

        .gs-footer-note {
          font-size: 12px;
          color: rgba(253, 250, 249, 0.5);
          margin: 0;
          letter-spacing: 0.02em;
        }

        /* ── Done state ── */
        .gs-done {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .gs-done-mark {
          font-size: 40px;
          color: var(--coral, #ff5757);
          animation: gs-done-bloom 0.6s ease-out both;
        }
        @keyframes gs-done-bloom {
          from { transform: scale(0.4); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        .gs-done-title {
          font-family: inherit;
          font-size: 28px;
          font-weight: 500;
          color: var(--off-white, #fdfaf9);
          margin: 0;
        }
        .gs-done-sub {
          font-size: 14px;
          color: rgba(253, 250, 249, 0.7);
          margin: 0;
        }
      `}</style>
        </div>
    );
}