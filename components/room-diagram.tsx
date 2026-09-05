'use client'

import { useEstimate } from '@/components/estimate-context'
import { formatNum } from '@/lib/estimate'

/**
 * Plan-view room drawing in the style of an architectural blueprint.
 * Scales with the live width/length values and renders dimension lines,
 * a hatched wall thickness, a door swing and a window.
 */
export function RoomDiagram() {
  const { input, result } = useEstimate()
  const { width, length } = input

  // Drawing space
  const VB_W = 560
  const VB_H = 440
  const PAD_L = 70
  const PAD_R = 90
  const PAD_T = 70
  const PAD_B = 60

  const availW = VB_W - PAD_L - PAD_R
  const availH = VB_H - PAD_T - PAD_B
  const scale = Math.min(availW / width, availH / length)

  const rw = width * scale
  const rh = length * scale
  const x0 = PAD_L + (availW - rw) / 2
  const y0 = PAD_T + (availH - rh) / 2
  const x1 = x0 + rw
  const y1 = y0 + rh

  const wall = 10 // wall thickness in drawing units

  // Door on bottom wall, 0.9 m wide, near left corner
  const doorW = Math.min(0.9 * scale, rw * 0.4)
  const doorX = x0 + Math.min(0.5 * scale, rw * 0.15)

  // Window on top wall, 1.5 m, centered
  const winW = Math.min(1.5 * scale, rw * 0.6)
  const winX = x0 + (rw - winW) / 2

  const dimTop = y0 - wall - 32
  const dimRight = x1 + wall + 36

  return (
    <figure className="relative w-full">
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Xona plani: ${formatNum(width)} metrga ${formatNum(length)} metr, maydoni ${formatNum(result.floorArea, 2)} kvadrat metr`}
      >
        <defs>
          <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" strokeWidth="1" opacity="0.45" />
          </pattern>
          <marker id="tick" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <line x1="1" y1="5" x2="5" y2="1" stroke="currentColor" strokeWidth="1" />
          </marker>
        </defs>

        <g className="text-foreground">
          {/* Wall band with hatch */}
          <rect
            x={x0 - wall}
            y={y0 - wall}
            width={rw + wall * 2}
            height={rh + wall * 2}
            fill="url(#hatch)"
            stroke="currentColor"
            strokeWidth="1.5"
            className="draw"
            pathLength={1}
          />
          {/* Interior floor */}
          <rect x={x0} y={y0} width={rw} height={rh} className="fill-background" stroke="currentColor" strokeWidth="1.5" />

          {/* Floor tile grid (60 cm) */}
          <g stroke="currentColor" strokeWidth="0.5" opacity="0.18">
            {Array.from({ length: Math.floor(width / 0.6) }).map((_, i) => {
              const x = x0 + (i + 1) * 0.6 * scale
              return <line key={`v${i}`} x1={x} y1={y0} x2={x} y2={y1} />
            })}
            {Array.from({ length: Math.floor(length / 0.6) }).map((_, i) => {
              const y = y0 + (i + 1) * 0.6 * scale
              return <line key={`h${i}`} x1={x0} y1={y} x2={x1} y2={y} />
            })}
          </g>

          {/* Window (top wall) */}
          <rect x={winX} y={y0 - wall} width={winW} height={wall} className="fill-background" stroke="currentColor" strokeWidth="1.2" />
          <line x1={winX} y1={y0 - wall / 2} x2={winX + winW} y2={y0 - wall / 2} stroke="currentColor" strokeWidth="1" />
          <line x1={winX} y1={y0 - wall / 2 - 2.5} x2={winX + winW} y2={y0 - wall / 2 - 2.5} stroke="currentColor" strokeWidth="0.6" />
          <line x1={winX} y1={y0 - wall / 2 + 2.5} x2={winX + winW} y2={y0 - wall / 2 + 2.5} stroke="currentColor" strokeWidth="0.6" />

          {/* Door (bottom wall): opening + leaf + swing arc */}
          <rect x={doorX} y={y1} width={doorW} height={wall} className="fill-background" />
          <line x1={doorX} y1={y1} x2={doorX} y2={y1 - doorW} stroke="currentColor" strokeWidth="1.5" />
          <path
            d={`M ${doorX} ${y1 - doorW} A ${doorW} ${doorW} 0 0 1 ${doorX + doorW} ${y1}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeDasharray="3 3"
          />

          {/* Room label in the center */}
          <g className="font-heading">
            <text
              x={x0 + rw / 2}
              y={y0 + rh / 2 - 4}
              textAnchor="middle"
              fontSize="13"
              fontWeight="600"
              fill="currentColor"
            >
              Yotoqxona
            </text>
            <text
              x={x0 + rw / 2}
              y={y0 + rh / 2 + 14}
              textAnchor="middle"
              fontSize="12"
              className="fill-muted-foreground tabular"
            >
              {formatNum(result.floorArea, 2)} m²
            </text>
          </g>

          {/* Top dimension line: width */}
          <g strokeWidth="1" stroke="currentColor">
            <line x1={x0 - wall} y1={dimTop + 8} x2={x0 - wall} y2={y0 - wall - 4} opacity="0.5" />
            <line x1={x1 + wall} y1={dimTop + 8} x2={x1 + wall} y2={y0 - wall - 4} opacity="0.5" />
            <line x1={x0 - wall} y1={dimTop} x2={x1 + wall} y2={dimTop} markerStart="url(#tick)" markerEnd="url(#tick)" />
          </g>
          <text
            x={(x0 + x1) / 2}
            y={dimTop - 6}
            textAnchor="middle"
            fontSize="13"
            fontWeight="600"
            className="font-heading tabular"
            fill="currentColor"
          >
            {formatNum(width, 2)} m
          </text>

          {/* Right dimension line: length */}
          <g strokeWidth="1" stroke="currentColor">
            <line x1={x1 + wall + 4} y1={y0 - wall} x2={dimRight - 8} y2={y0 - wall} opacity="0.5" />
            <line x1={x1 + wall + 4} y1={y1 + wall} x2={dimRight - 8} y2={y1 + wall} opacity="0.5" />
            <line x1={dimRight} y1={y0 - wall} x2={dimRight} y2={y1 + wall} markerStart="url(#tick)" markerEnd="url(#tick)" />
          </g>
          <text
            x={dimRight + 8}
            y={(y0 + y1) / 2}
            fontSize="13"
            fontWeight="600"
            className="font-heading tabular"
            fill="currentColor"
            transform={`rotate(90 ${dimRight + 8} ${(y0 + y1) / 2})`}
            textAnchor="middle"
          >
            {formatNum(length, 2)} m
          </text>

          {/* Left: door width callout */}
          <g strokeWidth="0.8" stroke="currentColor" opacity="0.7">
            <line x1={doorX} y1={y1 + wall + 6} x2={doorX} y2={y1 + wall + 18} />
            <line x1={doorX + doorW} y1={y1 + wall + 6} x2={doorX + doorW} y2={y1 + wall + 18} />
            <line x1={doorX} y1={y1 + wall + 14} x2={doorX + doorW} y2={y1 + wall + 14} markerStart="url(#tick)" markerEnd="url(#tick)" />
          </g>
          <text
            x={doorX + doorW / 2}
            y={y1 + wall + 30}
            textAnchor="middle"
            fontSize="10"
            className="fill-muted-foreground tabular"
          >
            0.90
          </text>

          {/* Window callout */}
          <text
            x={winX + winW / 2}
            y={y0 - wall - 8}
            textAnchor="middle"
            fontSize="10"
            className="fill-muted-foreground tabular"
          >
            1.50
          </text>

          {/* Height annotation (left) */}
          <g transform={`translate(${x0 - wall - 30} ${(y0 + y1) / 2})`}>
            <text
              textAnchor="middle"
              fontSize="10"
              className="fill-muted-foreground tabular"
              transform="rotate(-90)"
            >
              h = {formatNum(input.height, 2)} m
            </text>
          </g>

          {/* North arrow */}
          <g transform={`translate(${VB_W - 34} ${VB_H - 46})`} stroke="currentColor" fill="none" strokeWidth="1">
            <circle r="12" />
            <path d="M 0 -9 L 4 4 L 0 1 L -4 4 Z" fill="currentColor" />
            <text y="24" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none">
              Sh
            </text>
          </g>

          {/* Scale bar */}
          <g transform={`translate(${PAD_L - 40} ${VB_H - 24})`} stroke="currentColor">
            <line x1="0" y1="0" x2={scale} y2="0" strokeWidth="1.5" />
            <line x1="0" y1="-3" x2="0" y2="3" strokeWidth="1" />
            <line x1={scale} y1="-3" x2={scale} y2="3" strokeWidth="1" />
            <text x={scale / 2} y="12" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" className="tabular">
              1 m
            </text>
          </g>
        </g>
      </svg>

      {/* Title block, like the corner of a drawing sheet */}
      <figcaption className="mt-2 flex border-t border-foreground pt-2 text-[11px] leading-none">
        <span className="flex items-baseline gap-2 border-r border-border pr-3">
          <span className="text-muted-foreground">Chizma</span>
          <span className="font-heading font-semibold tabular">A-01</span>
        </span>
        <span className="flex items-baseline gap-2 border-r border-border px-3">
          <span className="text-muted-foreground">Masshtab</span>
          <span className="font-heading font-semibold tabular">1:50</span>
        </span>
        <span className="flex items-baseline gap-2 px-3">
          <span className="text-muted-foreground">Qavat</span>
          <span className="font-heading font-semibold tabular">03</span>
        </span>
      </figcaption>
    </figure>
  )
}
