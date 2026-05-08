import { useState } from 'react'
import type { Product, ShoeSize } from '../types/shop'
import { FitRecommendation } from './FitRecommendation'
import type { MyOrder } from '../api/orders'

type PastPurchase = Pick<MyOrder['items'][number], 'selectedSize' | 'fitVote'>

type ProductDetailProps = {
  product: Product
  onAddToCart: (product: Product, size: ShoeSize) => void
  pastPurchase?: PastPurchase
}

const priceFormatter = new Intl.NumberFormat('sv-SE', {
  style: 'currency',
  currency: 'SEK',
  maximumFractionDigits: 0,
})

export function ProductDetail({ product, onAddToCart, pastPurchase }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState<ShoeSize | null>(null)

  function handleAddToCart() {
    if (selectedSize === null) return
    onAddToCart(product, selectedSize)
  }

  return (
    <section className="product-detail" aria-labelledby="product-detail-title">
      <div className="product-detail__layout">
        <div className="product-detail__visual" aria-hidden="true">
          <span>{product.brand.slice(0, 1)}</span>
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
            <div
              className="product-detail__sizes"
              aria-label={`Available sizes for ${product.name}`}
            >
              {product.availableSizes.map((size) => {
                const stock = product.stockBySize?.[size]
                const isSoldOut = stock === 0
                const isSelected = selectedSize === size

                return (
                  <button
                    key={size}
                    type="button"
                    disabled={isSoldOut}
                    aria-pressed={isSelected}
                    className={isSelected ? 'is-selected' : undefined}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                )
              })}
            </div>

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
