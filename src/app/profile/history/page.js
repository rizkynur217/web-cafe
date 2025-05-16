"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function loadOrders() {
      try {
        // Check authentication first
        const authRes = await fetch('/api/auth/me');
        if (!authRes.ok) {
          router.push('/login');
          return;
        }

        const userData = await authRes.json();
        
        // Load orders for the user
        const ordersRes = await fetch(`/api/order/user/${userData.id}`);
        if (ordersRes.ok) {
          const data = await ordersRes.json();
          // Load reviews for each order
          const ordersWithReviews = await Promise.all(data.map(async (order) => {
            const reviews = await Promise.all(order.items.map(async (item) => {
              const reviewRes = await fetch(`/api/reviews?menuItemId=${item.menuItem.id}&orderId=${order.id}`);
              if (reviewRes.ok) {
                const reviewData = await reviewRes.json();
                return reviewData[0]; // Get the first review if exists
              }
              return null;
            }));
            return {
              ...order,
              items: order.items.map((item, index) => ({
                ...item,
                review: reviews[index]
              }))
            };
          }));
          setOrders(ordersWithReviews);
        } else {
          const error = await ordersRes.json();
          setError(error.error || "Failed to load orders");
        }
      } catch (e) {
        console.error("Error:", e);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [router]);

  // Function to format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Function to format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price);
  };

  // Function to get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to handle review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    setSubmittingReview(true);
    setError("");
    
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          menuItemId: selectedItem.menuItem.id,
          orderId: selectedItem.order.id,
          rating,
          comment: comment.trim() || null,
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menambahkan ulasan');
      }

      // Update the orders state with the new review
      setOrders(orders.map(order => {
        if (order.id === selectedItem.order.id) {
          return {
            ...order,
            items: order.items.map(item => {
              if (item.menuItem.id === selectedItem.menuItem.id) {
                return { ...item, review: data };
              }
              return item;
            }),
          };
        }
        return order;
      }));
      
      setReviewSuccess("Review berhasil ditambahkan!");
      setTimeout(() => {
        setReviewModalOpen(false);
        setReviewSuccess("");
        setRating(5);
        setComment("");
        setSelectedItem(null);
      }, 2000);
    } catch (error) {
      console.error('Error submitting review:', error);
      setError(error.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  // Function to open review modal
  const openReviewModal = (item, order) => {
    setSelectedItem({ ...item, order });
    setRating(5);
    setComment("");
    setReviewModalOpen(true);
  };

  if (loading) {
    return <div className="p-8 text-center text-black">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex items-start justify-center p-8">
      {/* Sidebar */}
      <aside className="w-56 bg-white rounded-xl shadow flex flex-col py-6 mr-8 sticky top-8">
        <div>
          <Link href="/profile" className="flex items-center gap-2 px-6 py-3 text-lg hover:bg-[#f7f5f2] transition">
            <span className="text-2xl">👤</span> Profile
          </Link>
          <div className="flex items-center gap-2 px-6 py-3 font-bold text-lg text-[#6d4c2c] bg-[#f7f5f2]">
            <span className="text-2xl">🕒</span> History Order
          </div>
        </div>
        <div className="mt-auto px-6 py-3">
          <Link href="/" className="flex items-center gap-2 text-lg text-[#6d4c2c] hover:underline">
            <span className="text-2xl">🏠</span> Home
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-black">History Pesanan</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {orders.length === 0 && !error ? (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
            Belum ada pesanan
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-1">
                      Order #{order.id}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="border-t border-b border-gray-100 py-4 my-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-4">
                        {item.menuItem.imageUrl && (
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                            <Image
                              src={item.menuItem.imageUrl}
                              alt={item.menuItem.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-black">{item.menuItem.name}</p>
                          <p className="text-sm text-gray-500">{item.quantity}x @ {formatPrice(item.price)}</p>
                          {item.review ? (
                            <div className="mt-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className="text-yellow-400">
                                    {i < item.review.rating ? "★" : "☆"}
                                  </span>
                                ))}
                              </div>
                              {item.review.comment && (
                                <p className="text-sm text-gray-600 mt-1">{item.review.comment}</p>
                              )}
                            </div>
                          ) : (
                            order.status === 'COMPLETED' && (
                              <button
                                onClick={() => openReviewModal(item, order)}
                                className="mt-2 px-4 py-1 bg-[#6d4c2c] text-white rounded-full text-sm hover:bg-[#8b6d4c] transition-colors duration-200 flex items-center gap-2"
                              >
                                <span>⭐</span>
                                Beri Ulasan
                              </button>
                            )
                          )}
                        </div>
                      </div>
                      <p className="font-medium text-black">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    {order.notes && (
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Catatan:</span> {order.notes}
                      </p>
                    )}
                    {order.paymentMethod && (
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Pembayaran:</span> {order.paymentMethod}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Pembayaran</p>
                    <p className="text-lg font-bold text-black">
                      {formatPrice(order.totalPrice)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Review Modal */}
      {reviewModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">
              Beri Ulasan untuk {selectedItem.menuItem.name}
            </h3>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                {error}
              </div>
            )}
            
            {reviewSuccess ? (
              <div className="text-green-600 text-center py-4">{reviewSuccess}</div>
            ) : (
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-2xl transition-colors duration-200 ${star <= rating ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-300 hover:text-gray-400'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Komentar (Opsional)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6d4c2c] border-gray-300 text-black"
                    rows="3"
                    placeholder="Bagikan pengalaman Anda..."
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setReviewModalOpen(false);
                      setError("");
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-4 py-2 bg-[#6d4c2c] text-white rounded-lg hover:bg-[#8b6d4c] transition-colors duration-200 disabled:opacity-50"
                  >
                    {submittingReview ? "Menyimpan..." : "Kirim Ulasan"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 