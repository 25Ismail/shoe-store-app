import { useState } from 'react'
import { ProductDetail } from './components/ProductDetail'
import { ProductCard } from './components/ProductCard'
import { products } from './data/products'
import type { Product } from './types/shop'
import './App.css'

function App() {
  const [selectedProductId, setSelectedProductId] = useState<Product['id'] | null>(
    null,
  )

  const selectedProduct = products.find(
    (product) => product.id === selectedProductId,
  )

  if (selectedProduct) {
    return (
      <main className="shop-page">
        <ProductDetail
          product={selectedProduct}
          onBack={() => setSelectedProductId(null)}
        />
      </main>
    )
  }

  return (
    <main className="shop-page">
      <section className="shop-hero">
        <div>
          <p className="shop-hero__eyebrow">Shoe store</p>
          <h1>Find the right shoe size before adding to cart</h1>
        </div>
        <p>
          Browse shoes with clear size availability and fit guidance. Product
          data comes from typed mock data for now and can later move behind the
          Express API.
        </p>
      </section>

      <section className="product-section" aria-labelledby="product-list-title">
        <div className="product-section__header">
          <h2 id="product-list-title">Shoes</h2>
          <span>{products.length} products</span>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={setSelectedProductId}
            />
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
