import type { Product } from '../types/shop'

type ProductDetailProps = {
  product: Product
  onBack: () => void
}

const priceFormatter = new Intl.NumberFormat('sv-SE', {
  style: 'currency',
  currency: 'SEK',
  maximumFractionDigits: 0,
})

export function ProductDetail({ product, onBack }: ProductDetailProps) {
  return (
    <section className="product-detail" aria-labelledby="product-detail-title">
      <button type="button" className="product-detail__back" onClick={onBack}>
        Back to shoes
      </button>

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

                return (
                  <span key={size} aria-disabled={isSoldOut}>
                    {size}
                  </span>
                )
              })}
            </div>
          </div>

          <div className="product-detail__panel">
            <h2>Fit information</h2>
            <strong>{product.fit.label}</strong>
            <p>{product.fit.advice}</p>
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
