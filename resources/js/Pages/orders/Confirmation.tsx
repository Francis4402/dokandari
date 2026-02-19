import { Head, Link } from '@inertiajs/react';
import {
  FaCheckCircle,
  FaShoppingBag,
  FaTruck,
  FaMoneyBill,
  FaHome,
  FaPrint,
  FaArrowRight,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaStore,
  FaCalendar,
  FaReceipt,
  FaBox,
  FaShieldAlt,
  FaCreditCard,
  FaUser,
  FaClock,
  FaMapPin
} from 'react-icons/fa';
import AppLayout from '@/Layouts/AppLayout';
import { useEffect } from 'react';
import { Orders, OrderItem } from '@/types';

interface OrderProps {
  auth: {
    user: any;
  };
  order: Orders & {
    order_items?: OrderItem[];
  };
}

const Confirmation = ({ auth, order }: OrderProps) => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('print') === 'true') {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price ?? 0).replace('BDT', '৳');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      returned: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      paid: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      refunded: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getFullDeliveryAddress = () => {
    return order.recipient_address;
  };

  const taxAmount = order.subtotal * 0.10;
  const items = order.order_items || [];

  return (
    <AppLayout user={auth.user}>
      <Head title={`Order Confirmation - ${order.order_number}`} />

      {/* Excel Sheet Print Styles */}
      <style type="text/css" media="print">{`
        @page {
          size: A4 landscape;
          margin: 0.3in;
        }

        /* Hide screen content when printing */
        .screen-content {
          display: none !important;
        }

        /* Show print content */
        .print-excel-content {
          display: block !important;
          background: white !important;
          color: black !important;
          font-family: 'Calibri', 'Arial', sans-serif;
          font-size: 10pt;
          line-height: 1.2;
          padding: 20px;
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }

        /* Hide navbar and footer from AppLayout */
        nav, header, footer, [role="navigation"] {
          display: none !important;
        }

        /* Excel header */
        .excel-header {
          margin-bottom: 20px;
          border-bottom: 2px solid #000000;
          padding-bottom: 10px;
        }

        .excel-title {
          font-size: 20pt;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .excel-order-info {
          font-size: 11pt;
          display: flex;
          gap: 30px;
        }

        /* Excel grid layout */
        .excel-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 15px;
          margin-bottom: 20px;
        }

        /* Excel section boxes */
        .excel-section {
          border: 1px solid #999999;
          padding: 10px;
          margin-bottom: 10px;
        }

        .excel-section-title {
          font-weight: bold;
          background-color: #f0f0f0 !important;
          padding: 3px 8px;
          margin: -10px -10px 10px -10px;
          border-bottom: 1px solid #999999;
          font-size: 11pt;
        }

        /* Excel field format */
        .excel-field {
          display: flex;
          margin-bottom: 4px;
          font-size: 9pt;
        }

        .excel-label {
          font-weight: 600;
          width: 80px;
        }

        .excel-value {
          flex: 1;
        }

        /* Excel table */
        .excel-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #999999;
          margin-bottom: 15px;
        }

        .excel-table th {
          background-color: #f0f0f0 !important;
          font-weight: 600;
          text-align: left;
          padding: 5px 8px;
          border: 1px solid #666666;
          font-size: 9pt;
        }

        .excel-table td {
          padding: 4px 8px;
          border: 1px solid #cccccc;
          font-size: 9pt;
        }

        .excel-table td.right {
          text-align: right;
        }

        .excel-table td.center {
          text-align: center;
        }

        /* Excel summary */
        .excel-summary {
          width: 40%;
          margin-left: auto;
          border-collapse: collapse;
        }

        .excel-summary td {
          padding: 4px 8px;
          border: 1px solid #cccccc;
        }

        .excel-summary tr:last-child td {
          font-weight: bold;
          border-top: 2px solid #000000;
        }

        /* Excel footer */
        .excel-footer {
          margin-top: 20px;
          padding-top: 10px;
          border-top: 1px solid #999999;
          font-size: 8pt;
          text-align: center;
        }
      `}</style>

      {/* Print Content - Excel Sheet View */}
      <div className="print-excel-content" style={{ display: 'none' }}>
        {/* Excel Header */}
        <div className="excel-header">
          <div className="excel-title">HaatPoint</div>
          <div className="excel-order-info">
            <span>Order #: {order.order_number}</span>
            <span>Date: {formatDate(order.created_at)}</span>
            <span>Status: {order.order_status.toUpperCase()}</span>
          </div>
        </div>

        {/* Excel Grid - Customer, Order, Delivery Info */}
        <div className="excel-grid">
          {/* Customer Information */}
          <div className="excel-section">
            <div className="excel-section-title">CUSTOMER INFORMATION</div>
            <div className="excel-field">
              <span className="excel-label">Name:</span>
              <span className="excel-value">{order.recipient_name}</span>
            </div>
            <div className="excel-field">
              <span className="excel-label">Phone:</span>
              <span className="excel-value">{order.recipient_phone}</span>
            </div>
            <div className="excel-field">
              <span className="excel-label">Email:</span>
              <span className="excel-value">{order.sender_email}</span>
            </div>
            <div className="excel-field" style={{ marginTop: '5px' }}>
              <span className="excel-label">Address:</span>
              <span className="excel-value">{getFullDeliveryAddress()}</span>
            </div>
          </div>

          {/* Order Details */}
          <div className="excel-section">
            <div className="excel-section-title">ORDER DETAILS</div>
            <div className="excel-field">
              <span className="excel-label">Store:</span>
              <span className="excel-value">{order.store_name}</span>
            </div>
            <div className="excel-field">
              <span className="excel-label">Store Phone:</span>
              <span className="excel-value">{order.sender_phone}</span>
            </div>
            <div className="excel-field">
              <span className="excel-label">Payment:</span>
              <span className="excel-value">{order.payment_method === 'cash_on_delivery' ? 'Cash on Delivery' : 'bKash'}</span>
            </div>
            <div className="excel-field">
              <span className="excel-label">Pay Status:</span>
              <span className="excel-value">{order.payment_status}</span>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="excel-section">
            <div className="excel-section-title">DELIVERY INFORMATION</div>
            <div className="excel-field">
              <span className="excel-label">Method:</span>
              <span className="excel-value">{order.shipping_method}</span>
            </div>
            <div className="excel-field">
              <span className="excel-label">Charge:</span>
              <span className="excel-value">{formatPrice(order.delivery_charge)}</span>
            </div>
            {order.tracking_number && (
              <div className="excel-field">
                <span className="excel-label">Tracking:</span>
                <span className="excel-value">{order.tracking_number}</span>
              </div>
            )}
            {order.special_instruction && (
              <div className="excel-field" style={{ marginTop: '5px' }}>
                <span className="excel-label">Note:</span>
                <span className="excel-value">{order.special_instruction}</span>
              </div>
            )}
          </div>
        </div>

        {/* Order Items Table */}
        <div className="excel-section">
          <div className="excel-section-title">ORDER ITEMS</div>
          <table className="excel-table">
            <thead>
              <tr>
                <th style={{ width: '50%' }}>Product Name</th>
                <th style={{ width: '10%' }}>Quantity</th>
                <th style={{ width: '15%' }}>Unit Price</th>
                <th style={{ width: '15%' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{item.product_name}</td>
                  <td className="center">{item.quantity}</td>
                  <td className="right">{formatPrice(item.price)}</td>
                  <td className="right">{formatPrice(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary Table */}
          <table className="excel-summary">
            <tbody>
              <tr>
                <td>Subtotal</td>
                <td className="right">{formatPrice(order.subtotal)}</td>
              </tr>
              <tr>
                <td>Delivery Charge</td>
                <td className="right">{formatPrice(order.delivery_charge)}</td>
              </tr>
              <tr>
                <td>Tax (10%)</td>
                <td className="right">{formatPrice(taxAmount)}</td>
              </tr>
              {order.discount_amount > 0 && (
                <tr>
                  <td>Discount {order.coupon_code && `(${order.coupon_code})`}</td>
                  <td className="right">-{formatPrice(order.discount_amount)}</td>
                </tr>
              )}
              <tr>
                <td>TOTAL</td>
                <td className="right">{formatPrice(order.total)}</td>
              </tr>
              {order.payment_method === 'cash_on_delivery' && (
                <tr>
                  <td>Amount to Collect (COD)</td>
                  <td className="right" style={{ fontWeight: 'bold' }}>{formatPrice(order.amount_to_collect)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


        {/* Excel Footer */}
        <div className="excel-footer">
          <div>Thank you for your business!</div>
          <div>Generated on: {new Date().toLocaleString('en-BD')}</div>
        </div>
      </div>

      {/* Original Beautiful Frontend Design - Screen Only */}
      <div className="screen-content">
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-green-200 rounded-full opacity-20 animate-ping"></div>
                </div>
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FaCheckCircle className="h-10 w-10 text-white" />
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Order Confirmed!
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Thank you for your order! {order.payment_method === 'cash_on_delivery'
                  ? `Pay ${formatPrice(order.amount_to_collect)} on delivery.`
                  : 'Payment being processed.'}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  <FaReceipt className="h-3 w-3 mr-1" />
                  {order.order_number}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
                  {order.order_status}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                  {order.payment_status}
                </span>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                >
                  <FaPrint className="mr-2" />
                  Print Invoice
                </button>
              </div>
            </div>

            {/* Your Original Design - Left Column - Order Items */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                  <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-5 py-3 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-white flex items-center">
                      <FaShoppingBag className="h-4 w-4 mr-2" />
                      Order Summary
                    </h2>
                  </div>
                  <div className="p-4">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">Item</th>
                          <th className="text-center py-2 text-xs font-medium text-gray-500 uppercase">Qty</th>
                          <th className="text-right py-2 text-xs font-medium text-gray-500 uppercase">Price</th>
                          <th className="text-right py-2 text-xs font-medium text-gray-500 uppercase">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="py-3 text-sm">
                              <span className="font-medium">{item.product_name}</span>
                            </td>
                            <td className="py-3 text-sm text-center">{item.quantity}</td>
                            <td className="py-3 text-sm text-right">{formatPrice(item.price)}</td>
                            <td className="py-3 text-sm text-right font-medium">{formatPrice(item.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Price Summary */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between text-sm py-1">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">{formatPrice(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm py-1">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium">{formatPrice(order.delivery_charge)}</span>
                      </div>
                      <div className="flex justify-between text-sm py-1">
                        <span className="text-gray-600">Tax (10%)</span>
                        <span className="font-medium">{formatPrice(taxAmount)}</span>
                      </div>
                      {order.discount_amount > 0 && (
                        <div className="flex justify-between text-sm py-1">
                          <span className="text-gray-600">Discount {order.coupon_code && `(${order.coupon_code})`}</span>
                          <span className="font-medium text-green-600">-{formatPrice(order.discount_amount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-base font-bold pt-3 mt-2 border-t border-gray-300">
                        <span>Total</span>
                        <span className="text-green-600">{formatPrice(order.total)}</span>
                      </div>
                      {order.payment_method === 'cash_on_delivery' && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-blue-800">Amount to collect on delivery</span>
                            <span className="text-lg font-bold text-blue-800">{formatPrice(order.amount_to_collect)}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Payment Method */}
                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                        {order.payment_method === 'cash_on_delivery'
                          ? <FaMoneyBill className="h-5 w-5 text-green-600" />
                          : <FaCreditCard className="h-5 w-5 text-blue-600" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{order.payment_method === 'cash_on_delivery' ? 'Cash on Delivery' : 'bKash'}</p>
                        {order.payment_method === 'cash_on_delivery' && (
                          <p className="text-xs text-gray-500">Pay when you receive your order</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Customer & Delivery Info */}
              <div className="space-y-4">
                {/* Customer Info */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-2">
                    <h3 className="text-white font-bold text-sm flex items-center">
                      <FaUser className="h-3 w-3 mr-1" />
                      Customer
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Name:</span> {order.recipient_name}</p>
                      <p><span className="text-gray-500">Phone:</span> {order.recipient_phone}</p>
                      <p><span className="text-gray-500">Email:</span> {order.recipient_email}</p>
                      <p className="pt-2 border-t border-gray-100"><span className="text-gray-500">Order #:</span> {order.order_number}</p>
                      <p><span className="text-gray-500">Date:</span> {formatDate(order.created_at)}</p>
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                  <div className="bg-gradient-to-r from-green-600 to-teal-600 px-5 py-2">
                    <h3 className="text-white font-bold text-sm flex items-center">
                      <FaTruck className="h-3 w-3 mr-1" />
                      Delivery
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Address:</span> {getFullDeliveryAddress()}</p>
                      <p><span className="text-gray-500">Method:</span> {order.shipping_method === 'pathao' ? 'Pathao' : 'Standard'}</p>
                      {order.tracking_number && <p><span className="text-gray-500">Tracking:</span> {order.tracking_number}</p>}
                      {order.special_instruction && (
                        <p className="pt-2 border-t border-gray-100"><span className="text-gray-500">Note:</span> {order.special_instruction}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Store Info */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                  <div className="bg-gradient-to-r from-orange-600 to-red-600 px-5 py-2">
                    <h3 className="text-white font-bold text-sm flex items-center">
                      <FaStore className="h-3 w-3 mr-1" />
                      Store
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-2 text-sm">
                      <p className="font-medium">{order.store_name}</p>
                      <p><span className="text-gray-500">email:</span>: {order.sender_email}</p>
                      <p><span className="text-gray-500">Phone:</span> {order.sender_phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Notes */}
            {order.notes && (
              <div className="mt-4 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-yellow-600 to-orange-600 px-5 py-2">
                  <h3 className="text-white font-bold text-sm">Notes</h3>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-700">{order.notes}</p>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="mt-4 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2">
                <h3 className="text-white font-bold text-sm flex items-center">
                  <FaClock className="h-3 w-3 mr-1" />
                  Timeline
                </h3>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                    <span>Confirmed {formatDate(order.created_at)}</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${order.order_status === 'processing' ? 'bg-blue-500' : 'bg-gray-300'} mr-1`}></div>
                    <span>Processing</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${order.order_status === 'shipped' ? 'bg-indigo-500' : 'bg-gray-300'} mr-1`}></div>
                    <span>Shipped</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${order.order_status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'} mr-1`}></div>
                    <span>Delivered</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={route('orders.index')}
                className="inline-flex items-center justify-center px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                <FaShoppingBag className="h-4 w-4 mr-2" />
                My Orders
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 text-sm font-medium"
              >
                Continue Shopping
                <FaArrowRight className="h-3 w-3 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Confirmation;
