'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAllProducts } from '@/lib/browser-db'

interface Product {
  id: number
  name: string
  description?: string
  price: number
  emoji?: string
}

export default function ProductGrid({ searchResults, hasSearched, searchQuery }: { searchResults?: any[], hasSearched?: boolean, searchQuery?: string }) {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<Array<{product: Product, quantity: number}>>([])

  useEffect(() => {
    loadProducts()
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        // Convert to internal format
        setCart(parsedCart.map((item: any) => ({
          product: item,
          quantity: 1
        })))
      } catch (e) {
        console.error('Error loading cart:', e)
      }
    }
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

  // Use search results if searching, otherwise use all products
  const displayProducts = hasSearched ? (searchResults || []) : products

  const addToCart = (product: Product) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.price,
      emoji: product.emoji || '🧃'
    }
    
    const updatedCart = [...cart]
    const existingItem = updatedCart.find(item => item.product.id === product.id)
    
    if (existingItem) {
      setCart(updatedCart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...updatedCart, { product, quantity: 1 }])
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify([
      ...updatedCart.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        originalPrice: item.product.originalPrice || item.product.price,
        emoji: item.product.emoji || '🧃'
      })),
      { ...cartItem, quantity: 1 }
    ]))
  }

  const removeFromCart = (productId: number) => {
    const newCart = cart.filter(item => item.product.id !== productId)
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart.map(item => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      originalPrice: item.product.originalPrice || item.product.price,
      emoji: item.product.emoji || '🧃'
    }))))
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
            onClick={() => router.push('/checkout')}
            className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 font-semibold shadow-lg transition-all"
          >
            💳 Proceed to Checkout
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            💡 Try modifying prices using browser DevTools before checkout!
          </p>
        </div>
      )}

      {/* VULNERABLE: Reflected XSS - showing search query without escaping */}
      {hasSearched && searchQuery && (
        <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
          <p className="text-gray-700">
            Results for: <span dangerouslySetInnerHTML={{ __html: searchQuery }} />
          </p>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hasSearched && displayProducts.length === 0 && (
          <div className="col-span-full text-center text-gray-700 py-8">
            No results found
          </div>
        )}
        {displayProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="mb-4">
              {/* VULNERABLE: Stored XSS - rendering product name/description without sanitization */}
              <h3 className="text-xl font-bold text-gray-900 mb-2" dangerouslySetInnerHTML={{ __html: product.name }} />
              <p className="text-gray-600 text-sm mb-3" dangerouslySetInnerHTML={{ __html: product.description || '' }} />
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
