import React, { useState } from 'react';
import { ShoppingBag, ArrowLeft, X, Star, Minus, Plus, Trash2 } from 'lucide-react';

// Image imports
import classicAviator from '../assets/classic-aviator.png';
import modernSquare from '../assets/modern-square.png';
import roundVintage from '../assets/round-vintage.png';
import sportsGoggles from '../assets/sports-goggles.png';
import catEye from '../assets/cat-eye.png';
import wayfarer from '../assets/wayfarer.png';

// Accent colors
const ACCENT_COLORS = ['#0E2A4F', '#0B3A44', '#050607'];

// Get accent color based on product ID
const getAccentColor = (id) => ACCENT_COLORS[id % ACCENT_COLORS.length];

// Mock product data
const products = [
  { 
    id: 1, 
    name: "Classic Aviator", 
    category: "Sunglasses", 
    price: 899, 
    rating: 4.5, 
    reviews: 234, 
    inStock: true, 
    color: "Gold", 
    description: "Timeless aviator style with premium metal frame and UV protection. Perfect for any occasion.", 
    image: classicAviator 
  },
  { 
    id: 2, 
    name: "Modern Square", 
    category: "Eyeglasses", 
    price: 699, 
    rating: 4.8, 
    reviews: 189, 
    inStock: true, 
    color: "Black", 
    description: "Contemporary square frames with lightweight design. Ideal for everyday wear.", 
    image: modernSquare 
  },
  { 
    id: 3, 
    name: "Round Vintage", 
    category: "Eyeglasses", 
    price: 999, 
    rating: 4.6, 
    reviews: 156, 
    inStock: true, 
    color: "Tortoise", 
    description: "Vintage-inspired round frames that combine retro charm with modern comfort.", 
    image: roundVintage 
  },
  { 
    id: 4, 
    name: "Sports Goggles", 
    category: "Sports", 
    price: 599, 
    rating: 4.7, 
    reviews: 98, 
    inStock: true, 
    color: "Blue", 
    description: "High-performance sports eyewear with anti-fog coating and secure fit.", 
    image: sportsGoggles 
  },
  { 
    id: 5, 
    name: "Cat Eye Fashion", 
    category: "Sunglasses", 
    price: 799, 
    rating: 4.9, 
    reviews: 312, 
    inStock: true, 
    color: "Rose Gold", 
    description: "Elegant cat-eye design with gradient lenses and sophisticated rose gold finish.", 
    image: catEye 
  },
  { 
    id: 6, 
    name: "Wayfarer Classic", 
    category: "Sunglasses", 
    price: 749, 
    rating: 4.4, 
    reviews: 267, 
    inStock: false, 
    color: "Black", 
    description: "Iconic wayfarer style that never goes out of fashion. Classic and versatile.", 
    image: wayfarer 
  },
  { 
    id: 7, 
    name: "Oversized Glam", 
    category: "Sunglasses", 
    price: 949, 
    rating: 4.7, 
    reviews: 145, 
    inStock: true, 
    color: "Brown", 
    description: "Bold oversized frames for a glamorous look with maximum sun protection.", 
    image: classicAviator 
  },
  { 
    id: 8, 
    name: "Minimalist Frame", 
    category: "Eyeglasses", 
    price: 549, 
    rating: 4.3, 
    reviews: 87, 
    inStock: true, 
    color: "Silver", 
    description: "Ultra-thin minimalist frames for a barely-there look. Lightweight and comfortable.", 
    image: modernSquare 
  },
  { 
    id: 9, 
    name: "Retro Pilot", 
    category: "Sunglasses", 
    price: 999, 
    rating: 4.8, 
    reviews: 203, 
    inStock: true, 
    color: "Gold", 
    description: "Classic pilot style with double bridge and premium polarized lenses.", 
    image: roundVintage 
  },
];

// Format price in Indian Rupees
const formatPrice = (price) => {
  return `₹${price.toLocaleString('en-IN')}`;
};

