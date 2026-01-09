import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext' // Added CartProvider import
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <CartProvider> {/* Wrapped App with CartProvider */}
          <App />
        </CartProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
