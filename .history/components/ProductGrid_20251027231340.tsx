'use client'

import { useState, useEffect } from 'react'
import { getAllProducts } from '@/lib/browser-db'

interface Product {
  id: number
  name: string
  description?: string
  price: number
}

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<Array<{product: Product, quantity: number}>>([])

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const allProducts = await getAllProducts()
      setProducts(allProducts)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id)
    if (existingItem) {
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.product.id !== productId))
  }

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  }

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>
  }

  return (
    <div className="space-y-8">
      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">🛒 Your Cart ({cart.length})</h3>
          <div className="space-y-2 mb-4">
            {cart.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-gray-200 pb-2">
                <div>
                  <span className="font-semibold text-gray-800">{item.product.name}</span>
                  <span className="text-gray-600 ml-2">x{item.quantity}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-blue-600 font-semibold">${(item.product.price * item.quantity).toFixed(2)}</span>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 flex justify-between items-center">
            <span className="text-xl font-bold text-gray-800">Total:</span>
            <span className="text-2xl font-bold text-blue-600">${getTotalPrice().toFixed(2)}</span>
          </div>
          <button
            onClick={() => {
              // VULNERABLE: This will send cart to server where price could be manipulated
              alert('⏰ Payment flow coming soon! Try to manipulate the price before checkout.')
            }}
            className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 font-semibold shadow-lg transition-all"
          >
            💳 Proceed to Checkout
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            💡 Try modifying prices using browser DevTools before checkout!
          </p>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-3">{product.description}</p>
              <p className="text-2xl font-bold text-blue-600">${product.price}</p>
            </div>
            <button
              onClick={() => addToCart(product)}
              className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-semibold transition-all"
            >
              🛒 Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
