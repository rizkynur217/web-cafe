'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";

const STATUS_LABEL = {
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

export default function AdminHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // handler logout
  async function handleLogout() {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST'
      });
      if (res.ok) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  useEffect(() => {
    // Fetch completed dan cancelled order pelanggan
    fetch('/api/admin/history')
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching history data:', err);
        setLoading(false);
      });
  }, []);

  // format waktu
  function formatTime(date) {
    const d = new Date(date);
    return d.toLocaleTimeString("id-ID", { hour12: false });
  }

  // format tanggal
  function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString("id-ID", {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '/');
  }

  // format tanggal ke YYYY-MM-DD untuk input date
  function formatDateForInput(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  // Helper untuk parse tanggal dari format dd/mm/yyyy
  function parseDateString(dateString) {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-');
    return new Date(year, month - 1, day);
  }

  // Filter orders berdasarkan pencarian dan tanggal
  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    const formattedOrderDate = formatDateForInput(orderDate);
    
    // Filter berdasarkan nama/email pemesan
    const searchMatch = !searchQuery || 
      (order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()));

    // Filter berdasarkan tanggal
    const startDateObj = parseDateString(startDate);
    const endDateObj = parseDateString(endDate);
    const orderDateOnly = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());

    const dateMatch = (!startDateObj || orderDateOnly >= startDateObj) &&
                     (!endDateObj || orderDateOnly <= endDateObj);

    return searchMatch && dateMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex bg-gray-100">
        {/* Sidebar */}
        <aside className="fixed top-0 left-0 h-screen w-56 bg-[#1C1C1C] text-white flex flex-col items-center py-8 rounded-r-3xl">
          <div className="mb-12 w-full">
            <div className="text-2xl font-bold text-center mb-8">Dashboard</div>
            <nav className="flex flex-col gap-4 px-6">
              <Link href="/admin" className="py-2 px-4 rounded-lg hover:bg-gray-800 transition text-lg font-medium">Dashboard</Link>
              <Link href="/admin/menu" className="py-2 px-4 rounded-lg hover:bg-gray-800 transition text-lg font-medium">Menu</Link>
              <Link href="/admin/history" className="py-2 px-4 rounded-lg bg-gray-800 text-white text-lg font-medium">History</Link>
            </nav>
          </div>
          <div className="mt-auto w-full px-6">
            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 transition text-white text-lg font-medium"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 ml-56">
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-56 bg-[#1C1C1C] text-white flex flex-col items-center py-8 rounded-r-3xl">
        <div className="mb-12 w-full">
          <div className="text-2xl font-bold text-center mb-8">Dashboard</div>
          <nav className="flex flex-col gap-4 px-6">
            <Link href="/admin" className="py-2 px-4 rounded-lg hover:bg-gray-800 transition text-lg font-medium">Dashboard</Link>
            <Link href="/admin/menu" className="py-2 px-4 rounded-lg hover:bg-gray-800 transition text-lg font-medium">Menu</Link>
            <Link href="/admin/history" className="py-2 px-4 rounded-lg bg-gray-800 text-white text-lg font-medium">History</Link>
          </nav>
        </div>
        <div className="mt-auto w-full px-6">
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 transition text-white text-lg font-medium"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 ml-56">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black">History Pesanan</h1>
        </div>

        {/* filter */}
        <div className="bg-[#1C1C1C] rounded-2xl shadow-lg p-6 text-white mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Cari Pemesan</label>
              <input
                type="text"
                placeholder="Cari nama atau email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Tanggal Mulai</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tanggal Akhir</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Tabel history pesanan */}
        <div className="bg-[#1C1C1C] rounded-2xl shadow-lg p-6 text-white">
          <div className="text-xl font-semibold mb-4">Riwayat Pesanan Selesai & Dibatalkan</div>
          <div className="relative">
            <div className="max-h-[600px] overflow-y-auto">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 bg-[#1C1C1C] z-10">
                  <tr className="border-b border-gray-700">
                    <th className="px-4 py-3 text-left">#</th>
                    <th className="px-4 py-3 text-left">Nama Pemesan</th>
                    <th className="px-4 py-3 text-center">Kuantitas</th>
                    <th className="px-4 py-3 text-right">Harga</th>
                    <th className="px-4 py-3 text-center">Tanggal</th>
                    <th className="px-4 py-3 text-center">Waktu</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, i) => (
                    <tr key={order.id} className="border-b border-gray-700 hover:bg-gray-800/50">
                      <td className="px-4 py-3">{String(i + 1).padStart(2, "0")}</td>
                      <td className="px-4 py-3">{order.user?.name || order.user?.email || '-'}</td>
                      <td className="px-4 py-3 text-center">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                      <td className="px-4 py-3 text-right">Rp{order.totalPrice.toLocaleString("id-ID")}</td>
                      <td className="px-4 py-3 text-center">{formatDate(order.createdAt)}</td>
                      <td className="px-4 py-3 text-center">{formatTime(order.createdAt)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`font-semibold ${order.status === 'COMPLETED' ? 'text-green-500' : 'text-red-500'}`}>
                          {STATUS_LABEL[order.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-gray-400">
                        {searchQuery || startDate || endDate ? 'Tidak ada pesanan yang sesuai dengan filter' : 'Belum ada riwayat pesanan'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 