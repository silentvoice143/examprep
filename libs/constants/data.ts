import { Option } from "@/components/shared/custom-select";

export const useCaseOptions = [
    {
        label: "Content Creation",
        value: "Content Creation",
    },
    {
        label: "Code Assistance",
        value: "Code Assistance",
    },
    {
        label: "Customer Support",
        value: "Customer Support",
    },
    {
        label: "Data Analysis",
        value: "Data Analysis",
    },
    {
        label: "Research",
        value: "Research",
    },
    {
        label: "Other",
        value: "Other",
    },
];

export type UseCase =
    | ""
    | "Content Creation"
    | "Code Assistance"
    | "Customer Support"
    | "Data Analysis"
    | "Research"
    | "Other";

export const aiTools = [
    {
        label: "ChatGPT",
        value: "chatgpt",
        plans: [
            { label: "Free", value: "free" },
            { label: "Plus", value: "plus" },
            { label: "Team", value: "team" },
            { label: "Enterprise", value: "enterprise" },
        ],
    },

    {
        label: "Claude",
        value: "claude",
        plans: [
            { label: "Free", value: "free" },
            { label: "Pro", value: "pro" },
            { label: "Team", value: "team" },
            { label: "Enterprise", value: "enterprise" },
        ],
    },

    {
        label: "Perplexity",
        value: "perplexity",
        plans: [
            { label: "Free", value: "free" },
            { label: "Pro", value: "pro" },
            { label: "Enterprise", value: "enterprise" },
        ],
    },

    {
        label: "GitHub Copilot",
        value: "github_copilot",
        plans: [
            { label: "Free", value: "free" },
            { label: "Pro", value: "pro" },
            { label: "Business", value: "business" },
            { label: "Enterprise", value: "enterprise" },
        ],
    },

    {
        label: "Cursor",
        value: "cursor",
        plans: [
            { label: "Free", value: "free" },
            { label: "Pro", value: "pro" },
            { label: "Teams", value: "teams" },
            { label: "Enterprise", value: "enterprise" },
        ],
    },

    {
        label: "Midjourney",
        value: "midjourney",
        plans: [
            { label: "Basic", value: "basic" },
            { label: "Standard", value: "standard" },
            { label: "Pro", value: "pro" },
            { label: "Mega", value: "mega" },
        ],
    },
];

export const toolIcons: Record<string, string> = {
    ChatGPT: "⬡",
    Claude: "✦",
    Perplexity: "◎",
    "GitHub Copilot": "⌁",
    Cursor: "▣",
    Midjourney: "◈",
};

export const toolColors: Record<
    string,
    {
        bg: string;
        border: string;
        badgeColor: string;
    }
> = {
    ChatGPT: {
        bg: "rgba(52, 211, 153, 0.08)",
        border: "rgba(52, 211, 153, 0.25)",
        badgeColor: "#34d399",
    },

    Claude: {
        bg: "rgba(250, 204, 21, 0.08)",
        border: "rgba(250, 204, 21, 0.25)",
        badgeColor: "#facc15",
    },

    Perplexity: {
        bg: "rgba(59, 130, 246, 0.08)",
        border: "rgba(59, 130, 246, 0.25)",
        badgeColor: "#60a5fa",
    },

    "GitHub Copilot": {
        bg: "rgba(167, 139, 250, 0.08)",
        border: "rgba(167, 139, 250, 0.25)",
        badgeColor: "#a78bfa",
    },

    "Cursor": {
        bg: "rgba(251, 146, 60, 0.08)",
        border: "rgba(251, 146, 60, 0.25)",
        badgeColor: "#fb923c",
    },

    midjourney: {
        bg: "rgba(236, 72, 153, 0.08)",
        border: "rgba(236, 72, 153, 0.25)",
        badgeColor: "#ec4899",
    },
};
