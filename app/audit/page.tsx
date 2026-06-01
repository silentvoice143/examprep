"use client"
import { CustomSelect } from '@/components/shared/custom-select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { createAuditReport } from '@/libs/api/audit.service'
import { aiTools, useCaseOptions } from '@/libs/constants/data'
import { useStore } from '@/libs/store'
import { cn } from '@/libs/utils/utils'
import { auditFormSchema, AuditFormValues } from '@/libs/validation/audit-form'
import { Plus, ShieldCheck, Sparkles, Users, X } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'



const AuditFormPage = () => {
    const router = useRouter();
    const {
        form,
        errors,
        setErrors,
        handleChange,
        handleToolChange,
        addTool,
        removeTool,
        resetForm, setReport
    } = useStore();


    const validateForm = () => {
        const result = auditFormSchema.safeParse(form);

        if (result.success) {
            setErrors({});
            return true;
        }

        const fieldErrors = result.error.flatten();
        console.log(fieldErrors, "-------errors");


        setErrors(fieldErrors.fieldErrors);

        return false;
    };

    const [loading, setLoading] = useState(false);


    const generateReport = async () => {
        const slug = nanoid(10);

        try {
            setLoading(true);

            const payload = {
                slug: slug as string,

                teamSize: form.teamSize,

                useCase: form.useCase,

                tools: form.tools.map((tool) => ({
                    name: tool.name,
                    plan: tool.plan,

                    seats: tool.seats,

                    monthlySpend:
                        tool.monthlySpend,

                })),
            };


            console.log(payload, "--payload");

            const res = await createAuditReport(payload);
            console.log(res, "---response")

            if (res.success) {
                // setReport(res.report);

                console.log(
                    res.report,
                    "--generated report",
                );
                router.push(`/report/${slug}`);
                resetForm()
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };



    const handleSubmit = () => {
        const isValid = validateForm();

        if (!isValid) return;
        generateReport()

    };




    return (
        <div className='px-4 py-10 mx-auto max-w-7xl w-full'>
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                    Audit Your AI Spend
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    See where your team is overspending on AI tools in under 2 minutes.
                </p>
            </div>
            <div className='flex gap-8 flex-col-reverse md:flex-row'>
                <div className='flex-1'>
                    <Card className="border border-gray-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
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
                                <div className="space-y-1">
                                    <Label className="text-xs font-medium text-gray-600">
                                        How many people actively use AI tools?
                                    </Label>
                                    <div className="relative">

                                        <Input
                                            leftIcon={<Users className="h-3.5 w-3.5 text-muted-foreground" />}
                                            type="number"
                                            placeholder="Enter the number of people"
                                            min={1}
                                            value={form.teamSize}
                                            onChange={(e) => handleChange("teamSize", e.target.value)}
                                            error={errors.teamSize?.[0]}

                                        />
                                    </div>

                                </div>

                                {/* Use Case */}
                                <div className="space-y-1.5">
                                    <CustomSelect
                                        multiSelect={false}
                                        options={useCaseOptions}
                                        selected={form.useCase}
                                        onChange={(v) => handleChange("useCase", v as string)}
                                        label="Primary Use Case"
                                        labelClassName="text-xs font-medium text-gray-600"
                                        triggerClassName={cn(errors.useCase && "border-red-400 focus:ring-red-300")}
                                        error={errors?.useCase}
                                    />

                                </div>
                            </div>
                        </CardContent>
                        <div className='px-2'>
                            <Separator className="bg-gray-200 my-1" />
                        </div>
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

                            {errors?.tools && <div className='px-4 py-2 rounded-md border border-red-500 bg-red-100'>
                                <p className='text-xs text-red-400'>{errors.tools[0]}</p></div>}
                            {form.tools.map((tool, idx) => {
                                const selectedTool = aiTools.find(
                                    (t) => t.value === tool.name
                                );

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
                                                        disabled={form.tools.length === 1}
                                                        onClick={() => removeTool(idx)}
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Remove tool</TooltipContent>
                                            </Tooltip>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 mb-6 max-sm:grid-cols-1">
                                            {/* Tool Name */}
                                            <CustomSelect showSearch={false} label='Tool Name' options={aiTools.map((tool) => ({
                                                label: tool.label,
                                                value: tool.value,
                                            }))}
                                                selected={tool.name} onChange={(val) => {
                                                    handleToolChange(idx, "name", val as string);
                                                    handleToolChange(idx, "plan", "");
                                                }} />

                                            {/* Plan */}
                                            <CustomSelect showSearch={false} label='Plan' options={selectedTool?.plans.map((plan) => ({
                                                label: plan.label,
                                                value: plan.value,
                                            })) || []}
                                                selected={tool.plan} onChange={val => { handleToolChange(idx, "plan", val as string) }} />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                                            {/* Seats */}
                                            <div className="space-y-1">
                                                <Label className="text-xs font-medium text-gray-600">
                                                    Number of seats
                                                </Label>
                                                <div className="relative">

                                                    <Input type='number' placeholder='e.g. 45' className="" title="Number of seats"
                                                        value={tool.seats}
                                                        onChange={(e) =>
                                                            handleToolChange(idx, "seats", e.target.value)
                                                        }
                                                    />
                                                </div>

                                            </div>


                                            {/* Monthly Spend */}
                                            <div className="space-y-1">
                                                <Label className="text-xs font-medium text-gray-600">
                                                    Monthly spend <span className="text-xs text-muted-foreground">(in USD)</span>
                                                </Label>
                                                <div className="relative">

                                                    <Input type='number' placeholder='Monthly Spend' className="" title="Monthly Spend"
                                                        value={tool.monthlySpend}
                                                        onChange={(e) =>
                                                            handleToolChange(idx, "monthlySpend", e.target.value)
                                                        }

                                                    />
                                                </div>

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
                {/* <div className="relative">
                    <Card className="bg-gray-900 border-gray-800 text-white shadow-xl md:w-100 w-full">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base text-white">
                                <Sparkles className="h-4 w-4 text-amber-400" />
                                AI Spend Snapshot
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400">Tracked Tools</span>
                                <span className="text-sm font-medium text-gray-200">Hello</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400">Projected Annual</span>
                                <span className="text-sm font-medium text-gray-200">

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

                                </p>
                            </div>
                        </CardContent>

                    </Card>
                </div> */}

            </div>
            <Separator className="my-6" />
            <div className="flex gap-4 sm:items-center justify-between flex-col items-start sm:flex-row ">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    <span>Your data is secure and protected.</span>
                </div>

                <Button disabled={loading} onClick={handleSubmit} className="min-w-48 w-full sm:w-fit h-12">
                    {loading ? "Generating..." : "Generate Report"}
                </Button>
            </div>
        </div>
    )
}

export default AuditFormPage