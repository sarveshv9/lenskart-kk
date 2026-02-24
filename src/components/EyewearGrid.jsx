import React, { useState } from 'react';
import { ShoppingBag, ArrowLeft, X, Star, Minus, Plus, Trash2 } from 'lucide-react';
import '../styles/EyewearGrid.css';

// Image imports
import classicAviator from '../assets/classic-aviator.png';
import modernSquare from '../assets/modern-square.png';
import roundVintage from '../assets/round-vintage.png';
import sportsGoggles from '../assets/sports-goggles.png';
import catEye from '../assets/cat-eye.png';
import wayfarer from '../assets/wayfarer.png';

// Accent styling mapping
const ACCENTS = ['accent-blue', 'accent-orange', 'accent-purple'];
const getAccentClass = (id) => ACCENTS[id % ACCENTS.length];

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

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

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

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleBack = () => {
    if (selectedProduct) {
      setSelectedProduct(null);
    } else {
      window.history.back();
    }
  };

  return (
    <div className="eyewear-container">
      {/* Dynamic Background */}
      <div className="eyewear-bg" aria-hidden="true">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Header / Nav Area */}
      <div className="shop-header">
        <button className="back-btn glass-btn" onClick={handleBack}>
          <ArrowLeft size={18} /> <span>Back</span>
        </button>

        <div className="cart-trigger glass-btn" onClick={() => setIsCartOpen(!isCartOpen)}>
          <ShoppingBag size={20} />
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </div>
      </div>

      {/* Product Grid View */}
      {!selectedProduct && (
        <div className="shop-content">
          <div className="product-grid">
            {products.map(product => {
              const accentClass = getAccentClass(product.id);

              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className={`product-card glass-panel ${accentClass}`}
                >
                  <div className="product-image-wrapper">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                    />
                  </div>
                  <div className="product-info">
                    <div className="product-meta">
                      <span className="product-category">{product.category}</span>
                      <div className="product-rating">
                        <Star size={14} className="star-icon" fill="currentColor" /> {product.rating}
                      </div>
                    </div>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-price">{formatPrice(product.price)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Product Detail View */}
      {selectedProduct && (
        <div className="shop-content detail-view">
          <div className="product-detail-grid">
            {/* Product Image */}
            <div className={`detail-image-wrapper glass-panel ${getAccentClass(selectedProduct.id)}`}>
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="detail-image"
              />
            </div>

            {/* Product Details */}
            <div className="detail-info">
              <div className={`detail-category ${getAccentClass(selectedProduct.id)}`}>
                {selectedProduct.category}
              </div>

              <h1 className="detail-name">{selectedProduct.name}</h1>

              <div className={`detail-price ${getAccentClass(selectedProduct.id)}`}>
                {formatPrice(selectedProduct.price)}
              </div>

              {/* Rating */}
              <div className="detail-rating-row">
                <div className="stars-container">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      fill={i < Math.floor(selectedProduct.rating) ? '#fbbf24' : 'none'}
                      color={i < Math.floor(selectedProduct.rating) ? '#fbbf24' : 'rgba(255,255,255,0.2)'}
                    />
                  ))}
                </div>
                <span className="reviews-count">
                  {selectedProduct.rating} ({selectedProduct.reviews} reviews)
                </span>
              </div>

              {/* Description */}
              <p className="detail-description">{selectedProduct.description}</p>

              {/* Color */}
              <div className="detail-color-section">
                <div className="color-label">Color</div>
                <div className="color-value">{selectedProduct.color}</div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => {
                  addToCart(selectedProduct);
                  setIsCartOpen(true);
                }}
                disabled={!selectedProduct.inStock}
                className={`add-to-cart-btn ${selectedProduct.inStock ? getAccentClass(selectedProduct.id) : 'out-of-stock-btn'}`}
              >
                <ShoppingBag size={20} />
                {selectedProduct.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>

              {!selectedProduct.inStock && (
                <p className="out-of-stock-msg">This item is currently unavailable</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <>
          <div className="cart-overlay" onClick={() => setIsCartOpen(false)} />
          <div className="cart-sidebar glass-panel-heavy">
            {/* Cart Header */}
            <div className="cart-header">
              <h2>Cart ({cartCount})</h2>
              <button className="close-cart-btn" onClick={() => setIsCartOpen(false)}>
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <ShoppingBag size={48} className="empty-icon" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                cart.map(item => {
                  const accentClass = getAccentClass(item.id);
                  return (
                    <div key={item.id} className="cart-item">
                      <div className={`cart-item-image ${accentClass}`}>
                        <img src={item.image} alt={item.name} />
                      </div>

                      <div className="cart-item-details">
                        <h4 className="cart-item-name">{item.name}</h4>
                        <p className="cart-item-price">{formatPrice(item.price)}</p>

                        <div className="cart-item-controls">
                          <button onClick={() => updateQuantity(item.id, -1)} className="qty-btn">
                            <Minus size={14} />
                          </button>
                          <span className="qty-value">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="qty-btn">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="cart-item-actions">
                        <button onClick={() => removeFromCart(item.id)} className="remove-btn">
                          <Trash2 size={16} />
                        </button>
                        <span className={`cart-item-total ${accentClass}`}>
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total-row">
                  <span>Total</span>
                  <span className="cart-total-value">{formatPrice(cartTotal)}</span>
                </div>
                <button className="checkout-btn accent-blue">Checkout</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default EyewearEcommerce;