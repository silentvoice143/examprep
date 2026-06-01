"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Users,
    Plus,
    X,
    ShieldCheck,
    TrendingUp,
    Search,
    CheckCircle2,
    ChevronRight,
    Sparkles,
} from "lucide-react";
import { cn } from "@/libs/utils/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
type UseCase =
    | ""
    | "Content Creation"
    | "Code Assistance"
    | "Customer Support"
    | "Data Analysis"
    | "Research"
    | "Other";

type Plan = "" | "Free" | "Pro" | "Enterprise" | "Custom";

interface AiTool {
    id: string;
    toolName: string;
    plan: Plan;
    seats: string;
    monthlySpend: string;
}

interface ToolErrors {
    toolName?: string;
    plan?: string;
    seats?: string;
    monthlySpend?: string;
}

interface FormErrors {
    teamSize?: string;
    useCase?: string;
    tools: Record<string, ToolErrors>;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const USE_CASES: Exclude<UseCase, "">[] = [
    "Content Creation",
    "Code Assistance",
    "Customer Support",
    "Data Analysis",
    "Research",
    "Other",
];

const PLANS: Exclude<Plan, "">[] = ["Free", "Pro", "Enterprise", "Custom"];

const TOOL_SUGGESTIONS = [
    "ChatGPT",
    "GitHub Copilot",
    "Claude",
    "Gemini",
    "Midjourney",
    "Jasper",
    "Notion AI",
    "Grammarly",
    "Perplexity",
    "Other",
];

const genId = () => Math.random().toString(36).slice(2, 9);

const emptyTool = (): AiTool => ({
    id: genId(),
    toolName: "",
    plan: "",
    seats: "",
    monthlySpend: "",
});

const fmt = (n: number) =>
    n.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
    });

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Inline field error message */
const FieldError = ({ msg }: { msg?: string }) =>
    msg ? <p className="text-xs text-red-500 mt-1">{msg}</p> : null;

