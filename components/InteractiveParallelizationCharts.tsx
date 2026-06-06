"use client";

import { useId, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";

type SeriesKey = "accuracy" | "tokens";

type ChartPoint = {
  label: string;
  x: number;
  accuracy: number;
  tokens: number;
};

type AxisConfig = {
  min: number;
  max: number;
  ticks: number[];
  label: string;
  format: (value: number) => string;
};

type ChartConfig = {
  title: string;
  xLabel: string;
  xAxis: AxisConfig;
  accuracyAxis: AxisConfig;
  tokensAxis: AxisConfig;
  points: ChartPoint[];
  caption: ReactNode;
};

const accuracyColor = "#5cc96f";
const tokensColor = "#2b6fa8";
const gridColor = "#e6e3de";
const axisColor = "#817d75";

const thresholdChart: ChartConfig = {
  title: "MATH-500: Accuracy vs. Decoding Threshold",
  xLabel: "Threshold",
  xAxis: {
    min: 0.8,
    max: 1,
    ticks: [0.8, 0.85, 0.9, 0.95, 1],
    label: "Threshold",
    format: (value) => value.toFixed(2),
  },
  accuracyAxis: {
    min: 66,
    max: 75,
    ticks: [66, 67, 68, 69, 70, 71, 72, 73, 74, 75],
    label: "MATH-500 Accuracy",
    format: (value) => value.toFixed(0),
  },
  tokensAxis: {
    min: 0.8,
    max: 2.2,
    ticks: [0.8, 1, 1.2, 1.4, 1.6, 1.8, 2, 2.2],
    label: "Tokens / Step",
    format: (value) => value.toFixed(2),
  },
  points: [
    { label: "0.80", x: 0.8, accuracy: 69.2, tokens: 2.12 },
    { label: "0.85", x: 0.85, accuracy: 69.4, tokens: 2.04 },
    { label: "0.90", x: 0.9, accuracy: 71.6, tokens: 1.91 },
    { label: "0.95", x: 0.95, accuracy: 72.0, tokens: 1.8 },
    { label: "1.00", x: 1, accuracy: 72.8, tokens: 1.0 },
  ],
  caption: (
    <strong>
      Lowering the decoding threshold increases tokens per step with an accuracy trade-off.
    </strong>
  ),
};

const blockSizeChart: ChartConfig = {
  title: "MATH-500: Accuracy vs. Block Size at Threshold 0.90",
  xLabel: "Block Size",
  xAxis: {
    min: 4,
    max: 16,
    ticks: [4, 8, 16],
    label: "Block Size",
    format: (value) => value.toFixed(0),
  },
  accuracyAxis: {
    min: 35,
    max: 80,
    ticks: [35, 40, 45, 50, 55, 60, 65, 70, 75, 80],
    label: "MATH-500 Accuracy",
    format: (value) => value.toFixed(0),
  },
  tokensAxis: {
    min: 1.5,
    max: 4,
    ticks: [1.5, 2, 2.5, 3, 3.5, 4],
    label: "Tokens / Step",
    format: (value) => value.toFixed(2),
  },
  points: [
    { label: "4", x: 4, accuracy: 71.6, tokens: 1.91 },
    { label: "8", x: 8, accuracy: 61.4, tokens: 2.34 },
    { label: "16", x: 16, accuracy: 49.2, tokens: 3.59 },
  ],
  caption: (
    <strong>
      At fixed gamma=0.9, larger block sizes increase tokens per step while trading off accuracy.
    </strong>
  ),
};

const viewBox = { width: 720, height: 430 };
const margin = { top: 38, right: 82, bottom: 74, left: 78 };
const plot = {
  width: viewBox.width - margin.left - margin.right,
  height: viewBox.height - margin.top - margin.bottom,
};

function makePath(points: { x: number; y: number }[]) {
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function chartId(id: string) {
  return id.replace(/:/g, "");
}

function InteractiveChart({ chart }: { chart: ChartConfig }) {
  const reactId = useId();
  const titleId = chartId(`${reactId}-title`);
  const captionId = chartId(`${reactId}-caption`);
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [visible, setVisible] = useState<Record<SeriesKey, boolean>>({
    accuracy: true,
    tokens: true,
  });

  const scaleX = (value: number) =>
    margin.left + ((value - chart.xAxis.min) / (chart.xAxis.max - chart.xAxis.min)) * plot.width;

  const scaleY = (value: number, axis: AxisConfig) =>
    margin.top + (1 - (value - axis.min) / (axis.max - axis.min)) * plot.height;

  const plottedPoints = useMemo(
    () =>
      chart.points.map((point) => ({
        ...point,
        px: scaleX(point.x),
        accuracyY: scaleY(point.accuracy, chart.accuracyAxis),
        tokensY: scaleY(point.tokens, chart.tokensAxis),
      })),
    [chart],
  );

  const activePoint = activeIndex === null ? null : plottedPoints[activeIndex];
  const accuracyPath = makePath(plottedPoints.map((point) => ({ x: point.px, y: point.accuracyY })));
  const tokensPath = makePath(plottedPoints.map((point) => ({ x: point.px, y: point.tokensY })));

  function setNearestPoint(event: PointerEvent<SVGSVGElement>) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((event.clientX - rect.left) / rect.width) * viewBox.width;
    const y = ((event.clientY - rect.top) / rect.height) * viewBox.height;

    if (
      x < margin.left - 24 ||
      x > margin.left + plot.width + 24 ||
      y < margin.top - 24 ||
      y > margin.top + plot.height + 40
    ) {
      return;
    }

    const nearest = plottedPoints.reduce(
      (best, point, index) => {
        const distance = Math.abs(point.px - x);
        return distance < best.distance ? { distance, index } : best;
      },
      { distance: Number.POSITIVE_INFINITY, index: 0 },
    );

    setActiveIndex(nearest.index);
  }

  function toggleSeries(series: SeriesKey) {
    setVisible((current) => {
      const next = { ...current, [series]: !current[series] };
      return next.accuracy || next.tokens ? next : current;
    });
  }

  function onPointKeyDown(event: KeyboardEvent<SVGGElement>, index: number) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setActiveIndex(index);
    }
  }

  return (
    <figure
      className="rounded-lg border border-border bg-white/80 shadow-sm overflow-hidden"
      aria-describedby={captionId}
    >
      <div className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-sans text-base font-semibold leading-tight text-ink">
          {chart.title}
        </h3>
        <div className="flex flex-wrap gap-2" aria-label={`${chart.title} series`}>
          <button
            type="button"
            aria-pressed={visible.accuracy}
            onClick={() => toggleSeries("accuracy")}
            className={`inline-flex h-8 items-center gap-2 whitespace-nowrap rounded-md border px-3 text-sm font-medium transition ${
              visible.accuracy
                ? "border-accent-border bg-accent-light text-ink"
                : "border-border bg-paper text-muted"
            }`}
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accuracyColor }} />
            Accuracy
          </button>
          <button
            type="button"
            aria-pressed={visible.tokens}
            onClick={() => toggleSeries("tokens")}
            className={`inline-flex h-8 items-center gap-2 whitespace-nowrap rounded-md border px-3 text-sm font-medium transition ${
              visible.tokens
                ? "border-border bg-code-bg text-ink"
                : "border-border bg-paper text-muted"
            }`}
          >
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: tokensColor }} />
            Tokens / Step
          </button>
        </div>
      </div>

      <div className="px-2 pb-2 pt-3 sm:px-4">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
          className="block aspect-[1.67] w-full"
          role="img"
          aria-labelledby={titleId}
          onPointerMove={setNearestPoint}
          onPointerLeave={() => setActiveIndex(null)}
        >
          <title id={titleId}>{chart.title}</title>

          <rect
            x={margin.left}
            y={margin.top}
            width={plot.width}
            height={plot.height}
            rx="4"
            fill="#fffdfa"
          />

          {chart.accuracyAxis.ticks.map((tick) => {
            const y = scaleY(tick, chart.accuracyAxis);
            return (
              <g key={`accuracy-tick-${tick}`}>
                <line
                  x1={margin.left}
                  x2={margin.left + plot.width}
                  y1={y}
                  y2={y}
                  stroke={gridColor}
                  strokeDasharray="7 7"
                />
                <text
                  x={margin.left - 15}
                  y={y + 5}
                  textAnchor="end"
                  className="fill-muted font-sans text-[15px]"
                >
                  {chart.accuracyAxis.format(tick)}
                </text>
              </g>
            );
          })}

          {chart.xAxis.ticks.map((tick) => {
            const x = scaleX(tick);
            return (
              <g key={`x-tick-${tick}`}>
                <line
                  x1={x}
                  x2={x}
                  y1={margin.top}
                  y2={margin.top + plot.height}
                  stroke={gridColor}
                  strokeDasharray="7 7"
                />
                <text
                  x={x}
                  y={margin.top + plot.height + 35}
                  textAnchor="middle"
                  className="fill-ink font-sans text-[18px] font-medium"
                >
                  {chart.xAxis.format(tick)}
                </text>
              </g>
            );
          })}

          {chart.tokensAxis.ticks.map((tick) => {
            const y = scaleY(tick, chart.tokensAxis);
            return (
              <g key={`tokens-tick-${tick}`}>
                <line
                  x1={margin.left + plot.width}
                  x2={margin.left + plot.width + 7}
                  y1={y}
                  y2={y}
                  stroke={axisColor}
                  strokeWidth="1.5"
                />
                <text
                  x={margin.left + plot.width + 15}
                  y={y + 5}
                  textAnchor="start"
                  className="fill-muted font-sans text-[15px]"
                >
                  {chart.tokensAxis.format(tick)}
                </text>
              </g>
            );
          })}

          <line
            x1={margin.left}
            x2={margin.left}
            y1={margin.top}
            y2={margin.top + plot.height}
            stroke={axisColor}
            strokeWidth="2"
          />
          <line
            x1={margin.left}
            x2={margin.left + plot.width}
            y1={margin.top + plot.height}
            y2={margin.top + plot.height}
            stroke={axisColor}
            strokeWidth="2"
          />
          <line
            x1={margin.left + plot.width}
            x2={margin.left + plot.width}
            y1={margin.top}
            y2={margin.top + plot.height}
            stroke={axisColor}
            strokeWidth="2"
          />

          <text
            x={margin.left + plot.width / 2}
            y={viewBox.height - 18}
            textAnchor="middle"
            className="fill-ink font-sans text-[20px] font-semibold"
          >
            {chart.xLabel}
          </text>
          <text
            transform={`translate(26 ${margin.top + plot.height / 2}) rotate(-90)`}
            textAnchor="middle"
            className="fill-ink font-sans text-[19px] font-semibold"
          >
            {chart.accuracyAxis.label}
          </text>
          <text
            transform={`translate(${viewBox.width - 10} ${margin.top + plot.height / 2}) rotate(-90)`}
            textAnchor="middle"
            className="fill-ink font-sans text-[19px] font-semibold"
          >
            {chart.tokensAxis.label}
          </text>

          {activePoint && (
            <line
              x1={activePoint.px}
              x2={activePoint.px}
              y1={margin.top}
              y2={margin.top + plot.height}
              stroke="#bdb7ad"
              strokeWidth="1.5"
              strokeDasharray="4 5"
            />
          )}

          {visible.accuracy && (
            <path
              d={accuracyPath}
              fill="none"
              stroke={accuracyColor}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="5"
              className="drop-shadow-sm"
            />
          )}
          {visible.tokens && (
            <path
              d={tokensPath}
              fill="none"
              stroke={tokensColor}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="5"
              className="drop-shadow-sm"
            />
          )}

          {plottedPoints.map((point, index) => {
            const isActive = index === activeIndex;
            return (
              <g
                key={point.label}
                tabIndex={0}
                role="button"
                aria-label={`${chart.xAxis.label} ${point.label}. Accuracy ${point.accuracy.toFixed(
                  1,
                )}. Tokens per step ${point.tokens.toFixed(2)}.`}
                onFocus={() => setActiveIndex(index)}
                onKeyDown={(event) => onPointKeyDown(event, index)}
                className="outline-none"
              >
                <rect
                  x={point.px - 24}
                  y={margin.top}
                  width="48"
                  height={plot.height}
                  fill="transparent"
                  onPointerEnter={() => setActiveIndex(index)}
                />
                {visible.accuracy && (
                  <>
                    <circle
                      cx={point.px}
                      cy={point.accuracyY}
                      r={isActive ? 14 : 9}
                      fill={accuracyColor}
                      opacity={isActive ? 0.18 : 0}
                    />
                    <circle
                      cx={point.px}
                      cy={point.accuracyY}
                      r={isActive ? 7.5 : 6.5}
                      fill={accuracyColor}
                      stroke="#fffdfa"
                      strokeWidth="2"
                    />
                  </>
                )}
                {visible.tokens && (
                  <>
                    <rect
                      x={point.px - (isActive ? 11 : 8)}
                      y={point.tokensY - (isActive ? 11 : 8)}
                      width={isActive ? 22 : 16}
                      height={isActive ? 22 : 16}
                      rx="3"
                      fill={tokensColor}
                      opacity={isActive ? 0.18 : 0}
                    />
                    <rect
                      x={point.px - (isActive ? 7.5 : 6.5)}
                      y={point.tokensY - (isActive ? 7.5 : 6.5)}
                      width={isActive ? 15 : 13}
                      height={isActive ? 15 : 13}
                      rx="2"
                      fill={tokensColor}
                      stroke="#fffdfa"
                      strokeWidth="2"
                    />
                  </>
                )}
              </g>
            );
          })}

          {activePoint && (
            <Tooltip
              x={activePoint.px}
              y={Math.min(activePoint.accuracyY, activePoint.tokensY)}
              label={`${chart.xAxis.label}: ${activePoint.label}`}
              accuracy={activePoint.accuracy}
              tokens={activePoint.tokens}
            />
          )}
        </svg>

        <table className="sr-only">
          <caption>{chart.title}</caption>
          <thead>
            <tr>
              <th>{chart.xAxis.label}</th>
              <th>Accuracy</th>
              <th>Tokens per step</th>
            </tr>
          </thead>
          <tbody>
            {chart.points.map((point) => (
              <tr key={point.label}>
                <td>{point.label}</td>
                <td>{point.accuracy.toFixed(1)}</td>
                <td>{point.tokens.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <figcaption
        id={captionId}
        className="border-t border-border px-4 py-3 text-center font-sans text-sm font-semibold leading-snug text-muted"
      >
        {chart.caption}
      </figcaption>
    </figure>
  );
}

function Tooltip({
  x,
  y,
  label,
  accuracy,
  tokens,
}: {
  x: number;
  y: number;
  label: string;
  accuracy: number;
  tokens: number;
}) {
  const width = 174;
  const height = 82;
  const boxX = clamp(x + 18, margin.left + 8, margin.left + plot.width - width - 8);
  const boxY = clamp(y - height - 18, margin.top + 8, margin.top + plot.height - height - 8);

  return (
    <g pointerEvents="none" transform={`translate(${boxX} ${boxY})`}>
      <rect
        width={width}
        height={height}
        rx="8"
        fill="#1f1f1d"
        opacity="0.94"
      />
      <text x="14" y="24" className="fill-white font-sans text-[13px] font-semibold">
        {label}
      </text>
      <circle cx="18" cy="45" r="5" fill={accuracyColor} />
      <text x="31" y="49" className="fill-white font-sans text-[13px]">
        Accuracy {accuracy.toFixed(1)}
      </text>
      <rect x="13" y="62" width="10" height="10" rx="2" fill={tokensColor} />
      <text x="31" y="72" className="fill-white font-sans text-[13px]">
        Tokens / Step {tokens.toFixed(2)}
      </text>
    </g>
  );
}

export default function InteractiveParallelizationCharts() {
  return (
    <div className="mx-auto mt-6 grid w-full max-w-[720px] gap-5">
      <InteractiveChart chart={thresholdChart} />
      <InteractiveChart chart={blockSizeChart} />
    </div>
  );
}
