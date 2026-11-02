import { Star } from "lucide-react";
import { cn } from "@/utils";

const STARS = [1, 2, 3, 4, 5];

type TStarRatingProps = {
  value?: number;
  onChange: (value: number) => void;
  label: string;
  starLabel?: (n: number) => string;
  invalid?: boolean;
};

/** 1–5 stars; there is no 0, a row starts empty until a star is picked. */
function StarRating({
  value,
  onChange,
  label,
  starLabel = (n) => `${n}`,
  invalid = false,
}: TStarRatingProps) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      aria-invalid={invalid}
      className="flex gap-1"
    >
      {STARS.map((n) => {
        const isFilled = value !== undefined && n <= value;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={starLabel(n)}
            onClick={() => onChange(n)}
            className="p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
          >
            <Star
              aria-hidden
              className={cn(
                "h-8 w-8 transition-colors",
                isFilled ? "fill-gold-500 text-gold-500" : "text-gray-400",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

export default StarRating;
