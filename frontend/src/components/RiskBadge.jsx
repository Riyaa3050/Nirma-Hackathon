import { cn } from "@/lib/utils";

export function RiskBadge({ score, className }) {
  const getRiskLevel = (score) => {
    if (score < 30) return "low";
    if (score < 70) return "medium";
    return "high";
  };

  const getRiskText = (level) => {
    switch (level) {
      case "low":
        return "Low Risk";
      case "medium":
        return "Medium Risk";
      case "high":
        return "High Risk";
    }
  };

  const riskLevel = getRiskLevel(score);

  const riskClasses = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={cn(
        "px-2 py-1 rounded-md text-xs font-semibold",
        riskClasses[riskLevel],
        className
      )}
    >
      {getRiskText(riskLevel)} ({score}%)
    </span>
  );
}
