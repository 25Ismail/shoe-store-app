import { useState } from 'react'
import type { CartItem } from '../types/shop'
import { createOrder } from '../api/orders'

type CartPanelProps = {
  items: CartItem[]
  isLoggedIn: boolean
  onClose: () => void
  onRemove: (itemId: CartItem['id']) => void
  onOrderSuccess: (orderId: string) => void
  onSignInRequest: () => void
}

const priceFormatter = new Intl.NumberFormat('sv-SE', {
  style: 'currency',
  currency: 'SEK',
  maximumFractionDigits: 0,
})

export function CartPanel({ items, isLoggedIn, onClose, onRemove, onOrderSuccess, onSignInRequest }: CartPanelProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  async function handleCheckout() {
    if (!isLoggedIn) {
      onSignInRequest()
      return
    }
    setError(null)
    setLoading(true)
    try {
      const { _id } = await createOrder(items)
      onOrderSuccess(_id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Något gick fel')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="cart-overlay" onClick={onClose} aria-hidden="true" />

      <aside className="cart-panel" aria-label="Shopping cart">
        <div className="cart-panel__header">
          <h2>Cart</h2>
          <button type="button" className="cart-panel__close" onClick={onClose} aria-label="Close cart">
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <p className="cart-panel__empty">Your cart is empty.</p>
        ) : (
          <>
            <ul className="cart-panel__items">
              {items.map((item) => (
                <li key={item.id} className="cart-item">
                  <div className="cart-item__visual" aria-hidden="true">
                    {item.brand.slice(0, 1)}
                  </div>

                  <div className="cart-item__info">
                    <p className="cart-item__brand">{item.brand}</p>
                    <p className="cart-item__name">{item.name}</p>
                    <p className="cart-item__meta">
                      Size {item.selectedSize} &middot; Qty {item.quantity}
                    </p>
                  </div>

                  <div className="cart-item__right">
                    <p className="cart-item__price">
                      {priceFormatter.format(item.price * item.quantity)}
                    </p>
                    <button
                      type="button"
                      className="cart-item__remove"
                      onClick={() => onRemove(item.id)}
                      aria-label={`Remove ${item.name} size ${item.selectedSize}`}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="cart-panel__footer">
              <div className="cart-panel__total">
                <span>Total</span>
                <span>{priceFormatter.format(total)}</span>
              </div>
              {!isLoggedIn && (
                <p className="cart-panel__signin-note">Sign in to complete your purchase.</p>
              )}
              {error && <p className="cart-panel__error">{error}</p>}
              <button
                type="button"
                className="cart-panel__checkout"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? 'Processing…' : isLoggedIn ? 'Go to checkout' : 'Sign in to checkout'}
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