const EyewearEcommerce = () => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Add product to cart
  const addToCart = (product) => {
    if (!product.inStock) return;
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // Update quantity in cart
  const updateQuantity = (productId, delta) => {
    setCart(prevCart => {
      return prevCart
        .map(item => {
          if (item.id === productId) {
            const newQuantity = item.quantity + delta;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  // Calculate cart totals
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Handle back button
  const handleBack = () => {
    if (selectedProduct) {
      setSelectedProduct(null);
    } else {
      window.history.back();
    }
  };

  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif', 
      background: '#ffffff', 
      minHeight: '100vh', 
      padding: '2rem 1rem'
    }}>
      {/* Back Button and Cart */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto 3rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '0 1rem'
      }}>
        <button 
          onClick={handleBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#0E2A4F',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            padding: '0.5rem'
          }}
        >
          <ArrowLeft size={20} /> Back
        </button>

        <div 
          style={{ position: 'relative', cursor: 'pointer', padding: '0.5rem' }} 
          onClick={() => setIsCartOpen(!isCartOpen)}
        >
          <ShoppingBag size={24} color="#0E2A4F" />
          {cartCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '0',
              right: '0',
              background: '#0E2A4F',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>
              {cartCount}
            </span>
          )}
        </div>
      </div>

      {/* Product Grid View */}
      {!selectedProduct && (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
          <div className="product-grid">
            {products.map(product => {
              const accentColor = getAccentColor(product.id);
              
              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="product-card"
                  style={{ cursor: 'pointer' }}
                >
                  {/* Square Image */}
                  <div style={{
                    aspectRatio: '1',
                    background: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                    overflow: 'hidden',
                    border: `3px solid ${accentColor}`,
                    position: 'relative',
                    transition: 'all 0.3s'
                  }}
                  className="product-image"
                  >
                    <img 
                      src={product.image} 
                      alt={product.name}
                      style={{
                        width: '80%',
                        height: '80%',
                        objectFit: 'contain'
                      }}
                    />
                  </div>

                  {/* Product Name and Price */}
                  <h3 style={{ 
                    fontSize: '1rem', 
                    fontWeight: '400', 
                    color: accentColor,
                    marginBottom: '0.25rem'
                  }}>
                    {product.name}
                  </h3>
                  <p style={{ 
                    fontSize: '1rem', 
                    color: '#666',
                    margin: 0
                  }}>
                    {formatPrice(product.price)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Product Detail View */}
      {selectedProduct && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div className="product-detail-grid">
            {/* Product Image */}
            <div style={{
              aspectRatio: '1',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              border: `4px solid ${getAccentColor(selectedProduct.id)}`
            }}>
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name}
                style={{
                  width: '80%',
                  height: '80%',
                  objectFit: 'contain'
                }}
              />
            </div>

            {/* Product Details */}
            <div style={{ paddingTop: '2rem' }}>
              <div style={{ 
                color: getAccentColor(selectedProduct.id), 
                fontSize: '0.85rem', 
                fontWeight: '600', 
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '1rem'
              }}>
                {selectedProduct.category}
              </div>

              <h1 style={{ 
                fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', 
                fontWeight: '400', 
                color: '#050607',
                marginBottom: '1rem',
                lineHeight: 1.2
              }}>
                {selectedProduct.name}
              </h1>

              <div style={{ 
                fontSize: 'clamp(1.5rem, 4vw, 2rem)', 
                fontWeight: '500', 
                color: getAccentColor(selectedProduct.id),
                marginBottom: '2rem'
              }}>
                {formatPrice(selectedProduct.price)}
              </div>

              {/* Rating */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                marginBottom: '2rem',
                paddingBottom: '2rem',
                borderBottom: '1px solid #e5e5e5',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      fill={i < Math.floor(selectedProduct.rating) ? '#fbbf24' : 'none'}
                      color={i < Math.floor(selectedProduct.rating) ? '#fbbf24' : '#d1d5db'}
                    />
                  ))}
                </div>
                <span style={{ fontSize: '0.95rem', color: '#666' }}>
                  {selectedProduct.rating} ({selectedProduct.reviews} reviews)
                </span>
              </div>

              {/* Description */}
              <p style={{ 
                fontSize: '1rem', 
                color: '#666',
                lineHeight: 1.6,
                marginBottom: '2rem'
              }}>
                {selectedProduct.description}
              </p>

              {/* Color */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                  Color
                </div>
                <div style={{ fontSize: '1rem', color: '#050607', fontWeight: '500' }}>
                  {selectedProduct.color}
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => {
                  addToCart(selectedProduct);
                  setIsCartOpen(true);
                }}
                disabled={!selectedProduct.inStock}
                style={{
                  width: '100%',
                  padding: '1rem 2rem',
                  background: selectedProduct.inStock ? getAccentColor(selectedProduct.id) : '#ccc',
                  color: 'white',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: selectedProduct.inStock ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => selectedProduct.inStock && (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <ShoppingBag size={20} />
                {selectedProduct.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>

              {!selectedProduct.inStock && (
                <p style={{ fontSize: '0.9rem', color: '#ff4444', marginTop: '1rem', textAlign: 'center' }}>
                  This item is currently unavailable
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <>
          <div
            onClick={() => setIsCartOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 1998
            }}
          />
          <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '100%',
            maxWidth: '400px',
            height: '100vh',
            background: 'white',
            zIndex: 1999,
            boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Cart Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid #e5e5e5',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '500', color: '#050607' }}>
                Cart ({cartCount})
              </h2>
              <X 
                size={24} 
                onClick={() => setIsCartOpen(false)} 
                style={{ cursor: 'pointer', color: '#666' }} 
              />
            </div>

            {/* Cart Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#666' }}>
                  <ShoppingBag size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                cart.map(item => {
                  const accentColor = getAccentColor(item.id);
                  
                  return (
                    <div key={item.id} style={{
                      display: 'flex',
                      gap: '1rem',
                      padding: '1rem',
                      borderBottom: '1px solid #e5e5e5'
                    }}>
                      <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'transparent',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        border: `2px solid ${accentColor}`
                      }}>
                        <img 
                          src={item.image} 
                          alt={item.name}
                          style={{
                            width: '80%',
                            height: '80%',
                            objectFit: 'contain'
                          }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ 
                          fontSize: '0.95rem', 
                          fontWeight: '500', 
                          marginBottom: '0.25rem', 
                          color: '#050607' 
                        }}>
                          {item.name}
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>
                          {formatPrice(item.price)}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            style={{
                              width: '28px',
                              height: '28px',
                              border: '1px solid #d0d0d0',
                              background: 'white',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '4px'
                            }}
                          >
                            <Minus size={14} color="#333" />
                          </button>
                          <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: '500' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            style={{
                              width: '28px',
                              height: '28px',
                              border: '1px solid #d0d0d0',
                              background: 'white',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '4px'
                            }}
                          >
                            <Plus size={14} color="#333" />
                          </button>
                        </div>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'flex-end', 
                        gap: '0.5rem' 
                      }}>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#666',
                            padding: '4px'
                          }}
                        >
                          <Trash2 size={18} color="#666" />
                        </button>
                        <span style={{ fontWeight: '500', color: accentColor }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div style={{ padding: '1.5rem', borderTop: '1px solid #e5e5e5' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '1rem' 
                }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>Total</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: '500', color: '#0E2A4F' }}>
                    {formatPrice(cartTotal)}
                  </span>
                </div>
                <button style={{
                  width: '100%',
                  padding: '1rem',
                  background: '#0E2A4F',
                  color: 'white',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  Checkout
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <style>{`
        .product-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 3rem;
        }
        
        .product-card:hover .product-image {
          border-width: 5px;
        }
        
        .product-card:hover {
          opacity: 0.7;
        }
        
        .product-detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
        }
        
        /* Tablet */
        @media (max-width: 1024px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
          }
          
          .product-detail-grid {
            gap: 3rem;
          }
        }
        
        /* Mobile */
        @media (max-width: 768px) {
          .product-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .product-detail-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
        
        /* Small Mobile */
        @media (max-width: 480px) {
          .product-grid {
            gap: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default EyewearEcommerce;