/** Autocomplete tool-name input */
const ToolNameInput = ({
    value,
    error,
    onChange,
}: {
    value: string;
    error?: string;
    onChange: (v: string) => void;
}) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const filtered = TOOL_SUGGESTIONS.filter((s) =>
        s.toLowerCase().includes(value.toLowerCase())
    );

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                    placeholder="e.g. ChatGPT"
                    value={value}
                    className={cn("pl-9", error && "border-red-400 focus-visible:ring-red-300")}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setOpen(true)}
                    autoComplete="off"
                />
            </div>
            {open && filtered.length > 0 && (
                <div className="absolute z-50 top-[calc(100%+4px)] left-0 right-0 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
                    {filtered.map((s) => (
                        <button
                            key={s}
                            type="button"
                            className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                            onMouseDown={() => {
                                onChange(s);
                                setOpen(false);
                            }}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Audit = () => {
    const [teamSize, setTeamSize] = useState("");
    const [useCase, setUseCase] = useState<UseCase>("");
    const [tools, setTools] = useState<AiTool[]>([
        {
            id: genId(),
            toolName: "ChatGPT",
            plan: "Enterprise",
            seats: "45",
            monthlySpend: "1350",
        },
    ]);
    const [errors, setErrors] = useState<FormErrors>({ tools: {} });
    const [submitted, setSubmitted] = useState(false);

    // ── Live audit calculations ──────────────────────────────────────────────
    const audit = useMemo(() => {
        const totalMonthly = tools.reduce(
            (sum, t) => sum + (parseFloat(t.monthlySpend) || 0),
            0
        );
        const projectedAnnual = totalMonthly * 12;
        return { totalMonthly, projectedAnnual, tracked: tools.length };
    }, [tools]);

    // ── Validation ────────────────────────────────────────────────────────────
    const validate = (): boolean => {
        const next: FormErrors = { tools: {} };
        if (!teamSize || isNaN(+teamSize) || +teamSize <= 0)
            next.teamSize = "Enter a valid team size (e.g. 50)";
        if (!useCase) next.useCase = "Please select a primary use case";

        tools.forEach((t) => {
            const e: ToolErrors = {};
            if (!t.toolName.trim()) e.toolName = "Tool name is required";
            if (!t.plan) e.plan = "Select a plan";
            if (!t.seats || isNaN(+t.seats) || +t.seats <= 0)
                e.seats = "Enter a valid seat count";
            if (t.monthlySpend === "" || isNaN(+t.monthlySpend) || +t.monthlySpend < 0)
                e.monthlySpend = "Enter a valid spend amount";
            if (Object.keys(e).length) next.tools[t.id] = e;
        });

        setErrors(next);
        return !next.teamSize && !next.useCase && !Object.keys(next.tools).length;
    };

    // ── Tool handlers ─────────────────────────────────────────────────────────
    const updateTool = (id: string, field: keyof AiTool, value: string) => {
        setTools((prev) =>
            prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
        );
        setErrors((prev) => ({
            ...prev,
            tools: {
                ...prev.tools,
                [id]: { ...prev.tools[id], [field]: undefined },
            },
        }));
    };

    const addTool = () => setTools((prev) => [...prev, emptyTool()]);

    const removeTool = (id: string) => {
        if (tools.length === 1) return;
        setTools((prev) => prev.filter((t) => t.id !== id));
        setErrors((prev) => {
            const t = { ...prev.tools };
            delete t[id];
            return { ...prev, tools: t };
        });
    };

    const handleAnalyze = () => {
        if (validate()) setSubmitted(true);
    };

    const handleDiscard = () => {
        setTeamSize("");
        setUseCase("");
        setTools([emptyTool()]);
        setErrors({ tools: {} });
        setSubmitted(false);
    };

    // ─── Render ──────────────────────────────────────────────────────────────
    return (

        <div className="min-h-screen bg-gray-50 flex items-start justify-center px-4 py-10 w-full">
            <div className="w-full space-y-4">

                {/* ── Page Header ── */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Audit Your AI Spend
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        See where your team is overspending on AI tools in under 2 minutes.
                    </p>
                </div>

                {/* ── Success Banner ── */}
                {submitted && (
                    <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <AlertDescription className="font-medium">
                            Analysis submitted! Your AI spend audit is being processed.
                        </AlertDescription>
                    </Alert>
                )}


                <div className="flex gap-8">
                    <div className="flex flex-col gap-8 w-full">
                        {/* ── Section 1: Team Information ── */}
                        <Card className="shadow-sm border-gray-200">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-white text-xs font-bold">
                                        1
                                    </span>
                                    Team Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                                    {/* Team Size */}
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-medium text-gray-600">
                                            How many people actively use AI tools?
                                        </Label>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                            <Input
                                                type="number"
                                                placeholder="e.g. 50"
                                                value={teamSize}
                                                min={1}
                                                className={cn(
                                                    "pl-9",
                                                    errors.teamSize && "border-red-400 focus-visible:ring-red-300"
                                                )}
                                                onChange={(e) => {
                                                    setTeamSize(e.target.value);
                                                    setErrors((p) => ({ ...p, teamSize: undefined }));
                                                }}
                                            />
                                        </div>
                                        <FieldError msg={errors.teamSize} />
                                    </div>

                                    {/* Use Case */}
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-medium text-gray-600">
                                            Primary Use Case
                                        </Label>
                                        <Select
                                            value={useCase}
                                            onValueChange={(v) => {
                                                setUseCase(v as UseCase);
                                                setErrors((p) => ({ ...p, useCase: undefined }));
                                            }}
                                        >
                                            <SelectTrigger
                                                className={cn(errors.useCase && "border-red-400 focus:ring-red-300")}
                                            >
                                                <SelectValue placeholder="Select a use case..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {USE_CASES.map((uc) => (
                                                    <SelectItem key={uc} value={uc}>
                                                        {uc}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FieldError msg={errors.useCase} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* ── Section 2: AI Tools & Spend ── */}
                        <Card className="shadow-sm border-gray-200">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5 text-base font-semibold">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-white text-xs font-bold">
                                            2
                                        </span>
                                        AI Tools &amp; Spend
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs gap-1.5 h-8"
                                        onClick={addTool}
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Add Another Tool
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {tools.map((tool, idx) => {
                                    const toolErr = errors.tools[tool.id] ?? {};
                                    return (
                                        <div
                                            key={tool.id}
                                            className="rounded-xl border border-gray-200 bg-gray-50/60 p-4 transition-colors focus-within:border-indigo-200 focus-within:bg-white"
                                        >
                                            {/* Row header */}
                                            <div className="flex items-center justify-between mb-3">
                                                <Badge variant="secondary" className="text-indigo-600 bg-indigo-50 text-xs font-semibold">
                                                    Tool #{idx + 1}
                                                </Badge>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50"
                                                            disabled={tools.length === 1}
                                                            onClick={() => removeTool(tool.id)}
                                                        >
                                                            <X className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Remove tool</TooltipContent>
                                                </Tooltip>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 mb-3 max-sm:grid-cols-1">
                                                {/* Tool Name */}
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs font-medium text-gray-600">Tool Name</Label>
                                                    <ToolNameInput
                                                        value={tool.toolName}
                                                        error={toolErr.toolName}
                                                        onChange={(v) => updateTool(tool.id, "toolName", v)}
                                                    />
                                                    <FieldError msg={toolErr.toolName} />
                                                </div>

                                                {/* Plan */}
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs font-medium text-gray-600">Plan</Label>
                                                    <Select
                                                        value={tool.plan}
                                                        onValueChange={(v) => updateTool(tool.id, "plan", v)}
                                                    >
                                                        <SelectTrigger
                                                            className={cn(toolErr.plan && "border-red-400 focus:ring-red-300")}
                                                        >
                                                            <SelectValue placeholder="Select plan..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {PLANS.map((p) => (
                                                                <SelectItem key={p} value={p}>
                                                                    {p}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FieldError msg={toolErr.plan} />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                                                {/* Seats */}
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs font-medium text-gray-600">Number of Seats</Label>
                                                    <Input
                                                        type="number"
                                                        placeholder="e.g. 45"
                                                        min={1}
                                                        value={tool.seats}
                                                        className={cn(toolErr.seats && "border-red-400 focus-visible:ring-red-300")}
                                                        onChange={(e) => updateTool(tool.id, "seats", e.target.value)}
                                                    />
                                                    <FieldError msg={toolErr.seats} />
                                                </div>

                                                {/* Monthly Spend */}
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs font-medium text-gray-600">Current Monthly Spend</Label>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                                            $
                                                        </span>
                                                        <Input
                                                            type="number"
                                                            placeholder="0.00"
                                                            min={0}
                                                            value={tool.monthlySpend}
                                                            className={cn(
                                                                "pl-6",
                                                                toolErr.monthlySpend && "border-red-400 focus-visible:ring-red-300"
                                                            )}
                                                            onChange={(e) => updateTool(tool.id, "monthlySpend", e.target.value)}
                                                        />
                                                    </div>
                                                    <FieldError msg={toolErr.monthlySpend} />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Add Tool Button */}
                                <button
                                    type="button"
                                    onClick={addTool}
                                    className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center gap-2 text-sm text-gray-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/40 transition-all"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add another AI tool to your audit
                                </button>
                            </CardContent>
                        </Card>
                    </div>
                    {/* ── Audit Outlook Card ── */}
                    <div className="relative">
                        <Card className="bg-gray-900 border-gray-800 text-white shadow-xl w-100">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base text-white">
                                    <Sparkles className="h-4 w-4 text-amber-400" />
                                    AI Spend Snapshot
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400">Tracked Tools</span>
                                    <span className="text-sm font-medium text-gray-200">{audit.tracked}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400">Projected Annual</span>
                                    <span className="text-sm font-medium text-gray-200">
                                        {fmt(audit.projectedAnnual)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400">Potential Savings</span>
                                    <Badge className="bg-amber-400/15 text-amber-400 border-0 text-xs font-mono tracking-wide">
                                        Pending...
                                    </Badge>
                                </div>

                                <Separator className="bg-gray-700 my-1" />

                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Total Monthly Commitment</p>
                                    <p className="text-4xl font-mono font-medium tracking-tight text-white">
                                        {fmt(audit.totalMonthly)}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>


                </div>


                {/* ── Footer ── */}
                <div>
                    <div className="flex items-center gap-3 pt-1 max-sm:flex-wrap">
                        <div className="flex items-center gap-2 text-xs text-gray-400 mr-auto">
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                            Your pricing data stays private
                        </div>
                        <Button variant="outline" className="text-sm" onClick={handleDiscard}>
                            Discard Draft
                        </Button>
                        <Button
                            className="bg-gray-900 hover:bg-gray-800 text-white text-sm gap-2"
                            onClick={handleAnalyze}
                        >
                            Analyze for Savings
                            <TrendingUp className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Audit;