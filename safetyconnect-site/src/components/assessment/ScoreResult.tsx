import type { ScoringResult } from "./ScoringLogic";
import type{ ActionItem } from "./ActionItems";
import { buildReportPdf } from "./pdfReport";


const MATURITY_LEVELS = [
  { level: 1, label: "Lagging", range: "0–34", color: "#DC2626" },
  { level: 2, label: "Reactive", range: "35–54", color: "#DC2626" },
  { level: 3, label: "Developing", range: "55–69", color: "#421072" },
  { level: 4, label: "Proactive", range: "70–84", color: "#0E8A7A" },
  { level: 5, label: "Optimising", range: "85–100", color: "#16A34A" },
];

interface Props {
  result: ScoringResult;
  companyName: string;
  detailed?: boolean;
  actionItems?: ActionItem[];
  onGetDetailed?: () => void;
  contactName?: string;
  contactEmail?: string;
}

const ScoreResult = ({ result, companyName, detailed = false, actionItems = [], onGetDetailed, contactName, contactEmail }: Props) => {
  const ringColor =
    result.overall >= 85 ? "#16A34A" :
    result.overall >= 70 ? "#0E8A7A" :
    result.overall >= 55 ? "#421072" :
    result.overall >= 35 ? "#DC2626" : "#DC2626";

  //  Download only (email is sent automatically on "Get Detailed Report") 
  const handleDownload = () => {
    const pdf = buildReportPdf({
      result,
      companyName,
      contactName,
      contactEmail,
      detailed,
      actionItems,
    });
    pdf.save(`Safety-Intelligence-Report${companyName ? "-" + companyName.replace(/\s+/g, "_") : ""}.pdf`);
  };

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Hero: Score Ring */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-primary text-primary-foreground px-4 sm:px-6 py-3 font-medium text-sm sm:text-base text-center">
          Safety Intelligence Score
        </div>
        <div className="p-6 sm:p-10 space-y-4 text-center">
          {companyName && (
            <p className="text-base sm:text-lg font-medium text-muted-foreground">{companyName}</p>
          )}
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="60" fill="none" stroke="hsl(var(--border))" strokeWidth="10" />
                <circle
                  cx="70" cy="70" r="60" fill="none"
                  stroke={ringColor} strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${(result.overall / 100) * 377} 377`}
                />
              </svg>
              <div className="z-10 flex flex-col items-center">
                <span className="text-4xl sm:text-5xl font-bold">{result.overall}</span>
                <span className="text-xs text-muted-foreground">out of 100</span>
              </div>
            </div>
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: ringColor }}
            >
              Level {result.maturityLevel} — {result.maturityLabel}
            </div>
          </div>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            {result.maturityDescription}
          </p>
        </div>
      </div>

      {/* Category Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {result.categories.map((cat) => (
          <div key={cat.name} className="border rounded-lg p-4 sm:p-5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold leading-tight">{cat.name}</h3>
              <span
                className="shrink-0 text-xs font-medium px-2.5 py-0.5 rounded-full text-white"
                style={{ backgroundColor: cat.color }}
              >
                {cat.status}
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{cat.percentage}%</span>
                <span>{cat.earned}/{cat.max} pts</span>
              </div>
              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Maturity Scale */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-primary text-primary-foreground px-4 sm:px-6 py-3 font-medium text-sm sm:text-base">
          Maturity Scale
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {MATURITY_LEVELS.map((m) => {
              const isActive = m.level === result.maturityLevel;
              return (
                <div
                  key={m.level}
                  className={`rounded-lg p-2 sm:p-3 text-center transition-all ${
                    isActive ? "ring-2 ring-offset-2 scale-105" : "opacity-60"
                  }`}
                  style={{
                    backgroundColor: isActive ? m.color : undefined,
                    borderColor: m.color,
                    ...(isActive ? {} : { border: `1px solid ${m.color}` }),
                    ...(isActive ? { ringColor: m.color } : {}),
                  }}
                >
                  <div className={`text-lg sm:text-xl font-bold ${isActive ? "text-white" : ""}`}>
                    {m.level}
                  </div>
                  <div className={`text-[10px] sm:text-xs font-medium ${isActive ? "text-white" : ""}`}>
                    {m.label}
                  </div>
                  <div className={`text-[9px] sm:text-[10px] mt-0.5 ${isActive ? "text-white/80" : "text-muted-foreground"}`}>
                    {m.range}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-primary text-primary-foreground px-4 sm:px-6 py-3 font-medium text-sm sm:text-base">
          Score Summary
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-4 py-2.5 font-medium">Category</th>
                <th className="text-center px-4 py-2.5 font-medium">Score</th>
                <th className="text-center px-4 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {result.categories.map((cat) => (
                <tr key={cat.name} className="border-b last:border-0">
                  <td className="px-4 py-2.5">{cat.name}</td>
                  <td className="px-4 py-2.5 text-center font-medium">{cat.percentage}%</td>
                  <td className="px-4 py-2.5 text-center">
                    <span
                      className="text-xs font-medium px-2.5 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: cat.color }}
                    >
                      {cat.status}
                    </span>
                  </td>
                </tr>
              ))}
              <tr className="bg-muted/50 font-semibold">
                <td className="px-4 py-2.5">Overall</td>
                <td className="px-4 py-2.5 text-center">{result.overall}%</td>
                <td className="px-4 py-2.5 text-center">
                  <span
                    className="text-xs font-medium px-2.5 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: ringColor }}
                  >
                    {result.maturityLabel}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Items (Detailed report only) */}
      {detailed && actionItems.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-primary text-primary-foreground px-4 sm:px-6 py-3 font-medium text-sm sm:text-base">
            Recommended Action Items
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Prioritised recommendations based on your responses. Focus on the highest priority items first.
            </p>
            <ul className="space-y-3">
              {actionItems.map((item, idx) => {
                const pillColor =
                  item.priority === "High" ? "#DC2626" :
                  item.priority === "Medium" ? "#D97706" : "#0E8A7A";
                return (
                  <li key={idx} className="border rounded-md p-3 sm:p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.category}</p>
                        <p className="font-medium text-sm">{item.question}</p>
                      </div>
                      <span
                        className="shrink-0 text-[10px] sm:text-xs font-medium px-2.5 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: pillColor }}
                      >
                        {item.priority} priority
                      </span>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{item.action}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* CTA Section */}
      {!detailed ? (
        <div className="rounded-lg p-6 sm:p-8 text-center space-y-4" style={{ backgroundColor: "#1A2744" }}>
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            Want a deeper analysis?
          </h2>
          <p className="text-sm text-white/70 max-w-md mx-auto">
            Get your detailed report with prioritised action items and recommendations tailored to your organisation.
          </p>
          <button
            onClick={onGetDetailed}
            className="inline-block px-6 py-2.5 rounded font-medium text-sm bg-next-btn text-accent-foreground hover:opacity-90"
          >
            Get Detailed Report
          </button>
        </div>
      ) : (
        <div className="rounded-lg p-6 sm:p-8 text-center space-y-4" style={{ backgroundColor: "#1A2744" }}>
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            Ready to elevate your safety culture?
          </h2>
          <p className="text-sm text-white/70 max-w-md mx-auto">
            Let our experts help you build a world-class safety program tailored to your organization.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://www.safetyconnect.io/get-a-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2.5 rounded font-medium text-sm bg-next-btn text-accent-foreground hover:opacity-90"
            >
              Book a Demo Session
            </a>
            <button
              onClick={handleDownload}
              className="inline-block px-6 py-2.5 rounded font-medium text-sm bg-white text-primary hover:opacity-90"
            >
              Download Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreResult;