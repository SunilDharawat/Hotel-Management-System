import { cn } from "@/lib/utils";

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  className,
}) {
  return (
    <div
      className={cn(
        "hotel-stat-card",
        variant === "primary" && "bg-gradient-primary text-primary-foreground",
        variant === "gold" && "bg-gradient-gold",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className={cn(
              "text-sm font-medium",
              variant === "default" ? "text-muted-foreground" : "opacity-80",
            )}
          >
            {title}
          </p>
          <p
            className={cn(
              "text-3xl  font-display font-bold mt-2",
              variant === "default" && "text-foreground",
            )}
          >
            {value}
          </p>
          {subtitle && (
            <p
              className={cn(
                "text-sm mt-1",
                variant === "default" ? "text-muted-foreground" : "opacity-70",
              )}
            >
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={cn(
                  "text-xs font-medium px-1.5 py-0.5 rounded",
                  trend.isPositive
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700",
                )}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
              <span
                className={cn(
                  "text-xs",
                  variant === "default"
                    ? "text-muted-foreground"
                    : "opacity-70",
                )}
              >
                vs last week
              </span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            variant === "default" && "bg-primary/10",
            variant === "primary" && "bg-white/20",
            variant === "gold" && "bg-hotel-navy/10",
          )}
        >
          <Icon
            className={cn(
              "h-6 w-6",
              variant === "default" && "text-primary",
              variant === "primary" && "text-white",
              variant === "gold" && "text-hotel-navy",
            )}
          />
        </div>
      </div>
    </div>
  );
}
