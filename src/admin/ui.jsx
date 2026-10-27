import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Sparkline, formatNumber } from "./charts.jsx";

export function Card({ title, subtitle, action, children, className = "", as: Tag = "section", padded = true }) {
  return (
    <Tag className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
      {(title || action) && (
        <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5">
          <div>
            {title && <h2 className="text-base font-semibold text-slate-900">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={padded ? "p-5" : ""}>{children}</div>
    </Tag>
  );
}

export function Segmented({ label, options, value, onChange }) {
  return (
    <div role="group" aria-label={label} className="inline-flex max-w-full flex-wrap rounded-lg border border-slate-300 bg-slate-100 p-0.5">
      {options.map((option) => {
        const selected = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.id)}
            className={`min-h-9 rounded-md px-3 text-sm font-medium transition ${
              selected ? "bg-white text-blue-700 shadow-sm ring-1 ring-slate-200" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function SelectField({ label, value, onChange, options }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-slate-600">
      <span className="sr-only sm:not-sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
      >
        {options.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
      </select>
    </label>
  );
}

// `percent` is null when there is no baseline; `undefined` hides the badge (no comparison for this range).
export function Delta({ percent }) {
  if (percent === undefined) return null;
  if (percent === null) {
    return <span className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-medium text-slate-600">novo<span className="sr-only"> u odnosu na prethodno razdoblje</span></span>;
  }
  const up = percent > 0;
  const flat = percent === 0;
  const Icon = flat ? Minus : up ? ArrowUpRight : ArrowDownRight;
  const tone = flat ? "text-slate-600" : up ? "text-emerald-700" : "text-red-700";
  return (
    <span className={`inline-flex items-center gap-0.5 whitespace-nowrap text-sm font-medium tabular-nums ${tone}`}>
      <Icon size={15} aria-hidden="true" />
      {up ? "+" : flat ? "" : "−"}{Math.abs(percent)} %
      <span className="sr-only"> u odnosu na prethodno razdoblje</span>
    </span>
  );
}

export function Scorecard({ label, value, delta, hint, series }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-600">{label}</p>
      <div className="mt-1 flex items-end justify-between gap-2">
        <p className="text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">{typeof value === "number" ? formatNumber(value) : value}</p>
        {series && <Sparkline series={series} />}
      </div>
      <div className="mt-1 flex min-h-5 flex-wrap items-center gap-x-2">
        <Delta percent={delta} />
        {hint && <span className="text-xs text-slate-500">{hint}</span>}
      </div>
    </div>
  );
}

export function Legend({ items }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
      {items.map((item) => (
        <li key={item.label} className="inline-flex items-center gap-2">
          <svg width="22" height="8" aria-hidden="true">
            <line x1="1" x2="21" y1="4" y2="4" stroke={item.color} strokeWidth="2.5" strokeDasharray={item.dashed ? "4 3" : undefined} strokeLinecap="round" />
          </svg>
          {item.label}
        </li>
      ))}
    </ul>
  );
}
