"use client";

// Dashboard.tsx
// ─────────────────────────────────────────────────────────────────────────────
// The couple's personalised wedding planning dashboard.
//
// Displays the AI-generated report organised by event (not by vendor category).
// Couples can shortlist vendors, view budget breakdown, and see planning timeline.
//
// Props:
//   report  — ReportData from Gemini
//   request — original form data (for display context)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { ReportData, EventReport, VendorSuggestion } from "@/lib/types/report";
import type { GenerateReportRequest } from "@/lib/types/report";

// ─────────────────────────────────────────────────────────────────────────────

type Props = {
    report: ReportData;
    request: GenerateReportRequest;
    onBack?: () => void;
};

type ShortlistMap = Record<string, boolean>;  // vendor.id → shortlisted

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatRupees(amount: number): string {
    if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(2)} Cr`;
    if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(1)}L`;
    if (amount >= 1_000) return `₹${(amount / 1_000).toFixed(0)}K`;
    return `₹${amount}`;
}

function matchColor(score: number): string {
    if (score >= 85) return "#1D9E75";   // teal-green — great match
    if (score >= 70) return "#C8762A";   // saffron — good match
    return "#888780";                     // muted — moderate
}

// ── Vendor card ───────────────────────────────────────────────────────────────

function VendorCard({
    vendor,
    shortlisted,
    onToggle,
}: {
    vendor: VendorSuggestion;
    shortlisted: boolean;
    onToggle: (id: string) => void;
}) {
    const mc = matchColor(vendor.match_score);

    return (
        <motion.div
            className={`vc-card${shortlisted ? " vc-card--shortlisted" : ""}`}
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Category badge */}
            <div className="vc-category">{vendor.category}</div>

            {/* Match score ring */}
            <div className="vc-score-wrap">
                <svg width="44" height="44" viewBox="0 0 44 44">
                    <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(181,148,58,0.12)" strokeWidth="3" />
                    <circle
                        cx="22" cy="22" r="18"
                        fill="none"
                        stroke={mc}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 18}`}
                        strokeDashoffset={`${2 * Math.PI * 18 * (1 - vendor.match_score / 100)}`}
                        transform="rotate(-90 22 22)"
                        style={{ transition: "stroke-dashoffset 0.8s ease" }}
                    />
                    <text
                        x="22" y="27"
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="500"
                        fill={mc}
                        fontFamily="'DM Sans', sans-serif"
                    >
                        {vendor.match_score}%
                    </text>
                </svg>
            </div>

            {/* Main content */}
            <div className="vc-body">
                <h3 className="vc-name">{vendor.name}</h3>
                <p className="vc-city">{vendor.city}</p>
                <p className="vc-specialisation">{vendor.specialisation}</p>
                <p className="vc-note">{vendor.note}</p>
            </div>

            {/* Footer */}
            <div className="vc-footer">
                <div className="vc-pricing">
                    <span className="vc-price">{vendor.price_range}</span>
                    <span className="vc-lead">{vendor.booking_lead_time}</span>
                </div>
                <button
                    type="button"
                    className={`vc-shortlist-btn${shortlisted ? " vc-shortlist-btn--active" : ""}`}
                    onClick={() => onToggle(vendor.id)}
                    aria-label={shortlisted ? "Remove from shortlist" : "Add to shortlist"}
                >
                    {shortlisted ? "Shortlisted ✓" : "+ Shortlist"}
                </button>
            </div>
        </motion.div>
    );
}

// ── Event panel ───────────────────────────────────────────────────────────────

function EventPanel({
    event,
    shortlist,
    onToggle,
}: {
    event: EventReport;
    shortlist: ShortlistMap;
    onToggle: (id: string) => void;
}) {
    const allVendors = [...(event.venue_suggestions ?? []), ...(event.vendors ?? [])];

    return (
        <div className="ep-root">
            {/* Event header */}
            <div className="ep-header">
                <div className="ep-header-left">
                    <h2 className="ep-event-name">{event.name}</h2>
                    <p className="ep-meta">
                        <span>{event.event_date_label}</span>
                        <span className="ep-dot">·</span>
                        <span>~{event.guest_count_estimate.toLocaleString("en-IN")} guests</span>
                        <span className="ep-dot">·</span>
                        <span className="ep-budget">{formatRupees(event.budget_allocated)}</span>
                    </p>
                </div>
                <div className="ep-deadline">
                    <span className="ep-deadline-label">Book by</span>
                    <span className="ep-deadline-value">{event.planning_deadline}</span>
                </div>
            </div>

            {/* Key consideration callout */}
            {event.key_consideration && (
                <div className="ep-insight">
                    <span className="ep-insight-icon">✦</span>
                    <p className="ep-insight-text">{event.key_consideration}</p>
                </div>
            )}

            {/* Budget note */}
            {event.budget_note && (
                <p className="ep-budget-note">{event.budget_note}</p>
            )}

            {/* Venue suggestions (if any) */}
            {event.venue_suggestions?.length > 0 && (
                <div className="ep-section">
                    <h3 className="ep-section-title">Venues</h3>
                    <div className="ep-vendors-grid">
                        {(event.venue_suggestions ?? []).map((v) => (
                            <VendorCard
                                key={v.id}
                                vendor={v}
                                shortlisted={!!shortlist[v.id]}
                                onToggle={onToggle}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Vendor suggestions */}
            {event.vendors?.length > 0 && (
                <div className="ep-section">
                    <h3 className="ep-section-title">Vendors</h3>
                    <div className="ep-vendors-grid">
                        {(event.vendors ?? []).map((v) => (
                            <VendorCard
                                key={v.id}
                                vendor={v}
                                shortlisted={!!shortlist[v.id]}
                                onToggle={onToggle}
                            />
                        ))}
                    </div>
                </div>
            )}

            {allVendors.length === 0 && (
                <p className="ep-empty">Vendor suggestions for this event are being prepared.</p>
            )}
        </div>
    );
}

// ── Budget tab ────────────────────────────────────────────────────────────────

function BudgetTab({ report }: { report: ReportData }) {
    const total = report.budget_total;
    return (
        <div className="bt-root">
            <div className="bt-total">
                <span className="bt-total-label">Total wedding budget</span>
                <span className="bt-total-val">{formatRupees(total)}</span>
            </div>

            <div className="bt-bars">
                {(report.budget_breakdown ?? []).map((line) => (
                    <div key={line.event_name} className="bt-line">
                        <div className="bt-line-head">
                            <span className="bt-event">{line.event_name}</span>
                            <span className="bt-amount">{formatRupees(line.amount)}</span>
                            <span className="bt-pct">{line.percentage}%</span>
                        </div>
                        <div className="bt-bar-track">
                            <motion.div
                                className="bt-bar-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${line.percentage}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                        </div>
                        {line.note && <p className="bt-note">{line.note}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Timeline tab ──────────────────────────────────────────────────────────────

function TimelineTab({ report }: { report: ReportData }) {
    const timeline = report.planning_timeline ?? [];
    const sorted   = [...timeline].sort((a, b) => b.months_before - a.months_before);

    if (sorted.length === 0) {
        return (
            <div className="tl-root">
                <p style={{ fontSize: 13, color: "var(--text-muted, #7a5a78)", fontStyle: "italic" }}>
                    Your planning timeline will appear here after your planner reviews your profile.
                </p>
            </div>
        );
    }

    return (
        <div className="tl-root">
            {sorted.map((item, i) => (
                <div key={i} className="tl-item">
                    <div className="tl-dot-col">
                        <div className="tl-dot" />
                        {i < sorted.length - 1 && <div className="tl-line" />}
                    </div>
                    <div className="tl-content">
                        <p className="tl-label">{item.label}</p>
                        <ul className="tl-tasks">
                            {(item.tasks ?? []).map((task, ti) => (
                                <li key={ti}>{task}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

export function Dashboard({ report, request, onBack }: Props) {
    const [activeTab, setActiveTab] = useState<string>(
        report.events[0]?.type ?? "budget"
    );
    const [shortlist, setShortlist] = useState<ShortlistMap>({});

    const toggleShortlist = (id: string) => {
        setShortlist((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const shortlistCount = useMemo(
        () => Object.values(shortlist).filter(Boolean).length,
        [shortlist]
    );

    const tabs = [
        ...report.events.map((e) => ({ key: e.type, label: e.name })),
        { key: "budget", label: "Budget" },
        { key: "timeline", label: "Timeline" },
    ];

    const activeEvent = report.events.find((e) => e.type === activeTab);

    return (
        <div className="db-root">
            {/* ── Top bar ── */}
            <div className="db-topbar">
                <div className="db-topbar-left">
                    <div className="db-topbar-brand">
                        <Image
                            src="/ShaadiMe_Logo.png"
                            alt="ShaadiMe"
                            width={110}
                            height={34}
                            priority
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                </div>

                <div className="db-topbar-center">
                    <p className="db-couple-name">
                        {request.p1name} &amp; {request.p2name}
                    </p>
                    <p className="db-wedding-meta">
                        {request.community} wedding · {request.city}
                    </p>
                </div>

                <div className="db-topbar-right">
                    {onBack && (
                        <button type="button" onClick={onBack} className="db-back-btn" style={{ marginLeft: "auto" }}>
                            Back →
                        </button>
                    )}
                    {shortlistCount > 0 && (
                        <div className="db-shortlist-badge">
                            {shortlistCount} shortlisted
                        </div>
                    )}
                </div>
            </div>

            {/* ── Profile summary ── */}
            <div className="db-summary">
                <p className="db-summary-text">{report.profile_summary}</p>
            </div>

            {/* ── Key insights ── */}
            {report.key_insights?.length > 0 && (
                <div className="db-insights">
                    {(report.key_insights ?? []).map((insight, i) => (
                        <div key={i} className="db-insight-chip">
                            <span className="db-insight-orn">✦</span>
                            <span>{insight}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Tab navigation ── */}
            <div className="db-tabnav-wrap">
                <div className="db-tabnav">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            className={`db-tab${activeTab === tab.key ? " db-tab--active" : ""}`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Tab content ── */}
            <div className="db-content">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.22 }}
                    >
                        {activeEvent ? (
                            <EventPanel
                                event={activeEvent}
                                shortlist={shortlist}
                                onToggle={toggleShortlist}
                            />
                        ) : activeTab === "budget" ? (
                            <BudgetTab report={report} />
                        ) : activeTab === "timeline" ? (
                            <TimelineTab report={report} />
                        ) : null}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ── Shortlist footer (appears when items are shortlisted) ── */}
            <AnimatePresence>
                {shortlistCount > 0 && (
                    <motion.div
                        className="db-shortlist-footer"
                        initial={{ y: 80, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 80, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.34, 1.36, 0.64, 1] }}
                    >
                        <p className="db-sf-text">
                            <strong>{shortlistCount}</strong> vendor{shortlistCount !== 1 ? "s" : ""} shortlisted
                        </p>
                        <button type="button" className="db-sf-btn">
                            Review shortlist →
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
        /* ─── Root ─── */
        .db-root {
          min-height: 100vh;
          background: var(--background, #fdfaf9);
          font-family: var(--font-josefin), 'Josefin Sans', sans-serif;
          padding-bottom: 80px;
        }

        /* ─── Top bar ─── */
        .db-topbar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(48, 11, 46, 0.97); /* purple-dark */
          backdrop-filter: blur(8px);
          border-bottom: 1px solid rgba(229, 152, 155, 0.15); /* blush */
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px;
          gap: 16px;
        }
        .db-topbar-left {
          display: flex;
          align-items: center;
          flex: 1;
        }
        .db-topbar-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          flex: 1;
        }
        .db-topbar-brand {
          display: flex;
          align-items: center;
          gap: 7px;
          flex-shrink: 0;
        }
        .db-orn { color: var(--blush, #e5989b); font-size: 12px; }
        .db-brand {
          font-family: inherit;
          font-size: 16px;
          font-weight: 500;
          letter-spacing: 0.1em;
          color: var(--blush-light, #fbf8f6);
        }
        .db-topbar-center { text-align: center; flex: 0 1 auto; }
        .db-couple-name {
          font-family: inherit;
          font-size: 15px;
          font-weight: 500;
          color: var(--white, #ffffff);
          margin: 0;
          font-style: italic;
        }
        .db-wedding-meta {
          font-size: 11px;
          color: var(--blush, #e5989b);
          margin: 1px 0 0;
          letter-spacing: 0.04em;
        }
        .db-topbar-actions { flex-shrink: 0; }
        .db-back-btn {
          background: transparent;
          border: none;
          color: var(--blush-light, #fbf8f6);
          font-size: 13px;
          cursor: pointer;
          transition: color 0.2s;
          padding: 0;
          font-family: var(--font-josefin), 'Josefin Sans', sans-serif;
        }
        .db-back-btn:hover { color: var(--white, #ffffff); }
        .db-shortlist-badge {
          font-size: 11px;
          font-weight: 500;
          padding: 4px 10px;
          border-radius: 20px;
          background: rgba(255, 87, 87, 0.18);
          border: 1px solid rgba(255, 87, 87, 0.35);
          color: var(--coral, #ff5757);
        }

        /* ─── Summary ─── */
        .db-summary {
          padding: 20px 24px 0;
          max-width: 720px;
          margin: 0 auto;
        }
        .db-summary-text {
          font-family: inherit;
          font-size: 17px;
          font-weight: 500;
          color: var(--purple-mid, #6b1a67);
          line-height: 1.65;
          font-style: italic;
          margin: 0;
        }

        /* ─── Insights ─── */
        .db-insights {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 16px 24px 0;
          max-width: 720px;
          margin: 0 auto;
        }
        .db-insight-chip {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          font-size: 12px;
          color: var(--purple-dark, #300b2e);
          background: var(--off-white, #f2e9e4);
          border: 1px solid rgba(229, 152, 155, 0.2);
          border-radius: 4px;
          padding: 6px 10px;
          line-height: 1.4;
          max-width: 100%;
        }
        .db-insight-orn { color: var(--blush, #e5989b); flex-shrink: 0; font-size: 10px; margin-top: 1px; }

        /* ─── Tab nav ─── */
        .db-tabnav-wrap {
          position: sticky;
          top: 57px;
          z-index: 40;
          background: var(--background, #fdfaf9);
          border-bottom: 1px solid rgba(229, 152, 155, 0.18);
          padding: 0 24px;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .db-tabnav-wrap::-webkit-scrollbar { display: none; }
        .db-tabnav {
          display: flex;
          gap: 0;
          max-width: 720px;
          margin: 0 auto;
        }
        .db-tab {
          padding: 14px 18px;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.04em;
          color: var(--text-muted, #7a5a78);
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          white-space: nowrap;
          transition: color 0.2s, border-color 0.2s;
        }
        .db-tab:hover { color: var(--purple-mid, #6b1a67); }
        .db-tab--active {
          color: var(--purple-dark, #300b2e);
          font-weight: 500;
          border-bottom-color: var(--coral, #ff5757);
        }

        /* ─── Content ─── */
        .db-content {
          padding: 24px;
          max-width: 720px;
          margin: 0 auto;
        }

        /* ─── Event panel ─── */
        .ep-root { display: flex; flex-direction: column; gap: 20px; }

        .ep-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .ep-event-name {
          font-family: inherit;
          font-size: 26px;
          font-weight: 500;
          color: var(--purple-dark, #300b2e);
          margin: 0 0 4px;
        }
        .ep-meta {
          font-size: 12px;
          color: var(--text-muted, #7a5a78);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .ep-dot { opacity: 0.4; }
        .ep-budget { color: var(--coral, #ff5757); font-weight: 500; }
        .ep-deadline {
          text-align: right;
          flex-shrink: 0;
        }
        .ep-deadline-label {
          display: block;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted, #7a5a78);
          margin-bottom: 2px;
        }
        .ep-deadline-value {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: var(--purple-dark, #300b2e);
        }

        .ep-insight {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          background: var(--purple-dark, #300b2e);
          border-radius: 4px;
          padding: 12px 14px;
        }
        .ep-insight-icon { color: var(--blush, #e5989b); font-size: 12px; flex-shrink: 0; margin-top: 1px; }
        .ep-insight-text { font-size: 13px; color: var(--blush-light, #fbf8f6); line-height: 1.55; margin: 0; }

        .ep-budget-note { font-size: 12px; color: var(--text-muted, #7a5a78); font-style: italic; margin: 0; }

        .ep-section { display: flex; flex-direction: column; gap: 14px; }
        .ep-section-title {
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted, #7a5a78);
          margin: 0;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(229, 152, 155, 0.15);
        }
        .ep-vendors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 12px;
        }
        .ep-empty { font-size: 13px; color: var(--text-muted, #7a5a78); font-style: italic; }

        /* ─── Vendor card ─── */
        .vc-card {
           background: var(--white, #ffffff);
           border: 1px solid rgba(229, 152, 155, 0.2);
           border-radius: 6px;
           padding: 14px;
           display: flex;
           flex-direction: column;
           gap: 8px;
           position: relative;
           transition: border-color 0.2s, box-shadow 0.2s;
        }
        .vc-card:hover {
           border-color: rgba(255, 87, 87, 0.35);
           box-shadow: 0 2px 12px rgba(255, 87, 87, 0.08);
        }
        .vc-card--shortlisted {
           border-color: rgba(255, 87, 87, 0.5);
           background: var(--blush-light, #fbf8f6);
        }

        .vc-category {
          font-size: 9px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--coral, #ff5757);
        }
        .vc-score-wrap {
          position: absolute;
          top: 12px;
          right: 12px;
        }
        .vc-body { display: flex; flex-direction: column; gap: 3px; padding-right: 52px; }
        .vc-name {
          font-family: inherit;
          font-size: 16px;
          font-weight: 500;
          color: var(--purple-dark, #300b2e);
          margin: 0;
          line-height: 1.2;
        }
        .vc-city { font-size: 11px; color: var(--text-muted, #7a5a78); margin: 0; }
        .vc-specialisation { font-size: 12px; color: var(--purple-mid, #6b1a67); margin: 0; font-weight: 500; }
        .vc-note { font-size: 11px; color: var(--text-muted, #7a5a78); margin: 0; line-height: 1.5; }

        .vc-footer {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 8px;
          margin-top: 4px;
          padding-top: 8px;
          border-top: 1px solid rgba(229, 152, 155, 0.1);
        }
        .vc-pricing { display: flex; flex-direction: column; gap: 2px; }
        .vc-price { font-size: 13px; font-weight: 500; color: var(--purple-dark, #300b2e); }
        .vc-lead { font-size: 10px; color: var(--text-muted, #7a5a78); }

        .vc-shortlist-btn {
          font-size: 11px;
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 3px;
          border: 1px solid rgba(255, 87, 87, 0.35);
          background: transparent;
          color: var(--coral, #ff5757);
          cursor: pointer;
          transition: background 0.18s, color 0.18s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .vc-shortlist-btn:hover { background: rgba(255, 87, 87, 0.08); }
        .vc-shortlist-btn--active {
          background: var(--purple-dark, #300b2e);
          border-color: var(--purple-dark, #300b2e);
          color: var(--blush, #e5989b);
        }

        /* ─── Budget tab ─── */
        .bt-root { display: flex; flex-direction: column; gap: 20px; }
        .bt-total {
          display: flex;
          align-items: baseline;
          gap: 12px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(229, 152, 155, 0.15);
        }
        .bt-total-label { font-size: 12px; color: var(--text-muted, #7a5a78); }
        .bt-total-val {
          font-family: inherit;
          font-size: 28px;
          font-weight: 500;
          color: var(--purple-dark, #300b2e);
        }
        .bt-bars { display: flex; flex-direction: column; gap: 16px; }
        .bt-line { display: flex; flex-direction: column; gap: 5px; }
        .bt-line-head {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }
        .bt-event { font-size: 13px; font-weight: 500; color: var(--purple-dark, #300b2e); flex: 1; }
        .bt-amount { font-size: 13px; color: var(--coral, #ff5757); font-weight: 500; }
        .bt-pct { font-size: 11px; color: var(--text-muted, #7a5a78); }
        .bt-bar-track {
          height: 4px;
          background: rgba(229, 152, 155, 0.12);
          border-radius: 2px;
          overflow: hidden;
        }
        .bt-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--coral, #ff5757), var(--blush, #e5989b));
          border-radius: 2px;
        }
        .bt-note { font-size: 11px; color: var(--text-muted, #7a5a78); font-style: italic; margin: 0; }

        /* ─── Timeline tab ─── */
        .tl-root { display: flex; flex-direction: column; gap: 0; }
        .tl-item { display: flex; gap: 16px; padding-bottom: 24px; }
        .tl-dot-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
          width: 20px;
        }
        .tl-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--coral, #ff5757);
          border: 2px solid var(--white, #ffffff);
          box-shadow: 0 0 0 1.5px rgba(255, 87, 87, 0.3);
          flex-shrink: 0;
        }
        .tl-line {
          width: 1px;
          flex: 1;
          background: rgba(229, 152, 155, 0.2);
          margin-top: 4px;
        }
        .tl-content { flex: 1; padding-top: 1px; }
        .tl-label { font-size: 13px; font-weight: 500; color: var(--purple-dark, #300b2e); margin: 0 0 6px; }
        .tl-tasks { margin: 0; padding-left: 16px; display: flex; flex-direction: column; gap: 3px; }
        .tl-tasks li { font-size: 12px; color: var(--purple-mid, #6b1a67); line-height: 1.5; }

        /* ─── Shortlist footer ─── */
        .db-shortlist-footer {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--purple-dark, #300b2e);
          border: 1px solid rgba(229, 152, 155, 0.25);
          border-radius: 40px;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 8px 32px rgba(48, 11, 46, 0.15);
          z-index: 100;
          white-space: nowrap;
        }
        .db-sf-text { font-size: 13px; color: var(--blush-light, #fbf8f6); margin: 0; }
        .db-sf-text strong { color: var(--blush, #e5989b); }
        .db-sf-btn {
          font-size: 12px;
          font-weight: 500;
          padding: 7px 16px;
          border-radius: 20px;
          background: var(--coral, #ff5757);
          border: none;
          color: var(--white, #ffffff);
          cursor: pointer;
          transition: background 0.18s;
        }
        .db-sf-btn:hover { background: var(--blush, #e5989b); color: var(--purple-dark, #300b2e); }

        @media (max-width: 540px) {
          .db-topbar { padding: 10px 16px; }
          .db-summary, .db-insights, .db-tabnav-wrap, .db-content { padding-left: 16px; padding-right: 16px; }
          .ep-vendors-grid { grid-template-columns: 1fr; }
          .db-tabnav-wrap { top: 53px; }
        }
      `}</style>
        </div>
    );
}