import { cn } from "@/lib/utils";
import type { TimesheetStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: TimesheetStatus;
}

const statusLabels: Record<TimesheetStatus, string> = {
  completed: "COMPLETED",
  incomplete: "INCOMPLETE",
  missing: "MISSING",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded text-xs font-semibold uppercase tracking-wide",
        {
          "bg-green-100 text-green-700": status === "completed",
          "bg-yellow-100 text-yellow-700": status === "incomplete",
          "bg-red-100 text-red-600": status === "missing",
        }
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
