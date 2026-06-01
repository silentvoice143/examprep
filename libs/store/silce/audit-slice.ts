import { AuditFormValues } from "@/libs/validation/audit-form";
import { StateCreator } from "zustand";

type Tool = AuditFormValues["tools"][0];

const initialTool = (): Tool => ({
    id: crypto.randomUUID(),
    name: "",
    plan: "",
    seats: "",
    monthlySpend: "",
});

const initialForm: AuditFormValues = {
    teamSize: "",
    useCase: "",
    tools: [initialTool()],
};

export interface AuditSlice {
    form: AuditFormValues;
    report: any;
    setReport: (report: any) => void;

    errors: Record<string, any>;

    setErrors: (errors: Record<string, any>) => void;

    handleChange: <K extends keyof AuditFormValues>(
        key: K,
        value: AuditFormValues[K]
    ) => void;

    handleToolChange: (
        index: number,
        key: keyof Tool,
        value: string
    ) => void;

    addTool: () => void;

    removeTool: (index: number) => void;

    resetForm: () => void;
}

export const createAuditSlice: StateCreator<AuditSlice> = (set) => ({
    form: initialForm,
    report: null,
    setReport: (report) =>
        set({
            report,
        }),
    errors: {},

    setErrors: (errors) =>
        set({
            errors,
        }),

    handleChange: (key, value) =>
        set((state) => ({
            form: {
                ...state.form,
                [key]: value,
            },
        })),

    handleToolChange: (index, key, value) =>
        set((state) => {
            const updatedTools = [...state.form.tools];

            updatedTools[index] = {
                ...updatedTools[index],
                [key]: value,
            };

            return {
                form: {
                    ...state.form,
                    tools: updatedTools,
                },
            };
        }),

    addTool: () =>
        set((state) => ({
            form: {
                ...state.form,
                tools: [...state.form.tools, initialTool()],
            },
        })),

    removeTool: (index) =>
        set((state) => ({
            form: {
                ...state.form,
                tools: state.form.tools.filter((_, i) => i !== index),
            },
        })),



    resetForm: () =>
        set({
            form: initialForm,
            errors: {},
        }),
});