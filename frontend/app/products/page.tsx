'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Define TypeScript interfaces
interface Product {
  id: number
  name: string
  price: number
  description: string
}

interface NewProduct {
  name: string
  price: string
  description: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [] = useState<NewProduct>({ name: '', price: '', description: '' })
  
useEffect(() => {
    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/products');  // Adjust the URL if necessary
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            setProducts(data);  // Assuming `setProducts` updates your frontend state
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch products');
        }
    };

    fetchProducts();
}, []);

 

  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      <h1 className="text-3xl font-bold mb-8 text-center">Products</h1>
      <ToastContainer position="bottom-right" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <p>${product.price.toFixed(2)}</p>
            </CardHeader>
            <CardContent>
              <p>{product.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
