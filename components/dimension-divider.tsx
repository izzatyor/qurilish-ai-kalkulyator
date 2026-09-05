interface DimensionDividerProps {
  /** Label shown in the middle of the dimension line, e.g. a section index or measurement */
  label: string
  /** Optional secondary text on the right end */
  note?: string
  tone?: 'light' | 'dark'
}

/**
 * Section divider styled as an architectural dimension line:
 * tick marks at both ends, a thin line, and a measurement label breaking the line.
 */
export function DimensionDivider({ label, note, tone = 'light' }: DimensionDividerProps) {
  const line = tone === 'dark' ? 'bg-primary-foreground/40' : 'bg-border'
  const text = tone === 'dark' ? 'text-primary-foreground/70' : 'text-muted-foreground'
  const tick = tone === 'dark' ? 'bg-primary-foreground/70' : 'bg-foreground'

  return (
    <div className="mx-auto w-full max-w-6xl px-6" aria-hidden="true">
      <div className="flex items-center gap-3">
        <span className={`h-3 w-px ${tick}`} />
        <span className={`h-px flex-1 ${line}`} />
        <span className={`font-heading tabular text-xs tracking-wide ${text}`}>{label}</span>
        <span className={`h-px flex-1 ${line}`} />
        {note ? (
          <>
            <span className={`text-xs ${text}`}>{note}</span>
            <span className={`h-px w-8 ${line}`} />
          </>
        ) : null}
        <span className={`h-3 w-px ${tick}`} />
      </div>
    </div>
  )
}
