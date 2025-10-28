'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { completeChallenge } from '@/lib/browser-db'

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<any[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      const cartItems = JSON.parse(savedCart)
      setCart(cartItems)
      const total = cartItems.reduce((sum: number, item: any) => sum + item.price, 0)
      setTotalPrice(total)
    }
  }, [])

  const handlePriceChange = (id: number, newPrice: number) => {
    // VULNERABLE: No server-side validation - client can modify prices!
    const updatedCart = cart.map(item => 
      item.id === id ? { ...item, price: newPrice } : item
    )
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    
    const total = updatedCart.reduce((sum: number, item: any) => sum + item.price, 0)
    setTotalPrice(total)
  }

  const handleCheckout = async () => {
    setIsProcessing(true)
    
    // Check for price manipulation
    const hasNegativePrice = cart.some(item => item.price < 0)
    const hasModifiedPrice = cart.some(item => item.price !== item.originalPrice)
    
    if (hasNegativePrice || hasModifiedPrice) {
      const userId = parseInt(localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')!).id : '1')
      await completeChallenge(userId, 'negativeOrder')
    }
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Clear cart
    localStorage.removeItem('cart')
    
    setOrderComplete(true)
    
    // Redirect after 2 seconds
    setTimeout(() => {
      router.push('/')
    }, 2000)
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6">✅</div>
          <h1 className="text-4xl font-bold text-green-600 mb-4">Order Complete!</h1>
          <p className="text-gray-600 text-lg">Thank you for your purchase!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Checkout</h1>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Order Summary</h2>
          
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Your cart is empty!</p>
              <button 
                onClick={() => router.push('/')}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                        {item.emoji || '🧃'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500">ID: {item.id}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => handlePriceChange(item.id, parseFloat(e.target.value))}
                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-right"
                        step="0.01"
                      />
                      <span className="text-lg font-semibold text-gray-800 w-20 text-right">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center text-2xl font-bold text-gray-800">
                  <span>Total:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 font-semibold text-lg shadow-lg transition-all"
              >
                {isProcessing ? 'Processing Order...' : 'Complete Order'}
              </button>
              
              <p className="mt-4 text-sm text-gray-500 text-center">
                💡 Hint: Try changing the prices in the checkout page!
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
