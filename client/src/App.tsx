import { useState } from 'react'
import { ProductDetail } from './components/ProductDetail'
import { ProductCard } from './components/ProductCard'
import { products } from './data/products'
import type { CartItem, Product, ShoeSize } from './types/shop'
import './App.css'

function App() {
  const [selectedProductId, setSelectedProductId] = useState<Product['id'] | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const selectedProduct = products.find((p) => p.id === selectedProductId)

  function addToCart(product: Product, size: ShoeSize) {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.productId === product.id && item.selectedSize === size,
      )
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id && item.selectedSize === size
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }
      return [
        ...prev,
        {
          id: `${product.id}-${size}`,
          productId: product.id,
          name: product.name,
          brand: product.brand,
          imageUrl: product.imageUrl,
          selectedSize: size,
          quantity: 1,
          price: product.price,
        },
      ]
    })
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  if (selectedProduct) {
    return (
      <main className="shop-page">
        <ProductDetail
          product={selectedProduct}
          onBack={() => setSelectedProductId(null)}
          onAddToCart={addToCart}
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
          <div className="product-section__header-right">
            <span>{products.length} products</span>
            <button type="button" className="cart-toggle">
              Cart {totalItems > 0 && <span className="cart-toggle__count">{totalItems}</span>}
            </button>
          </div>
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
