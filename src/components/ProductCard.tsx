import type { Product } from '../types/shop'

type ProductCardProps = {
  product: Product
}

const priceFormatter = new Intl.NumberFormat('sv-SE', {
  style: 'currency',
  currency: 'SEK',
  maximumFractionDigits: 0,
})

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      <div className="product-card__visual" aria-hidden="true">
        <span>{product.brand.slice(0, 1)}</span>
      </div>

      <div className="product-card__content">
        <div>
          <p className="product-card__brand">{product.brand}</p>
          <h2>{product.name}</h2>
        </div>

        <p className="product-card__description">{product.description}</p>

        <div className="product-card__fit">
          <strong>{product.fit.label}</strong>
          <span>{product.fit.advice}</span>
        </div>

        <div className="product-card__sizes" aria-label={`Sizes for ${product.name}`}>
          {product.availableSizes.map((size) => {
            const stock = product.stockBySize?.[size]
            const isSoldOut = stock === 0

            return (
              <button key={size} type="button" disabled={isSoldOut}>
                {size}
              </button>
            )
          })}
        </div>

        <div className="product-card__footer">
          <span>{product.category}</span>
          <strong>{priceFormatter.format(product.price)}</strong>
        </div>
      </div>
    </article>
  )
}
