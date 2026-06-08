import jsPDF from "jspdf";
import type { ScoringResult } from "./ScoringLogic";
import type { ActionItem } from "./ActionItems";
const logoWhite = "/safetyconnect-logo-white.png";

interface BuildPdfOpts {
  result: ScoringResult;
  companyName?: string;
  contactName?: string;
  contactEmail?: string;
  detailed?: boolean;
  actionItems?: ActionItem[];
}

const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
};

// VITE_API_URL is the full endpoint e.g. https://devapi.safetyconnect.io/safety-assessment
export const REPORT_API_URL = (import.meta.env.VITE_API_URL || "https://devapi.safetyconnect.io/safety-assessment").replace(/\/+$/, "");

export const cleanBase64 = (base64String: string): string => {
  if (!base64String) return "";
  let cleaned = base64String.trim();
  if (cleaned.startsWith("data:") && cleaned.includes(",")) {
    cleaned = cleaned.split(",")[1];
  }
  cleaned = cleaned.replace(/\s/g, "");
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleaned)) {
    throw new Error("Invalid PDF base64 string");
  }
  return cleaned;
};

export const getPdfBase64 = (pdf: jsPDF): string => cleanBase64(pdf.output("datauristring"));

export const buildReportPdf = ({
  result,
  companyName = "",
  contactName,
  contactEmail,
  detailed = true,
  actionItems = [],
}: BuildPdfOpts): jsPDF => {
  const ringColor =
    result.overall >= 85 ? "#16A34A" :
    result.overall >= 70 ? "#0E8A7A" :
    result.overall >= 55 ? "#421072" :
    result.overall >= 35 ? "#DC2626" : "#DC2626";

  const pdf = new jsPDF("p", "mm", "a4");
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentW = pageW - margin * 2;
  let y = 0;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - 15) { pdf.addPage(); y = margin; }
  };

  // Header banner
  pdf.setFillColor(26, 39, 68);
  pdf.rect(0, 0, pageW, 38, "F");
  try { pdf.addImage(logoWhite, "PNG", margin, 12, 60, 9); } catch (e) { console.warn("Logo failed", e); }
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.text("Safety Intelligence Assessment", pageW - margin, 18, { align: "right" });
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text("Detailed Maturity Report", pageW - margin, 25, { align: "right" });
  pdf.setFontSize(8);
  pdf.text(new Date().toLocaleString(), pageW - margin, 31, { align: "right" });
  y = 50;

  // Prepared for block
  pdf.setTextColor(0, 0, 0);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text("Prepared for:", margin, y);
  pdf.setFont("helvetica", "normal");
  const lx = margin + 35;
  if (contactName) { pdf.text(`Name: ${contactName}`, lx, y); y += 6; }
  if (contactEmail) { pdf.text(`Email: ${contactEmail}`, lx, y); y += 6; }
  if (companyName) { pdf.text(`Company: ${companyName}`, lx, y); y += 6; }
  y += 6;

  // Score box
  ensureSpace(70);
  pdf.setFillColor(26, 39, 68);
  pdf.rect(margin, y, contentW, 9, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text("Safety Intelligence Score", margin + contentW / 2, y + 6, { align: "center" });
  y += 9;
  pdf.setDrawColor(220, 220, 220);
  pdf.rect(margin, y, contentW, 50);
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(36);
  pdf.setFont("helvetica", "bold");
  pdf.text(String(result.overall), margin + contentW / 2, y + 25, { align: "center" });
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(120, 120, 120);
  pdf.text("out of 100", margin + contentW / 2, y + 31, { align: "center" });
  const [rr, rg, rb] = hexToRgb(ringColor);
  pdf.setFillColor(rr, rg, rb);
  const pillW = 60;
  pdf.roundedRect(margin + (contentW - pillW) / 2, y + 36, pillW, 8, 4, 4, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text(`Level ${result.maturityLevel} — ${result.maturityLabel}`, margin + contentW / 2, y + 41.5, { align: "center" });
  y += 54;

  pdf.setTextColor(80, 80, 80);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  const descLines = pdf.splitTextToSize(result.maturityDescription, contentW);
  pdf.text(descLines, margin, y);
  y += descLines.length * 4 + 6;

  // Score Summary table
  ensureSpace(20 + result.categories.length * 8 + 16);
  pdf.setFillColor(26, 39, 68);
  pdf.rect(margin, y, contentW, 9, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text("Score Summary", margin + 3, y + 6);
  y += 9;
  const colCat = contentW * 0.55;
  const colScore = contentW * 0.2;
  const colStatus = contentW * 0.25;
  pdf.setFillColor(240, 240, 245);
  pdf.rect(margin, y, contentW, 8, "F");
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(9);
  pdf.text("Category", margin + 3, y + 5.5);
  pdf.text("Score", margin + colCat + colScore / 2, y + 5.5, { align: "center" });
  pdf.text("Status", margin + colCat + colScore + colStatus / 2, y + 5.5, { align: "center" });
  y += 8;
  pdf.setFont("helvetica", "normal");
  result.categories.forEach((cat) => {
    pdf.setDrawColor(230, 230, 230);
    pdf.line(margin, y, margin + contentW, y);
    pdf.setTextColor(0, 0, 0);
    pdf.text(cat.name, margin + 3, y + 5.5);
    pdf.text(`${cat.percentage}%`, margin + colCat + colScore / 2, y + 5.5, { align: "center" });
    const [cr, cg, cb] = hexToRgb(cat.color);
    pdf.setFillColor(cr, cg, cb);
    const sx = margin + colCat + colScore + (colStatus - 30) / 2;
    pdf.roundedRect(sx, y + 1.5, 30, 5.5, 2.5, 2.5, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.text(cat.status, sx + 15, y + 5.3, { align: "center" });
    pdf.setFontSize(9);
    y += 8;
  });
  pdf.setFillColor(240, 240, 245);
  pdf.rect(margin, y, contentW, 8, "F");
  pdf.setTextColor(0, 0, 0);
  pdf.setFont("helvetica", "bold");
  pdf.text("Overall", margin + 3, y + 5.5);
  pdf.text(`${result.overall}%`, margin + colCat + colScore / 2, y + 5.5, { align: "center" });
  pdf.setFillColor(rr, rg, rb);
  const ox = margin + colCat + colScore + (colStatus - 30) / 2;
  pdf.roundedRect(ox, y + 1.5, 30, 5.5, 2.5, 2.5, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  pdf.text(result.maturityLabel, ox + 15, y + 5.3, { align: "center" });
  pdf.setFontSize(9);
  y += 14;

  // Category breakdown bars
  ensureSpace(20);
  pdf.setFillColor(26, 39, 68);
  pdf.rect(margin, y, contentW, 9, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text("Category Breakdown", margin + 3, y + 6);
  y += 12;
  y += 6;
  result.categories.forEach((cat) => {
    ensureSpace(15);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.text(cat.name, margin, y);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(120, 120, 120);
    pdf.text(`${cat.percentage}% (${cat.earned}/${cat.max} pts)`, margin + contentW, y, { align: "right" });
    y += 3;
    pdf.setFillColor(235, 235, 240);
    pdf.roundedRect(margin, y, contentW, 3, 1.5, 1.5, "F");
    const [bR, bG, bB] = hexToRgb(cat.color);
    pdf.setFillColor(bR, bG, bB);
    pdf.roundedRect(margin, y, (contentW * cat.percentage) / 100, 3, 1.5, 1.5, "F");
    y += 9;
  });
  y += 4;

  // Action items
  if (detailed && actionItems.length > 0) {
    ensureSpace(20);
    pdf.setFillColor(26, 39, 68);
    pdf.rect(margin, y, contentW, 9, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text("Recommended Action Items", margin + 3, y + 6);
    y += 12;
    actionItems.forEach((item) => {
      const qLines = pdf.splitTextToSize(item.question, contentW - 35);
      const aLines = pdf.splitTextToSize(item.action, contentW - 6);
      const blockH = 8 + qLines.length * 4.5 + aLines.length * 4 + 6;
      ensureSpace(blockH);
      pdf.setDrawColor(220, 220, 225);
      pdf.roundedRect(margin, y, contentW, blockH, 1.5, 1.5);
      const innerY = y + 5;
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(120, 120, 120);
      pdf.text(item.category.toUpperCase(), margin + 3, innerY);
      const pillColor = item.priority === "High" ? "#DC2626" : item.priority === "Medium" ? "#D97706" : "#0E8A7A";
      const [pr, pg, pb] = hexToRgb(pillColor);
      pdf.setFillColor(pr, pg, pb);
      pdf.roundedRect(margin + contentW - 28, innerY - 3.5, 25, 5, 2.5, 2.5, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(7);
      pdf.text(`${item.priority} priority`, margin + contentW - 15.5, innerY, { align: "center" });
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text(qLines, margin + 3, innerY + 5);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(60, 60, 60);
      pdf.text(aLines, margin + 3, innerY + 5 + qLines.length * 4.5 + 1);
      y += blockH + 3;
    });
  }

  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setDrawColor(220, 220, 220);
    pdf.line(margin, pageH - 12, pageW - margin, pageH - 12);
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text("SafetyConnect - Safety Intelligence Report", margin, pageH - 7);
    pdf.setTextColor(30, 100, 200);
    pdf.textWithLink("safetyconnect.io", pageW / 2, pageH - 7, { url: "https://safetyconnect.io", align: "center" });
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Page ${i} of ${pageCount}`, pageW - margin, pageH - 7, { align: "right" });
  }

  return pdf;
};

export const buildEmailBody = (firstName: string): string => {
  const name = firstName || "there";
  return `Hi ${name},

Thank you for taking the time to complete the assessment; your personalized Safety Intelligence Report is attached to this email.

Inside, you'll find a tailored breakdown of your inputs along with insights on where your organization stands and the opportunities ahead. We hope it gives you a clearer view of your current safety posture and a useful starting point for your next steps.

We built this platform because we believe safety intelligence shouldn't be reactive, it should be predictive, contextual, and actionable. If anything in the report sparks a question or you'd like to explore how it applies to your specific environment, we'd love to talk.

Would you be open to a 30-minute call with our team to walk through the findings and discuss what implementation could look like for you?

Warm regards,
The SafetyConnect Team`;
};

export const EMAIL_SUBJECT = "Your Safety Intelligence Report is ready";