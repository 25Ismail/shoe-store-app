import { useState } from 'react'
import type { Product, ShoeSize } from '../types/shop'
import { FitRecommendation } from './FitRecommendation'
import type { MyOrder } from '../api/orders'

type PastPurchase = Pick<MyOrder['items'][number], 'selectedSize' | 'fitVote'>
type OrderHistoryItem = Pick<MyOrder['items'][number], 'productId' | 'category' | 'fitLabel' | 'fitVote' | 'selectedSize'>

type ProductDetailProps = {
  product: Product
  onAddToCart: (product: Product, size: ShoeSize) => void
  pastPurchase?: PastPurchase
  orderHistory?: OrderHistoryItem[]
}

const priceFormatter = new Intl.NumberFormat('sv-SE', {
  style: 'currency',
  currency: 'SEK',
  maximumFractionDigits: 0,
})

function getSuggestedSize(
  history: OrderHistoryItem[],
  product: Product,
): number | null {
  // Only look at other shoes with the same category or fit label, and only if the user rated them
  const relevant = history.filter(
    (item) =>
      item.productId !== product.id &&
      item.fitVote !== undefined &&
      item.selectedSize !== undefined &&
      (item.category === product.category || item.fitLabel === product.fit.label),
  )
  if (relevant.length < 2) return null

  // Shift the size up by 1 if they said too small, down by 1 if too large, otherwise keep as-is
  const avg =
    relevant.reduce((sum, item) => {
      const base = item.selectedSize!
      if (item.fitVote === 'tooSmall') return sum + base + 1
      if (item.fitVote === 'tooLarge') return sum + base - 1
      return sum + base
    }, 0) / relevant.length

  // Pick the available size closest to the calculated average
  return product.availableSizes.reduce((closest, size) =>
    Math.abs(size - avg) < Math.abs(closest - avg) ? size : closest,
  )
}

export function ProductDetail({ product, onAddToCart, pastPurchase, orderHistory }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState<ShoeSize | null>(null)

  const suggestedSize = orderHistory ? getSuggestedSize(orderHistory, product) : null

  const fitReminder = selectedSize !== null ? product.fit.advice : null

  function handleAddToCart() {
    if (selectedSize === null) return
    onAddToCart(product, selectedSize)
  }

  return (
    <section className="product-detail" aria-labelledby="product-detail-title">
      <div className="product-detail__layout">
        <div className="product-detail__visual">
          <img src={product.imageUrl} alt={product.name} />
        </div>

        <div className="product-detail__content">
          <p className="product-detail__brand">{product.brand}</p>
          <h1 id="product-detail-title">{product.name}</h1>
          <p className="product-detail__price">
            {priceFormatter.format(product.price)}
          </p>
          <p>{product.description}</p>

          <div className="product-detail__panel">
            <h2>Available sizes</h2>
            {suggestedSize && (
              <p className="product-detail__size-hint">
                Based on your purchase history with similar shoes, we suggest size {suggestedSize}.
                {selectedSize && selectedSize !== suggestedSize
                  ? ` You picked ${selectedSize} — consider sizing to ${suggestedSize} instead.`
                  : ' Choose one size larger than your usual size.'}
              </p>
            )}
            <div
              className="product-detail__sizes"
              aria-label={`Available sizes for ${product.name}`}
            >
              {product.availableSizes.map((size) => {
                const stock = product.stockBySize?.[size]
                const isSoldOut = stock === 0
                const isSelected = selectedSize === size

                const isSuggested = suggestedSize === size

                return (
                  <button
                    key={size}
                    type="button"
                    disabled={isSoldOut}
                    aria-pressed={isSelected}
                    className={[
                      isSelected ? 'is-selected' : undefined,
                      isSuggested && !isSelected ? 'is-suggested' : undefined,
                    ].filter(Boolean).join(' ') || undefined}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                )
              })}
            </div>

            {fitReminder && (
              <p className="product-detail__size-hint">{fitReminder}</p>
            )}

            <button
              type="button"
              className="product-detail__add-to-cart"
              disabled={selectedSize === null}
              onClick={handleAddToCart}
            >
              {selectedSize === null ? 'Select a size' : 'Add to cart'}
            </button>
          </div>

          <div className="product-detail__panel">
            <h2>Fit information</h2>
            <strong>{product.fit.label}</strong>
            <p>{product.fit.advice}</p>
            {product.fitFeedback && (
              <FitRecommendation
                fitFeedback={product.fitFeedback}
                pastPurchase={pastPurchase}
                suggestedSize={suggestedSize ?? undefined}
              />
            )}
          </div>

          <div className="product-detail__panel">
            <h2>Size guide</h2>
            <table>
              <thead>
                <tr>
                  <th>EU</th>
                  <th>UK</th>
                  <th>US</th>
                  <th>Foot length</th>
                </tr>
              </thead>
              <tbody>
                {product.sizeGuide.map((row) => (
                  <tr key={row.eu}>
                    <td>{row.eu}</td>
                    <td>{row.uk}</td>
                    <td>{row.us}</td>
                    <td>{row.footLengthCm} cm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
