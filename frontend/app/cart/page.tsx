'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Define TypeScript interfaces
interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    // In a real application, you would fetch the cart items from an API or local storage
    const mockCart: CartItem[] = [
      { id: 1, name: 'Ergonomic Chair', price: 199.99, quantity: 1 },
      { id: 2, name: 'Wireless Mouse', price: 29.99, quantity: 2 },
    ]
    setCart(mockCart)
  }, [])

  const updateQuantity = (id: number, newQuantity: number) => {
    setCart(cart.map(item => 
      item.id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item
    ))
  }

  const removeItem = (id: number) => {
    setCart(cart.filter(item => item.id !== id))
    toast.info('Item removed from cart')
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const checkout = () => {
    // Here you would typically integrate with a payment gateway
    toast.success('Checkout successful! Thank you for your purchase.')
    setCart([])
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Cart</h1>
      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          {cart.map(item => (
            <Card key={item.id} className="mb-4">
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">${item.price.toFixed(2)}</p>
                <div className="flex items-center mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </Button>
                  <span className="mx-2">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="destructive" onClick={() => removeItem(item.id)}>
                  Remove
                </Button>
              </CardFooter>
            </Card>
          ))}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">Total: ${totalPrice.toFixed(2)}</p>
              </CardContent>
              <CardFooter>
                <Button onClick={checkout} className="w-full">
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
          </div>
        </>
      )}
      <ToastContainer position="bottom-right" />
    </div>
  )
}
