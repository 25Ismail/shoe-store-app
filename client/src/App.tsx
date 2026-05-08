import { useState, useEffect } from 'react'
import { ProductDetail } from './components/ProductDetail'
import { ProductCard } from './components/ProductCard'
import { CartPanel } from './components/CartPanel'
import { AuthForm } from './components/AuthForm'
import { FeedbackPrompt } from './components/FeedbackPrompt'
import { fetchProducts } from './api/products'
import type { CartItem, Product, ShoeSize } from './types/shop'
import './App.css'

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [productsError, setProductsError] = useState<string | null>(null)
  const [selectedProductId, setSelectedProductId] = useState<Product['id'] | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(
    () => localStorage.getItem('userEmail'),
  )
  const [feedbackItems, setFeedbackItems] = useState<
    { productId: string; name: string; brand: string; selectedSize: number; orderId: string }[]
  >([])

  function handleAuthSuccess(token: string, email: string) {
    localStorage.setItem('token', token)
    localStorage.setItem('userEmail', email)
    setUserEmail(email)
    setAuthOpen(false)
  }

  function handleSignOut() {
    localStorage.removeItem('token')
    localStorage.removeItem('userEmail')
    setUserEmail(null)
  }

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => setProductsError('Kunde inte ladda produkter. Kontrollera att servern körs.'))
      .finally(() => setProductsLoading(false))
  }, [])

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
    setCartOpen(true)
  }

  function removeFromCart(itemId: CartItem['id']) {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId))
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
    <>
      {cartOpen && (
        <CartPanel
          items={cartItems}
          isLoggedIn={userEmail !== null}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
          onOrderSuccess={(orderId) => {
            setFeedbackItems(cartItems.map((item) => ({
              productId: item.productId,
              name: item.name,
              brand: item.brand,
              selectedSize: item.selectedSize,
              orderId,
            })))
            setCartItems([])
            setCartOpen(false)
          }}
          onSignInRequest={() => { setCartOpen(false); setAuthOpen(true) }}
        />
      )}
      {authOpen && (
        <AuthForm onSuccess={handleAuthSuccess} onClose={() => setAuthOpen(false)} />
      )}
      {feedbackItems.length > 0 && (
        <FeedbackPrompt items={feedbackItems} onDone={() => setFeedbackItems([])} />
      )}
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
            {userEmail ? (
              <div className="auth-status">
                <span className="auth-status__email">{userEmail}</span>
                <button type="button" className="auth-status__signout" onClick={handleSignOut}>
                  Sign out
                </button>
              </div>
            ) : (
              <button type="button" className="auth-signin-btn" onClick={() => setAuthOpen(true)}>
                Sign in
              </button>
            )}
            <button type="button" className="cart-toggle" onClick={() => setCartOpen(true)}>
              Cart {totalItems > 0 && <span className="cart-toggle__count">{totalItems}</span>}
            </button>
          </div>
        </div>

        {productsLoading && <p>Laddar produkter…</p>}
        {productsError && <p className="products-error">{productsError}</p>}
        {!productsLoading && !productsError && (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={setSelectedProductId}
              />
            ))}
          </div>
        )}
      </section>
    </main>
    </>
  )
}

export default App
