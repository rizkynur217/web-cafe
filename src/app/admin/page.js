'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";

const STATUS_ORDER = ["PENDING", "PROCESSING", "COMPLETED", "CANCELLED"];
const STATUS_LABEL = {
  PENDING: "Menunggu",
  PROCESSING: "Berproses",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch dashboard data
    fetch('/api/admin/dashboard')
      .then(res => res.json())
      .then(data => {
        setStats(data.stats);
        setOrders(data.orders);
      })
      .catch(err => console.error('Error fetching dashboard data:', err));
  }, []);

  // Helper untuk format waktu
  function formatTime(date) {
    const d = new Date(date);
    return d.toLocaleTimeString("id-ID", { hour12: false });
  }

  // Handle status change
  async function handleStatusChange(orderId, newStatus) {
    try {
      const res = await fetch(`/api/order/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update status');
      }

      // Update orders list with new status
      if (newStatus === 'COMPLETED' || newStatus === 'CANCELLED') {
        setOrders(orders.filter(order => order.id !== orderId));
      } else {
        setOrders(orders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus }
            : order
        ));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert(error.message || 'Failed to update order status');
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-56 bg-[#1C1C1C] text-white flex flex-col items-center py-8 rounded-r-3xl">
        <div className="mb-12 w-full">
          <div className="text-2xl font-bold text-center mb-8">Dashboard</div>
          <nav className="flex flex-col gap-4 px-6">
            <Link href="/admin" className="py-2 px-4 rounded-lg bg-gray-800 text-white text-lg font-medium">Dashboard</Link>
            <Link href="/admin/menu" className="py-2 px-4 rounded-lg hover:bg-gray-800 transition text-lg font-medium">Menu</Link>
          </nav>
        </div>
        <div className="mt-auto w-full px-6">
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="w-full py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 transition text-white text-lg font-medium">
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content - Add margin left to account for fixed sidebar */}
      <main className="flex-1 p-8 ml-56">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black">Dashboard Admin</h1>
        </div>

        {/* Card statistik */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="bg-[#1C1C1C] rounded-2xl shadow-lg p-6 flex flex-col items-center text-white">
              <div className="text-gray-300 text-sm mb-2">{s.label}</div>
              <div className="text-2xl font-bold">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabel pesanan terbaru */}
        <div className="bg-[#1C1C1C] rounded-2xl shadow-lg p-6 text-white">
          <div className="text-xl font-semibold mb-4">Orderan Terbaru</div>
          <div className="relative">
            <div className="max-h-[400px] overflow-y-auto">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 bg-[#1C1C1C] z-10">
                  <tr className="border-b border-gray-700">
                    <th className="px-4 py-3 text-left">#</th>
                    <th className="px-4 py-3 text-left">Nama Pemesan</th>
                    <th className="px-4 py-3 text-center">Kuantitas</th>
                    <th className="px-4 py-3 text-right">Harga</th>
                    <th className="px-4 py-3 text-center">Waktu</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, i) => (
                    <tr key={o.id} className="border-b border-gray-700 hover:bg-gray-800/50">
                      <td className="px-4 py-3">{String(i + 1).padStart(2, "0")}</td>
                      <td className="px-4 py-3">{o.user?.name || o.user?.email || '-'}</td>
                      <td className="px-4 py-3 text-center">{o.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                      <td className="px-4 py-3 text-right">Rp{o.totalPrice.toLocaleString("id-ID")}</td>
                      <td className="px-4 py-3 text-center">{formatTime(o.createdAt)}</td>
                      <td className="px-4 py-3 text-center">
                        {o.status === "CANCELLED" ? (
                          <span className="text-red-500 font-semibold cursor-not-allowed">{STATUS_LABEL[o.status]}</span>
                        ) : (
                          <select
                            className="bg-[#1C1C1C] text-white border border-gray-700 rounded px-2 py-1 hover:border-gray-500 focus:outline-none focus:border-gray-400"
                            value={o.status}
                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          >
                            {STATUS_ORDER.map((status) => (
                              <option key={status} value={status}>
                                {STATUS_LABEL[status]}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 