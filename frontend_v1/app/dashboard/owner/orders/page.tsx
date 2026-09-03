
"use client";

import React, { useState, useEffect } from 'react';
import { Search, Eye, Filter, CheckCircle, Clock, Package, X, AlertCircle, Download, FileText, MapPin, CreditCard, ShoppingBag } from 'lucide-react';
import { getOwnerOrders, updateOrderStatus, downloadInvoice, Order } from '@/lib/api/orders';

const STATUSES = ['NEW', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState('ALL');
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getOwnerOrders();
      setOrders(data);
    } catch (err: any) {
      setError(friendlyError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const friendlyError = (err: any): string => {
    const msg = err?.message || "";
    if (msg.includes("401") || msg.includes("403")) return "Your session has expired or you do not have permission. Please log in again.";
    if (msg.includes("404")) return "Order not found.";
    if (msg.includes("400")) return "Invalid order request.";
    if (msg.includes("500")) return "Something went wrong. Please try again.";
    if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) return "Unable to connect to the server.";
    return msg || "An unexpected error occurred.";
  };

  const filteredOrders = orders.filter(o => {
    const matchesFilter = filter === 'ALL' || o.orderStatus === filter;
    const searchString = `${o.orderNumber} ${o.customerName} ${o.customerEmail} ${o.customerPhone}`.toLowerCase();
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW': return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex items-center gap-1"><Clock size={12}/> New</span>;
      case 'PREPARING': return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center gap-1"><Package size={12}/> Preparing</span>;
      case 'READY': return <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium flex items-center gap-1"><Package size={12}/> Ready</span>;
      case 'COMPLETED': return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1"><CheckCircle size={12}/> Completed</span>;
      case 'CANCELLED': return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center gap-1"><X size={12}/> Cancelled</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    if (status === 'COMPLETED' || status === 'PAID') {
      return <span className="text-green-600 font-medium">Paid</span>;
    }
    if (status === 'PENDING') {
      return <span className="text-yellow-600 font-medium">Pending</span>;
    }
    return <span className="text-gray-600 font-medium">{status}</span>;
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      setIsUpdatingStatus(true);
      setUpdateError("");
      const updated = await updateOrderStatus(id, newStatus);
      
      // Update local state
      setOrders(orders.map(o => o.id === id ? updated : o));
      if (selectedOrder?.id === id) {
        setSelectedOrder(updated);
      }
    } catch (err: any) {
      setUpdateError(friendlyError(err));
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDownloadInvoice = async (order: Order) => {
    try {
      setIsDownloading(true);
      await downloadInvoice(order.id, order.orderNumber);
    } catch (err: any) {
      setUpdateError(friendlyError(err));
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
          <p className="text-sm text-gray-500 mt-1">View and manage incoming customer orders.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search orders..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-plum text-sm"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 overflow-x-auto pb-1">
        {['ALL', ...STATUSES].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${filter === tab ? 'border-brand-plum text-brand-plum' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-plum"></div>
                    </div>
                    <p className="mt-4">Loading orders...</p>
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedOrder(order)}>
                    <td className="px-6 py-4 font-medium text-gray-900">{order.orderNumber}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">{order.customerName || 'Guest'}</p>
                      <p className="text-xs text-gray-500">{order.paymentMethod || 'N/A'} • {getPaymentStatusBadge(order.paymentStatus)}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.orderStatus)}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      ₹{order.totalAmount}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                        }}
                        className="p-2 text-gray-500 hover:text-brand-plum bg-gray-100 hover:bg-brand-cream rounded-md transition-colors inline-flex items-center gap-1 text-xs font-medium"
                      >
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    {searchQuery || filter !== 'ALL' ? "No orders found matching your filters." : "No orders found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white shrink-0">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-gray-900">Order {selectedOrder.orderNumber}</h3>
                  {getStatusBadge(selectedOrder.orderStatus)}
                </div>
                <p className="text-sm text-gray-500 mt-1">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleDownloadInvoice(selectedOrder)} 
                  disabled={isDownloading}
                  className="p-2 text-gray-600 hover:text-brand-plum rounded-md hover:bg-gray-100 transition-colors flex items-center gap-1 text-sm font-medium border border-gray-200 disabled:opacity-50"
                  title="Download Invoice"
                >
                  <Download size={16} /> <span className="hidden sm:inline">{isDownloading ? 'Downloading...' : 'Invoice'}</span>
                </button>
                <button onClick={() => setSelectedOrder(null)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto bg-gray-50 flex-1 space-y-6">
              
              {updateError && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md flex items-center gap-2 text-sm border border-red-100">
                  <AlertCircle size={16} />
                  <span>{updateError}</span>
                </div>
              )}

              {/* Status Update Actions */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Update Order Status</h4>
                  <p className="text-xs text-gray-500">Move this order through your fulfillment process.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map(status => (
                    <button
                      key={status}
                      disabled={isUpdatingStatus || selectedOrder.orderStatus === status}
                      onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md shadow-sm transition-colors border ${
                        selectedOrder.orderStatus === status 
                          ? 'bg-brand-plum text-white border-brand-plum' 
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 disabled:opacity-50'
                      }`}
                    >
                      {status.charAt(0) + status.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Info Grids */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Details */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 text-brand-plum mb-3">
                    <div className="p-1.5 bg-brand-cream rounded-md"><Eye size={16} /></div>
                    <h4 className="font-semibold text-gray-900">Customer Details</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500 inline-block w-20">Name:</span> <span className="font-medium text-gray-900">{selectedOrder.customerName || 'N/A'}</span></p>
                    <p><span className="text-gray-500 inline-block w-20">Phone:</span> <span className="text-gray-800">{selectedOrder.customerPhone || 'N/A'}</span></p>
                    <p><span className="text-gray-500 inline-block w-20">Email:</span> <span className="text-gray-800">{selectedOrder.customerEmail || 'N/A'}</span></p>
                  </div>
                </div>

                {/* Delivery/Pickup Info */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 text-brand-plum mb-3">
                    <div className="p-1.5 bg-brand-cream rounded-md"><MapPin size={16} /></div>
                    <h4 className="font-semibold text-gray-900">Delivery Information</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500 inline-block w-20">Date:</span> <span className="font-medium text-gray-900">{selectedOrder.deliveryDate ? new Date(selectedOrder.deliveryDate).toLocaleDateString() : 'N/A'}</span></p>
                    <p className="flex items-start">
                      <span className="text-gray-500 inline-block w-20 shrink-0">Address:</span> 
                      <span className="text-gray-800 leading-relaxed">{selectedOrder.deliveryAddress || 'N/A'}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 text-brand-plum mb-4">
                  <div className="p-1.5 bg-brand-cream rounded-md"><ShoppingBag size={16} /></div>
                  <h4 className="font-semibold text-gray-900">Order Items</h4>
                </div>
                
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-4 flex flex-col sm:flex-row justify-between gap-4 bg-gray-50">
                      <div>
                        <p className="font-bold text-gray-900">{item.productNameSnapshot}</p>
                        
                        <div className="mt-2 space-y-1 text-sm">
                          {item.variantName && (
                            <p><span className="text-gray-500">Variant:</span> <span className="font-medium text-gray-800">{item.variantName}</span></p>
                          )}
                          {item.addonsSummary && (
                            <p><span className="text-gray-500">Add-ons:</span> <span className="text-gray-800">{item.addonsSummary}</span></p>
                          )}
                          {item.dietaryPreference && (
                            <p><span className="text-gray-500">Dietary:</span> <span className="text-gray-800">{item.dietaryPreference}</span></p>
                          )}
                          {item.cakeMessage && (
                            <p><span className="text-gray-500">Message on Cake:</span> <span className="italic text-gray-700">&quot;{item.cakeMessage}&quot;</span></p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex sm:flex-col justify-between sm:justify-start sm:text-right shrink-0">
                        <p className="text-sm text-gray-500">₹{item.unitPrice} × {item.quantity}</p>
                        <p className="font-bold text-gray-900 mt-1">₹{item.totalPrice}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-brand-plum mb-4">
                    <div className="p-1.5 bg-brand-cream rounded-md"><CreditCard size={16} /></div>
                    <h4 className="font-semibold text-gray-900">Payment Summary</h4>
                  </div>
                  {getPaymentStatusBadge(selectedOrder.paymentStatus)}
                </div>
                
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-2 text-sm flex-1">
                    <p><span className="text-gray-500 inline-block w-24">Method:</span> <span className="font-medium text-gray-900">{selectedOrder.paymentMethod || 'N/A'}</span></p>
                    {selectedOrder.transactionId && (
                      <p><span className="text-gray-500 inline-block w-24">Transaction:</span> <span className="text-gray-600 font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">{selectedOrder.transactionId}</span></p>
                    )}
                  </div>
                  
                  <div className="w-full md:w-64 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>₹{selectedOrder.subtotal}</span>
                    </div>
                    {selectedOrder.deliveryCharge > 0 && (
                      <div className="flex justify-between text-gray-600">
                        <span>Delivery Charge</span>
                        <span>₹{selectedOrder.deliveryCharge}</span>
                      </div>
                    )}
                    {selectedOrder.discountAmount && selectedOrder.discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount {selectedOrder.couponCode ? `(${selectedOrder.couponCode})` : ''}</span>
                        <span>-₹{selectedOrder.discountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg text-brand-plum pt-2 border-t border-gray-200 mt-2">
                      <span>Total</span>
                      <span>₹{selectedOrder.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
