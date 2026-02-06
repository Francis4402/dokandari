import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  FaShoppingCart,
  FaTrash,
  FaPlus,
  FaMinus,
  FaArrowRight,
  FaArrowLeft,
  FaCreditCard,
  FaTag,
  FaShieldAlt,
  FaTruck,
  FaUndo,
  FaHeart,
  FaCheckCircle,
  FaLock,
  FaBox,
  FaTimes,
  FaStar,
  FaShare,
  FaSync,
  FaGift
} from 'react-icons/fa';
import AppLayout from '@/Layouts/AppLayout';
import { useStore } from '../state/cartStore';
import ClearCartDialog from '../dialogpopups/ClearCartDialog';



const CartPage = ({ auth }: { auth: { user: any } }) => {
  const {
    cart: cartItems,
    removeFromCart,
    clearCart,
    getTotalItems,
    getSubTotal,
    getTax,
    getShipping,
    increaseQty,
    decreaseQty,
    getItemById
  } = useStore();

  const [isOpen, setIsOpen] = useState(false);

  const [couponCode, setCouponCode] = useState('');

  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
  } | null>({
    code: 'WELCOME15',
    discount: 15,
    type: 'percentage'
  });

  function open() {
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }

  const confirmClearCart = () => {
    clearCart();
    close();
};



  const calculateTotals = () => {
    const subtotal = getSubTotal();
    const tax = getTax();
    const shipping = getShipping();
    const item_count = getTotalItems();

    // Apply coupon discount
    const discount = appliedCoupon ?
      (appliedCoupon.type === 'percentage' ?
        subtotal * (appliedCoupon.discount / 100) :
        Math.min(appliedCoupon.discount, subtotal)) :
      0;

    const total = Math.max(0, subtotal + tax + shipping - discount);

    return { subtotal, tax, shipping, discount, total, item_count };
  };

  const cartTotals = calculateTotals();

  const handleIncreaseQuantity = (itemId: string) => {
    const item = getItemById(itemId);
    if (item && item.cartQty && item.cartQty < item.quantity) {
      increaseQty(itemId);
    }
  };

  const handleDecreaseQuantity = (itemId: string) => {
    const item = getItemById(itemId);
    if (item && item.cartQty && item.cartQty > 1) {
      decreaseQty(itemId);
    } else {
      removeFromCart(itemId);
    }
  };

  const moveToWishlist = (itemId: string) => {
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
      removeFromCart(itemId);
      console.log('Moved to wishlist:', item.name);
    }
  };


  const applyCoupon = () => {
    if (!couponCode.trim()) return;

    const validCoupons = [
      { code: 'SAVE10', discount: 10, type: 'percentage' as const },
      { code: 'SAVE20', discount: 20, type: 'percentage' as const },
      { code: 'FREESHIP', discount: 5.99, type: 'fixed' as const },
      { code: 'WELCOME15', discount: 15, type: 'percentage' as const }
    ];

    const coupon = validCoupons.find(c => c.code === couponCode.toUpperCase());

    if (coupon) {
      setAppliedCoupon(coupon);
      setCouponCode('');
    } else {
      alert('Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2
    }).format(price);
  };

  const calculateDiscountPercentage = (regular: number, sale: number | null) => {
    if (!sale || sale >= regular) return 0;
    return Math.round(((regular - sale) / regular) * 100);
  };

  const getStockStatus = (inStock: boolean) => {
    if (inStock) return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
    return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
  };

  const getFirstImage = (images: string) => {
    try {
      // Parse the JSON string
      const parsed = JSON.parse(images);

      // Handle both array and single string
      let imageName = '';
      if (Array.isArray(parsed) && parsed.length > 0) {
        imageName = parsed[0];
      } else if (typeof parsed === 'string' && parsed) {
        imageName = parsed;
      }

      if (imageName) {
        // Construct full URL
        return `${window.location.origin}/product_images/${imageName}`;
      }
    } catch (error) {
      // If parsing fails, try to extract from string
      if (typeof images === 'string' && images) {
        const matches = images.match(/"([^"]+)"/);
        if (matches && matches[1]) {
          return `${window.location.origin}/product_images/${matches[1]}`;
        }
      }
    }

    return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop';
  };

  // Calculate savings from sale prices
  const calculateSaleSavings = () => {
    return cartItems.reduce((sum, item) => {
      const regular = (item.regular_price);
      const sale = (item.sale_price);
      const quantity = item.cartQty || 1;

      if (sale && sale < regular) {
        return sum + ((regular - sale) * quantity);
      }
      return sum;
    }, 0);
  };

  return (
    <AppLayout user={auth.user}>
      <Head title="Shopping Cart" />

      <ClearCartDialog isOpen={isOpen} confirmClearCart={confirmClearCart} />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <FaShoppingCart className="h-8 w-8 mr-3 text-blue-600" />
                  Shopping Cart
                </h1>
                <p className="text-gray-600 mt-2">
                  Review and manage your items before checkout
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <Link
                  href="/products"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FaArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Link>

                {cartItems.length > 0 && (
                    <button
                        onClick={open}
                        className="inline-flex items-center px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        <FaTrash className="h-4 w-4 mr-2" />
                        Clear Cart
                    </button>
                )}
              </div>
            </div>

            {/* Cart Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Items in Cart</p>
                    <p className="text-2xl font-bold text-gray-900">{cartTotals.item_count}</p>
                  </div>
                  <FaBox className="h-8 w-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Estimated Total</p>
                    <p className="text-2xl font-bold text-gray-900">{formatPrice(cartTotals.total)}</p>
                  </div>
                  <FaCreditCard className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Savings</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatPrice(cartTotals.discount + calculateSaleSavings())}
                    </p>
                  </div>
                  <FaTag className="h-8 w-8 text-green-500" />
                </div>
              </div>
            </div>
          </div>

          {cartItems.length === 0 ? (
            // Empty Cart State
            <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-100 flex items-center justify-center">
                <FaShoppingCart className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Looks like you haven't added any products to your cart yet. Start shopping to discover amazing products!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaArrowRight className="h-4 w-4 mr-2" />
                  Browse Products
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                  <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Your Items ({cartTotals.item_count})
                      </h2>
                      <div className="flex items-center space-x-2">
                        <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
                          <FaSync className="h-4 w-4 mr-1" />
                          Update All
                        </button>
                        <button className="text-sm text-gray-600 hover:text-gray-700 flex items-center">
                          <FaShare className="h-4 w-4 mr-1" />
                          Share Cart
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {cartItems.map((item) => {
                      const regularPrice = (item.regular_price);
                      const salePrice = item.sale_price ? (item.sale_price) : null;
                      const discountPercent = calculateDiscountPercentage(regularPrice, salePrice);
                      const stockStatus = getStockStatus(item.inStock);
                      const currentPrice = salePrice || regularPrice;
                      const quantity = item.cartQty || 1;
                      const totalPrice = currentPrice * quantity;
                      const imageUrl = getFirstImage(item.images);
                      const rating = item.rating || 0;

                      return (
                        <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                          <div className="flex flex-col sm:flex-row gap-6">
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                              <div className="relative group">
                                <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                                  <img
                                    src={imageUrl}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                                {discountPercent > 0 && (
                                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    -{discountPercent}%
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Product Info */}
                            <div className="flex-grow">
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="flex-grow">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <Link href={`/products/${item.slug}`}>
                                        <h3 className="font-semibold text-gray-900 text-lg mb-1 hover:text-blue-600 transition-colors cursor-pointer">
                                          {item.name}
                                        </h3>
                                      </Link>
                                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                        {item.description}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-lg font-bold text-gray-900">
                                        {currentPrice}
                                      </div>
                                      {salePrice && (
                                        <div className="text-sm text-gray-500 line-through">
                                          {regularPrice}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Product Meta */}
                                  <div className="flex flex-wrap items-center gap-3 mb-4">
                                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                      {item.category}
                                    </span>
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${stockStatus.color}`}>
                                      {stockStatus.label}
                                    </span>
                                    {rating > 0 && (
                                      <span className="flex items-center text-xs text-gray-600">
                                        <FaStar className="h-3 w-3 text-yellow-400 mr-1" />
                                        {rating}
                                      </span>
                                    )}
                                  </div>

                                  {/* Quantity Controls & Actions */}
                                  <div className="flex flex-wrap items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                      {/* Quantity Controls */}
                                      <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                                        <button
                                          onClick={() => handleDecreaseQuantity(item.id)}
                                          disabled={quantity <= 1}
                                          className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg transition-colors"
                                        >
                                          <FaMinus className="h-3 w-3" />
                                        </button>
                                        <span className="w-12 text-center py-2 text-gray-900 font-medium border-x border-gray-300">
                                          {quantity}
                                        </span>
                                        <button
                                          onClick={() => handleIncreaseQuantity(item.id)}
                                          disabled={quantity >= item.quantity}
                                          className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg transition-colors"
                                        >
                                          <FaPlus className="h-3 w-3" />
                                        </button>
                                      </div>

                                      {/* Item Total */}
                                      <div className="text-sm font-semibold text-gray-900">
                                        Total: {formatPrice(totalPrice)}
                                      </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center space-x-4 mt-3 sm:mt-0">
                                      <button
                                        onClick={() => moveToWishlist(item.id)}
                                        className="inline-flex items-center text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-3 py-2 rounded-lg transition-colors"
                                      >
                                        <FaHeart className="h-4 w-4 mr-2" />
                                        Save
                                      </button>
                                      <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="inline-flex items-center text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                                      >
                                        <FaTrash className="h-4 w-4 mr-2" />
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg shadow p-4 border border-gray-200 flex items-center hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                      <FaShieldAlt className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Secure Checkout</p>
                      <p className="text-sm text-gray-600">Your data is protected</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-4 border border-gray-200 flex items-center hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <FaTruck className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Free Shipping</p>
                      <p className="text-sm text-gray-600">On orders over $50</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-4 border border-gray-200 flex items-center hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mr-4">
                      <FaUndo className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Easy Returns</p>
                      <p className="text-sm text-gray-600">30-day return policy</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-6 space-y-6">
                  {/* Order Summary Card */}
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    <div className="p-6 border-b border-gray-200 bg-gray-50">
                      <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                        <FaCreditCard className="h-5 w-5 mr-2 text-gray-500" />
                        Order Summary
                      </h2>
                    </div>

                    <div className="p-6">
                      {/* Pricing Breakdown */}
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium text-gray-900">{formatPrice(cartTotals.subtotal)}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Shipping</span>
                          <span className={`font-medium ${cartTotals.shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                            {cartTotals.shipping === 0 ? (
                              <span className="flex items-center">
                                <FaCheckCircle className="h-4 w-4 mr-1" />
                                FREE
                              </span>
                            ) : formatPrice(cartTotals.shipping)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Tax (10%)</span>
                          <span className="font-medium text-gray-900">{formatPrice(cartTotals.tax)}</span>
                        </div>

                        {appliedCoupon && (
                          <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg">
                            <div className="flex items-center">
                              <FaGift className="h-4 w-4 text-green-600 mr-2" />
                              <span className="text-gray-700">
                                Discount ({appliedCoupon.code})
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium text-green-600 mr-2">
                                -{formatPrice(cartTotals.discount)}
                              </span>
                              <button
                                onClick={removeCoupon}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="Remove coupon"
                              >
                                <FaTimes className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Coupon Code */}
                      {!appliedCoupon && (
                        <div className="mb-6">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value)}
                              placeholder="Enter coupon code"
                              className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              onClick={applyCoupon}
                              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap"
                            >
                              Apply
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Try codes: SAVE10, SAVE20, FREESHIP
                          </p>
                        </div>
                      )}

                      {/* Total */}
                      <div className="border-t border-gray-200 pt-4 mb-6">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900">Total</span>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              {formatPrice(cartTotals.total)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {cartTotals.item_count} item{cartTotals.item_count !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Checkout Button */}
                      <Link
                        href="/checkout"
                        className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center mb-4 flex items-center justify-center"
                      >
                        <FaLock className="h-5 w-5 mr-2" />
                        Proceed to Checkout
                      </Link>

                      {/* Payment Methods */}
                      <div className="text-center pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-3">We accept</p>
                        <div className="flex justify-center space-x-3">
                          <div className="w-10 h-6 bg-gray-100 rounded border border-gray-300"></div>
                          <div className="w-10 h-6 bg-gray-100 rounded border border-gray-300"></div>
                          <div className="w-10 h-6 bg-gray-100 rounded border border-gray-300"></div>
                          <div className="w-10 h-6 bg-gray-100 rounded border border-gray-300"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Need Help */}
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Need help?</h3>
                    <p className="text-blue-100 text-sm mb-4">
                      Our customer support team is available 24/7 to assist you with your order.
                    </p>
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center w-full py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Contact Support
                      <FaArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default CartPage;
