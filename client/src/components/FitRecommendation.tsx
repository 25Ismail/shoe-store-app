import type { FitFeedbackEntry } from '../types/shop'
import type { FitVote } from '../api/orders'

type PastPurchase = {
  selectedSize: number
  fitVote?: FitVote
}

type HistoryItem = {
  productId?: string
  category?: string
  fitLabel?: string
  fitVote?: FitVote
  selectedSize?: number
}

type Props = {
  fitFeedback: Record<string, FitFeedbackEntry>
  pastPurchase?: PastPurchase
  orderHistory?: HistoryItem[]
  currentProductId?: string
  currentCategory?: string
  currentFitLabel?: string
  availableSizes?: number[]
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

function communityRecommendation(stats: Stats): string {
  const { tooSmall, trueToSize, tooLarge, total } = stats
  if (total === 0) return ''
  if (trueToSize / total >= 0.6) return 'Most buyers find this shoe true to size.'
  if (tooSmall / total >= 0.5) return 'Most buyers find this shoe runs small — consider sizing up.'
  if (tooLarge / total >= 0.5) return 'Most buyers find this shoe runs large — consider sizing down.'
  return 'Fit varies — check the size guide below.'
}

const voteLabels: Record<FitVote, string> = {
  tooSmall: 'too small',
  trueToSize: 'true to size',
  tooLarge: 'too large',
}

function crossShoeAdvice(
  history: HistoryItem[],
  currentProductId: string,
  currentCategory: string,
  currentFitLabel: string,
  availableSizes: number[],
): string {
  const relevant = history.filter(
    (item) =>
      item.productId !== currentProductId &&
      item.fitVote !== undefined &&
      item.selectedSize !== undefined &&
      (item.category === currentCategory || item.fitLabel === currentFitLabel),
  )
  if (relevant.length < 2) return ''

  const trueSizes = relevant.map((item) => {
    const base = item.selectedSize!
    if (item.fitVote === 'tooSmall') return base + 1
    if (item.fitVote === 'tooLarge') return base - 1
    return base
  })

  const avg = trueSizes.reduce((a, b) => a + b, 0) / trueSizes.length
  const suggested = availableSizes.reduce((closest, size) =>
    Math.abs(size - avg) < Math.abs(closest - avg) ? size : closest,
  )

  return `Based on your history with similar shoes, we suggest size ${suggested} for you.`
}

export function FitRecommendation({
  fitFeedback,
  pastPurchase,
  orderHistory,
  currentProductId,
  currentCategory,
  currentFitLabel,
  availableSizes,
}: Props) {
  const stats = aggregate(fitFeedback)

  const crossAdvice =
    orderHistory && currentProductId && currentCategory && currentFitLabel && availableSizes?.length
      ? crossShoeAdvice(orderHistory, currentProductId, currentCategory, currentFitLabel, availableSizes)
      : ''

  const rows: { label: string; value: number }[] = [
    { label: 'Too small', value: pct(stats.tooSmall, stats.total) },
    { label: 'True to size', value: pct(stats.trueToSize, stats.total) },
    { label: 'Too large', value: pct(stats.tooLarge, stats.total) },
  ]

  return (
    <div className="fit-recommendation">
      {pastPurchase && (
        <div className="fit-recommendation__personal">
          <strong>Your experience</strong>
          <p>
            You previously bought size {pastPurchase.selectedSize}
            {pastPurchase.fitVote
              ? ` and rated it ${voteLabels[pastPurchase.fitVote]}.`
              : ' — no fit rating yet.'}
          </p>
        </div>
      )}

      {crossAdvice && (
        <div className="fit-recommendation__personal">
          <strong>Based on your history</strong>
          <p>{crossAdvice}</p>
        </div>
      )}

      {stats.total > 0 && (
        <>
          <p className="fit-recommendation__summary">
            Based on {stats.total} buyers — {communityRecommendation(stats)}
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
        </>
      )}
    </div>
  )
}
