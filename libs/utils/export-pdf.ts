import html2canvas from "html2canvas";
import jsPDF from "jspdf";


// ================================
// COLOR SANITIZER
// ================================

const BAD_RE = /\b(oklch|oklab|lab|lch)\s*\(/i;

const COLOR_PROPS = [
    "color",
    "backgroundColor",
    "borderTopColor",
    "borderRightColor",
    "borderBottomColor",
    "borderLeftColor",
    "outlineColor",
    "fill",
    "stroke",
] as const;

function sanitizeClone(original: HTMLElement, clone: HTMLElement) {
    const originals = [
        original,
        ...Array.from(
            original.querySelectorAll<HTMLElement>("*")
        ),
    ];

    const clones = [
        clone,
        ...Array.from(
            clone.querySelectorAll<HTMLElement>("*")
        ),
    ];

    originals.forEach((orig, i) => {
        const cloneEl = clones[i];

        if (!cloneEl) return;

        const computed =
            window.getComputedStyle(orig);

        COLOR_PROPS.forEach((prop) => {
            const val = computed[prop] as string;

            if (val && BAD_RE.test(val)) {
                if (prop.includes("background")) {
                    cloneEl.style[prop as any] =
                        "#0B0F19";
                } else {
                    cloneEl.style[prop as any] =
                        "#E2E8F0";
                }
            }
        });

        if (
            computed.boxShadow &&
            BAD_RE.test(computed.boxShadow)
        ) {
            cloneEl.style.boxShadow = "none";
        }
    });
}

function applyCloneModifiers(clone: HTMLElement) {

    // Hide elements
    clone
        .querySelectorAll<HTMLElement>(".clone-hide")
        .forEach((el) => {
            el.style.display = "none";
        });

    // Shift elements slightly
    clone
        .querySelectorAll<HTMLElement>(".clone-shift")
        .forEach((el) => {
            el.style.transform =
                `${el.style.transform || ""} translateY(-4px)`;

            el.style.transition = "none";
        });
}

function applyPdfClasses(clone: HTMLElement) {

    clone
        .querySelectorAll<HTMLElement>(".pdf-bg-white")
        .forEach((el) => {

            el.style.setProperty(
                "background-color",
                "#ffffff",
                "important"
            );
        });

    clone
        .querySelectorAll<HTMLElement>(".pdf-bg-dark")
        .forEach((el) => {

            el.style.setProperty(
                "background-color",
                "#0B0F19",
                "important"
            );
        });

    clone
        .querySelectorAll<HTMLElement>(".pdf-text-black")
        .forEach((el) => {

            el.style.setProperty(
                "color",
                "#000000",
                "important"
            );
        });

    clone
        .querySelectorAll<HTMLElement>(".pdf-text-white")
        .forEach((el) => {

            el.style.setProperty(
                "color",
                "#ffffff",
                "important"
            );
        });
}

// ================================
// PDF EXPORT
// ================================

export async function exportAuditPDF(
    elementId = "audit-report"
) {
    const source =
        document.getElementById(elementId);

    if (!source) {
        throw new Error(
            `Element #${elementId} not found`
        );
    }

    // A4 @ 96dpi
    const PAGE_WIDTH = 794;
    const PAGE_HEIGHT = 1123;

    const SCALE = 2;

    // Clone offscreen
    const clone = source.cloneNode(
        true
    ) as HTMLElement;

    Object.assign(clone.style, {
        position: "fixed",
        top: "0",
        left: "-100000px",
        width: `${PAGE_WIDTH}px`,
        background: "#0B0F19",
        zIndex: "-1",
    });

    document.body.appendChild(clone);

    await new Promise((r) =>
        requestAnimationFrame(() =>
            requestAnimationFrame(r)
        )
    );

    sanitizeClone(source, clone);
    applyCloneModifiers(clone);
    applyPdfClasses(clone)

    const totalHeight = clone.scrollHeight;

    const totalPages = Math.ceil(
        totalHeight / PAGE_HEIGHT
    );

    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
        compress: true,
    });

    for (
        let pageIndex = 0;
        pageIndex < totalPages;
        pageIndex++
    ) {
        const yOffset =
            pageIndex * PAGE_HEIGHT;

        const canvas = await html2canvas(clone, {
            scale: SCALE,
            useCORS: true,
            backgroundColor: "#0B0F19",

            width: PAGE_WIDTH,
            height: PAGE_HEIGHT,

            x: 0,
            y: yOffset,

            windowWidth: PAGE_WIDTH,
            windowHeight: PAGE_HEIGHT,

            scrollX: 0,
            scrollY: 0,

            logging: false,
        });

        const imgData = canvas.toDataURL(
            "image/jpeg",
            0.92
        );

        if (pageIndex > 0) {
            pdf.addPage();
        }

        const pdfWidth =
            pdf.internal.pageSize.getWidth();

        const pdfHeight =
            (canvas.height * pdfWidth) /
            canvas.width;

        pdf.addImage(
            imgData,
            "JPEG",
            0,
            0,
            pdfWidth,
            pdfHeight
        );

        // allow UI updates
        await new Promise((r) =>
            setTimeout(r, 0)
        );
    }

    document.body.removeChild(clone);

    pdf.save("ai-spend-audit-report.pdf");
}