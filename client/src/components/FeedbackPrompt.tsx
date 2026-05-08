import { useState } from 'react'
import { submitFitFeedback, type FitVote } from '../api/orders'

type FeedbackItem = {
  productId: string
  name: string
  brand: string
  selectedSize: number
  orderId: string
}

type Props = {
  items: FeedbackItem[]
  onDone: () => void
}

const votes: { value: FitVote; label: string }[] = [
  { value: 'tooSmall', label: 'Too small' },
  { value: 'trueToSize', label: 'True to size' },
  { value: 'tooLarge', label: 'Too large' },
]

export function FeedbackPrompt({ items, onDone }: Props) {
  const [index, setIndex] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const item = items[index]
  if (!item) return null

  async function handleVote(vote: FitVote) {
    setSubmitting(true)
    await submitFitFeedback(item.productId, item.selectedSize, vote, item.orderId)
    advance()
    setSubmitting(false)
  }

  function advance() {
    if (index + 1 >= items.length) onDone()
    else setIndex((i) => i + 1)
  }

  return (
    <>
      <div className="auth-overlay" onClick={onDone} />
      <div className="feedback-prompt" role="dialog" aria-modal="true">
        <p className="feedback-prompt__step">
          {index + 1} / {items.length}
        </p>
        <h2>How did {item.name} (size {item.selectedSize}) fit?</h2>
        <p className="feedback-prompt__sub">Your answer helps other shoppers find the right size.</p>
        <div className="feedback-prompt__votes">
          {votes.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className="feedback-prompt__vote-btn"
              onClick={() => handleVote(value)}
              disabled={submitting}
            >
              {label}
            </button>
          ))}
        </div>
        <button type="button" className="feedback-prompt__skip" onClick={advance} disabled={submitting}>
          Skip
        </button>
      </div>
    </>
  )
}
