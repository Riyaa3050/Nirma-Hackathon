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
      default:
        return "Unknown";
    }
  };

  const riskLevel = getRiskLevel(score);
  
  return (
    <span
      className={cn(
        `risk-badge-${riskLevel}`,
        className
      )}
    >
      {getRiskText(riskLevel)} ({score}%)
    </span>
  );
}
