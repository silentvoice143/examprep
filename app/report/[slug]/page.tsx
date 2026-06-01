"use client"
import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/libs/store";
import { getAuditReport } from "@/libs/api/audit.service";
import { toolColors, toolIcons } from "@/libs/constants/data";
import { Loader, Loader2 } from "lucide-react";




const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(n);

const AuditReport = () => {
    const params = useParams();
    const router = useRouter()

    const { report, setReport } = useStore();

    const [loading, setLoading] = useState(false);
    const [hovered, setHovered] = useState<number | null>(null);

    const slug = params?.slug as string;




    const savingsPct =
        report?.totalMonthlySpend
            ? Math.round(
                (report?.estimatedMonthlySavings /
                    report?.totalMonthlySpend) *
                100
            )
            : 0;



    // =========================
    // FETCH IF NOT IN STORE
    // =========================
    useEffect(() => {
        const loadReport = async () => {
            if (!slug) return;

            // ✅ 1. if already in store → skip API
            if (report?.slug === slug) return;

            try {
                setLoading(true);

                const res = await getAuditReport(slug);

                if (res.success && res.report) {
                    setReport(res.report); // ✅ store globally
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadReport();
    }, [slug]);

    useEffect(() => {
        if (!slug) {
            router.push("/audit");
        }
    }, [slug]);


    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin text-blue-600" />
                    <p className="text-sm text-black">Generating report...</p>
                </div>
            </div>
        );
    }



    return (
        <div id="audit-report" className="overflow-x-hidden relative pdf-bg-white" style={{ backgroundColor: "#0B0F19", color: "#e2e8f0" }} >
            <div className="mx-auto max-w-7xl">

                {/* Noise */}
                <div
                    className="pointer-events-none fixed inset-0"
                    style={{
                        opacity: 0.1,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
                    }}
                />

                {/* Header */}
                <header className="relative z-10 max-w-6xl mx-auto px-6 pt-16">
                    <div className="pb-10">
                        <div
                            className="inline-block rounded-full px-4 py-1 text-[11px] uppercase tracking-[0.18em] "
                            style={{
                                border: "1px solid rgba(100,116,139,0.3)",
                                backgroundColor: "rgba(100,116,139,0.1)",
                                color: "#94a3b8",
                            }}
                        >
                            <span className="clone-shift">AI Spend Audit</span>
                        </div>

                        <h1 className="mt-6 text-5xl md:text-7xl leading-tight tracking-tight font-serif" style={{ color: "#ffffff" }}>
                            Spend Intelligence
                            <br />
                            <span className="italic" style={{ color: "#34d399" }}>Report</span>
                        </h1>

                        <p className="mt-4 font-mono text-sm" style={{ color: "#64748b" }}>
                            Analysed 3 active subscriptions · Identified {savingsPct}% potential monthly savings
                        </p>
                    </div>

                    <div className="h-px" style={{ background: "linear-gradient(to right, rgba(52,211,153,0.5), transparent)" }} />
                </header>

                {/* KPI Cards */}
                <section className="relative z-10 max-w-6xl mx-auto px-6 mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Monthly Spend", value: fmt(report?.totalMonthlySpend), sub: "current", glow: false },
                        { label: "Annual Projection", value: fmt(report?.projectedAnnualSpend), sub: "at current rate", glow: false },
                        { label: "Monthly Savings", value: fmt(report?.estimatedMonthlySavings), sub: "estimated", glow: true },
                        { label: "Annual Savings", value: fmt(report?.estimatedAnnualSavings), sub: "estimated", glow: true },
                    ].map((kpi) => (
                        <div
                            key={kpi.label}
                            className="rounded-xl p-6 flex flex-col gap-2"
                            style={{
                                border: kpi?.glow ? "1px solid rgba(52,211,153,0.2)" : "1px solid rgba(255,255,255,0.1)",
                                backgroundColor: kpi?.glow ? "rgba(52,211,153,0.05)" : "rgba(255,255,255,0.05)",
                            }}
                        >
                            <span className="font-mono text-3xl font-bold tracking-tight" style={{ color: kpi?.glow ? "#34d399" : "#e2e8f0" }}>
                                {kpi.value}
                            </span>
                            <span className="text-sm" style={{ color: "#cbd5e1" }}>{kpi?.label}</span>
                            <span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: "#475569" }}>
                                {kpi.sub}
                            </span>
                        </div>
                    ))}
                </section>

                {/* AI Summary */}
                <section className="relative z-10 max-w-6xl mx-auto px-6 mt-10 flex gap-4">
                    <span className="text-xl" style={{ color: "#fbbf24" }}>◈</span>
                    <p
                        className="pl-4 italic leading-7"
                        style={{ borderLeft: "1px solid rgba(251,191,36,0.3)", color: "#94a3b8" }}
                    >
                        {report?.aiSummary}
                    </p>
                </section>

                {/* Savings Bar */}
                <section className="relative z-10 max-w-6xl mx-auto px-6 mt-12 clone-hide">
                    <div className="mb-3 flex items-center justify-between text-xs font-mono uppercase tracking-widest">
                        <span style={{ color: "#64748b" }}>Optimised spend</span>
                        <span style={{ color: "#34d399" }}>{savingsPct}% recoverable</span>
                    </div>

                    <div
                        className="flex h-9 overflow-hidden rounded-lg"
                        style={{ border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.05)" }}
                    >
                        <div style={{ width: `${100 - savingsPct}%`, backgroundColor: "rgba(100,116,139,0.4)" }} />
                        <div
                            className="flex items-center justify-center"
                            style={{
                                width: `${savingsPct}%`,
                                background: "linear-gradient(to right, #059669, #34d399)",
                            }}
                        >
                            <span className="font-mono text-xs font-bold" style={{ color: "#022c22" }}>
                                {fmt(report?.estimatedMonthlySavings)}/mo
                            </span>
                        </div>
                    </div>

                    <div className="mt-3 flex items-center text-xs font-mono" style={{ color: "#64748b" }}>
                        <span className="h-2 w-2 rounded-full inline-block mr-2" style={{ backgroundColor: "#64748b" }} />
                        Retained
                        <span className="ml-6 h-2 w-2 rounded-full inline-block mr-2" style={{ backgroundColor: "#34d399" }} />
                        Savings
                    </div>
                </section>

                {/* Recommendations */}
                <section className="relative z-10 max-w-6xl mx-auto px-6 mt-14">
                    <h2 className="mb-6 text-xs uppercase tracking-[0.18em] font-mono" style={{ color: "#475569" }}>
                        Recommendations
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        {report?.recommendations?.map((rec: any, i: number) => {
                            const color = toolColors[rec?.tool];
                            const isHovered = hovered === i;

                            return (
                                <div
                                    key={rec?.tool}
                                    onMouseEnter={() => setHovered(i)}
                                    onMouseLeave={() => setHovered(null)}
                                    className="rounded-2xl p-6 cursor-default transition-all duration-200"
                                    style={{
                                        backgroundColor: color?.bg,
                                        border: `1px solid ${color?.border}`,
                                        transform: isHovered ? "translateY(-4px)" : "none",
                                        boxShadow: isHovered ? "0 25px 50px rgba(0,0,0,0.5)" : "0 10px 30px rgba(0,0,0,0.3)",
                                    }}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="text-3xl" style={{ color: color?.badgeColor }}>
                                            {toolIcons[rec?.tool]}
                                        </div>

                                        <div>
                                            <div className="text-lg font-semibold" style={{ color: "#f1f5f9" }}>
                                                {rec?.tool}
                                            </div>
                                            <div
                                                className="mt-1 inline-block rounded-full px-3 py-1 text-[10px] uppercase tracking-widest"
                                                style={{
                                                    backgroundColor: "rgba(255,255,255,0.05)",
                                                    color: color?.badgeColor,
                                                }}
                                            >
                                                <span className="clone-shift">{rec?.currentPlan}</span>
                                            </div>
                                        </div>

                                        {rec?.monthlySavings > 0 && (
                                            <div className="ml-auto text-right">
                                                <span className="block font-mono text-lg font-bold" style={{ color: "#34d399" }}>
                                                    -{fmt(rec?.monthlySavings)}
                                                </span>
                                                <span className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(52,211,153,0.7)" }}>
                                                    / month
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="my-5 h-px" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />

                                    <p className="italic leading-7" style={{ color: "#cbd5e1" }}>
                                        {rec?.recommendation}
                                    </p>

                                    <p className="mt-3 text-xs font-mono leading-6" style={{ color: "#64748b" }}>
                                        {rec?.reason}
                                    </p>

                                    <div
                                        className="mt-5 inline-block rounded-full px-3 py-1 text-[11px] uppercase tracking-wider font-mono"
                                        style={rec?.monthlySavings > 0
                                            ? { border: "1px solid rgba(251,191,36,0.3)", backgroundColor: "rgba(251,191,36,0.1)", color: "#fbbf24" }
                                            : { border: "1px solid rgba(52,211,153,0.2)", backgroundColor: "rgba(52,211,153,0.1)", color: "#34d399" }
                                        }
                                    >
                                        <span className="clone-shift">
                                            {rec?.monthlySavings > 0 ? "⚠ Action suggested" : "✓ No action needed"}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Footer */}
                <footer
                    className="relative py-8 z-10 max-w-6xl mx-auto px-6 mt-16 text-xs font-mono tracking-wide"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.1)", color: "#334155" }}
                >
                    Generated by AI Spend Auditor ·{" "}
                    {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </footer>
            </div>
        </div>
    );
};

export default AuditReport;