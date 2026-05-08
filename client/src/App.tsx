import { useState, useEffect } from 'react'
import { ProductDetail } from './components/ProductDetail'
import { ProductCard } from './components/ProductCard'
import { CartPanel } from './components/CartPanel'
import { AuthForm } from './components/AuthForm'
import { FeedbackPrompt } from './components/FeedbackPrompt'
import { fetchProducts } from './api/products'
import { getMyOrders, type MyOrder } from './api/orders'
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
  const [myOrders, setMyOrders] = useState<MyOrder[]>([])

  useEffect(() => {
    if (userEmail) getMyOrders().then(setMyOrders)
    else setMyOrders([])
  }, [userEmail])

  function loadProducts() {
    fetchProducts()
      .then(setProducts)
      .catch(() => setProductsError('Kunde inte ladda produkter. Kontrollera att servern körs.'))
      .finally(() => setProductsLoading(false))
  }

  useEffect(() => { loadProducts() }, [])

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
          category: product.category,
          fitLabel: product.fit.label,
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

  function updateQuantity(itemId: CartItem['id'], quantity: number) {
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
    )
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const selectedProduct = products.find((p) => p.id === selectedProductId)

  // Flatten all orders into a single list and attach the order ID to each item
  const allOrderItems = myOrders.flatMap((o) => o.items.map((item) => ({ ...item, orderId: o._id })))

  // The user's own purchase of the currently viewed shoe (used to show their personal fit rating)
  const pastPurchase = selectedProductId
    ? allOrderItems.find((item) => item.productId === selectedProductId)
    : undefined

  // All other past purchases — used to suggest a size for the current shoe based on similar shoes
  const orderHistory = allOrderItems.filter((item) => item.productId !== selectedProductId)

  const topBarRight = (
    <div className="top-bar__right">
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
  )

  return (
    <>
      {cartOpen && (
        <CartPanel
          items={cartItems}
          isLoggedIn={userEmail !== null}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
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
        {/* Reload products after feedback so updated fit percentages show straight away */}
        <FeedbackPrompt items={feedbackItems} onDone={() => { setFeedbackItems([]); loadProducts() }} />
      )}

      <main className="shop-page">
        {selectedProduct ? (
          <>
            <div className="top-bar">
              <button
                type="button"
                className="product-detail__back"
                onClick={() => setSelectedProductId(null)}
              >
                ← Back to shoes
              </button>
              {topBarRight}
            </div>
            <ProductDetail
              product={selectedProduct}
              onAddToCart={addToCart}
              pastPurchase={pastPurchase}
              orderHistory={orderHistory}
            />
          </>
        ) : (
          <>
            <section className="shop-hero">
              <div>
                <p className="shop-hero__eyebrow">Confidency Store</p>
                <h1>Size Confidency, before checkout.</h1>
              </div>
              <p>
                Browse shoes with clear size availability and fit guidance.
              </p>
            </section>

            <section className="product-section" aria-labelledby="product-list-title">
              <div className="product-section__header">
                <h2 id="product-list-title">Shoes</h2>
                <div className="product-section__header-right">
                  <span>{products.length} products</span>
                  {topBarRight}
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
          </>
        )}
      </main>
    </>
  )
}

export default App
