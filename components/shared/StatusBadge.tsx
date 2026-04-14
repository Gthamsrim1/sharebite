import { cn, getStatusColor, getStatusLabel } from "@/lib/utils";
import { ExpiryStatus } from "@/lib/types";

export default function StatusBadge({ status }: { status: ExpiryStatus }) {
  return (
    <span className={cn(
      "text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wide",
      getStatusColor(status)
    )}>
      {getStatusLabel(status)}
    </span>
  );
}
