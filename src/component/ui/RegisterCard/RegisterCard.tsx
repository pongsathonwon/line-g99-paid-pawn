import { Link } from "react-router-dom";

function RegisterCard({
  to,
  title,
  description,
  highlight = false,
}: {
  to: string;
  title: string;
  description: string;
  highlight?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`relative rounded-2xl border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg
        ${
          highlight
            ? "border-brand-red ring-1 ring-brand-red/20"
            : "border-gray-200"
        }
      `}
    >
      {highlight && (
        <span className="absolute right-4 top-4 rounded-full bg-brand-red px-3 py-1 text-xs font-semibold text-white">
          แนะนำ
        </span>
      )}

      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  );
}
export default RegisterCard;
