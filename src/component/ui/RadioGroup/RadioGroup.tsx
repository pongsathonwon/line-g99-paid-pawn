import clsx from "clsx";

export type TRadioOption<T extends string> = {
  value: T;
  label: string;
};

type TRadioGroupProps<T extends string> = {
  options: TRadioOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
};

function RadioGroup<T extends string>({
  options,
  value,
  onChange,
  label,
}: TRadioGroupProps<T>) {
  return (
    <div className="space-y-3">
      {label && (
        <p className="text-sm font-semibold text-gray-700">{label}</p>
      )}
      {options.map((opt) => {
        const isActive = value === opt.value;

        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={clsx(
              "w-full flex items-center gap-4 rounded-xl border px-4 py-3 text-left transition",
              isActive
                ? "border-brand-red bg-brand-red/5"
                : "border-gray-300 bg-white hover:border-gray-400"
            )}
          >
            <span
              className={clsx(
                "flex h-4 w-4 items-center justify-center rounded-full border",
                isActive ? "border-brand-red" : "border-gray-400"
              )}
            >
              {isActive && (
                <span className="h-2 w-2 rounded-full bg-brand-red" />
              )}
            </span>

            <span
              className={clsx(
                "text-sm font-medium",
                isActive ? "text-brand-red" : "text-gray-800"
              )}
            >
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default RadioGroup;
