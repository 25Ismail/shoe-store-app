import type { FitFeedbackEntry } from '../types/shop'

type Props = {
  fitFeedback: Record<string, FitFeedbackEntry>
}

type Stats = {
  tooSmall: number
  trueToSize: number
  tooLarge: number
  total: number
}

function aggregate(fitFeedback: Record<string, FitFeedbackEntry>): Stats {
  let tooSmall = 0, trueToSize = 0, tooLarge = 0
  for (const entry of Object.values(fitFeedback)) {
    tooSmall += entry.tooSmall
    trueToSize += entry.trueToSize
    tooLarge += entry.tooLarge
  }
  return { tooSmall, trueToSize, tooLarge, total: tooSmall + trueToSize + tooLarge }
}

function pct(value: number, total: number): number {
  return total === 0 ? 0 : Math.round((value / total) * 100)
}

function recommendation(stats: Stats): string {
  const { tooSmall, trueToSize, tooLarge, total } = stats
  if (total === 0) return ''
  if (trueToSize / total >= 0.6) return 'Most buyers find this shoe true to size.'
  if (tooSmall / total >= 0.5) return 'Most buyers find this shoe runs small — consider sizing up.'
  if (tooLarge / total >= 0.5) return 'Most buyers find this shoe runs large — consider sizing down.'
  return 'Fit varies — check the size guide below.'
}

export function FitRecommendation({ fitFeedback }: Props) {
  const stats = aggregate(fitFeedback)

  if (stats.total === 0) return null

  const rows: { label: string; value: number }[] = [
    { label: 'Too small', value: pct(stats.tooSmall, stats.total) },
    { label: 'True to size', value: pct(stats.trueToSize, stats.total) },
    { label: 'Too large', value: pct(stats.tooLarge, stats.total) },
  ]

  return (
    <div className="fit-recommendation">
      <p className="fit-recommendation__summary">
        Based on {stats.total} buyers — {recommendation(stats)}
      </p>
      <div className="fit-recommendation__bars">
        {rows.map(({ label, value }) => (
          <div key={label} className="fit-recommendation__bar-row">
            <span className="fit-recommendation__bar-label">{label}</span>
            <div className="fit-recommendation__bar-track">
              <div
                className="fit-recommendation__bar-fill"
                style={{ width: `${value}%` }}
                aria-label={`${value}%`}
              />
            </div>
            <span className="fit-recommendation__bar-pct">{value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
