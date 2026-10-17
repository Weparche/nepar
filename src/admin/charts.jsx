import { useEffect, useMemo, useRef, useState } from "react";

const nf = new Intl.NumberFormat("hr-HR");
export const formatNumber = (value) => nf.format(value);

const shortDate = new Intl.DateTimeFormat("hr-HR", { day: "numeric", month: "numeric" });
const longDate = new Intl.DateTimeFormat("hr-HR", { weekday: "short", day: "numeric", month: "long", year: "numeric" });

export function formatShort(key) {
  return shortDate.format(new Date(`${key}T00:00:00Z`)).replace(/\s/g, "");
}

export function formatLong(key) {
  return longDate.format(new Date(`${key}T00:00:00Z`));
}

function useWidth(ref, fallback = 640) {
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(240, Math.round(entry.contentRect.width))));
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return width;
}

// Integer-friendly axis: four intervals, step from 1/2/5 x 10^n.
function axis(max) {
  const raw = Math.max(max, 1) / 4;
  const power = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].map((m) => m * power).find((candidate) => candidate >= raw);
  return { step, top: step * 4, ticks: [0, 1, 2, 3, 4].map((i) => i * step) };
}

export const CHART_CURRENT = "#2563eb";
export const CHART_PREVIOUS = "#94a3b8";

export function TrendChart({ series, previous, unit = "posjeta", height = 280 }) {
  const wrapRef = useRef(null);
  const width = useWidth(wrapRef);
  const [active, setActive] = useState(null);
  const margin = { top: 14, right: 14, bottom: 30, left: 40 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;
  const count = series.length;

  const { top, ticks } = useMemo(
    () => axis(Math.max(0, ...series.map((p) => p.value), ...(previous || []).map((p) => p.value))),
    [series, previous],
  );
  const x = (index) => margin.left + (count === 1 ? innerW / 2 : (index / (count - 1)) * innerW);
  const y = (value) => margin.top + innerH - (value / top) * innerH;
  const line = (points) => points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
  const area = `${line(series)} L${x(count - 1).toFixed(1)},${y(0)} L${x(0).toFixed(1)},${y(0)} Z`;

  const labelEvery = Math.max(1, Math.ceil(count / Math.max(2, Math.floor(innerW / 64))));
  const labelIndexes = [];
  for (let i = 0; i < count; i += labelEvery) labelIndexes.push(i);
  if (count - 1 - labelIndexes[labelIndexes.length - 1] >= Math.ceil(labelEvery / 2)) labelIndexes.push(count - 1);

  function move(clientX) {
    const rect = wrapRef.current.getBoundingClientRect();
    const rel = (clientX - rect.left - margin.left) / innerW;
    setActive(Math.max(0, Math.min(count - 1, Math.round(rel * (count - 1)))));
  }

  function onKey(event) {
    if (event.key === "ArrowLeft") setActive((cur) => Math.max(0, (cur ?? count) - 1));
    else if (event.key === "ArrowRight") setActive((cur) => Math.min(count - 1, (cur ?? -1) + 1));
    else if (event.key === "Escape") setActive(null);
    else return;
    event.preventDefault();
  }

  const point = active == null ? null : series[active];
  const prevPoint = active == null || !previous ? null : previous[active];
  const tipLeft = point ? Math.min(Math.max(x(active), 90), width - 90) : 0;

  return (
    <div ref={wrapRef} className="relative w-full min-w-0 select-none overflow-x-clip">
      <svg
        width={width}
        height={height}
        role="img"
        tabIndex={0}
        aria-label={`Graf: ${unit} po danima, ${series.length} dana. Strelicama lijevo i desno čitaš pojedinačne dane.`}
        className="block touch-pan-y rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        onPointerMove={(e) => move(e.clientX)}
        onPointerLeave={() => setActive(null)}
        onKeyDown={onKey}
        onBlur={() => setActive(null)}
      >
        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={margin.left} x2={width - margin.right} y1={y(tick)} y2={y(tick)} stroke="#e2e8f0" strokeWidth="1" />
            <text x={margin.left - 8} y={y(tick) + 4} textAnchor="end" fontSize="12" fill="#64748b">{formatNumber(tick)}</text>
          </g>
        ))}
        {labelIndexes.map((i) => (
          <text key={series[i].date} x={x(i)} y={height - 8} textAnchor={i === 0 ? "start" : i === count - 1 ? "end" : "middle"} fontSize="12" fill="#64748b">
            {formatShort(series[i].date)}
          </text>
        ))}
        {count > 1 && <path d={area} fill={CHART_CURRENT} opacity="0.08" />}
        {previous && count > 1 && (
          <path d={line(previous)} fill="none" stroke={CHART_PREVIOUS} strokeWidth="2" strokeDasharray="5 5" strokeLinejoin="round" />
        )}
        {count > 1 ? (
          <path d={line(series)} fill="none" stroke={CHART_CURRENT} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        ) : (
          <circle cx={x(0)} cy={y(series[0].value)} r="5" fill={CHART_CURRENT} />
        )}
        {point && (
          <g>
            <line x1={x(active)} x2={x(active)} y1={margin.top} y2={margin.top + innerH} stroke="#94a3b8" strokeWidth="1" />
            {prevPoint && <circle cx={x(active)} cy={y(prevPoint.value)} r="4" fill="#fff" stroke={CHART_PREVIOUS} strokeWidth="2" />}
            <circle cx={x(active)} cy={y(point.value)} r="5" fill="#fff" stroke={CHART_CURRENT} strokeWidth="2.5" />
          </g>
        )}
      </svg>

      {point && (
        <div
          className="pointer-events-none absolute top-2 z-10 w-44 -translate-x-1/2 rounded-lg border border-slate-200 bg-white p-3 text-xs shadow-lg"
          style={{ left: tipLeft }}
          role="status"
        >
          <p className="mb-1.5 font-semibold text-slate-900">{formatLong(point.date)}</p>
          <p className="flex items-center justify-between gap-2 text-slate-700">
            <span className="inline-flex items-center gap-1.5"><i className="inline-block size-2 rounded-full" style={{ background: CHART_CURRENT }} />Ovo razdoblje</span>
            <b className="tabular-nums text-slate-900">{formatNumber(point.value)}</b>
          </p>
          {prevPoint && (
            <p className="mt-1 flex items-center justify-between gap-2 text-slate-500">
              <span className="inline-flex items-center gap-1.5"><i className="inline-block size-2 rounded-full" style={{ background: CHART_PREVIOUS }} />{formatShort(prevPoint.date)}</span>
              <b className="tabular-nums text-slate-700">{formatNumber(prevPoint.value)}</b>
            </p>
          )}
        </div>
      )}

      <table className="sr-only">
        <caption>{unit} po danima</caption>
        <thead><tr><th>Datum</th><th>Ovo razdoblje</th>{previous && <th>Prethodno razdoblje</th>}</tr></thead>
        <tbody>
          {series.map((p, i) => (
            <tr key={p.date}><td>{p.date}</td><td>{p.value}</td>{previous && <td>{previous[i]?.value ?? 0}</td>}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Sparkline({ series, color = CHART_CURRENT, width = 96, height = 32 }) {
  if (series.length < 2) return <div style={{ width, height }} aria-hidden="true" />;
  const max = Math.max(1, ...series.map((p) => p.value));
  const pts = series.map((p, i) => [(i / (series.length - 1)) * (width - 4) + 2, height - 3 - (p.value / max) * (height - 6)]);
  return (
    <svg width={width} height={height} aria-hidden="true" className="shrink-0">
      <path d={pts.map(([px, py], i) => `${i === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)}`).join(" ")} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function Donut({ items, size = 148, thickness = 22, centerLabel }) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={items.map((i) => `${i.name} ${i.value}`).join(", ")} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={thickness} />
      {total > 0 && items.map((item) => {
        const length = (item.value / total) * circumference;
        const circle = (
          <circle
            key={item.name}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={item.color}
            strokeWidth={thickness}
            strokeDasharray={`${Math.max(0, length - 2)} ${circumference - Math.max(0, length - 2)}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        );
        offset += length;
        return circle;
      })}
      <text x="50%" y="48%" textAnchor="middle" fontSize="22" fontWeight="650" fill="#0f172a">{formatNumber(total)}</text>
      <text x="50%" y="62%" textAnchor="middle" fontSize="11" fill="#64748b">{centerLabel}</text>
    </svg>
  );
}
