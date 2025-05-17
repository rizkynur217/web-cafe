"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

const categories = [
  { label: "All", value: "ALL" },
  { label: "Main Course", value: "MAINCOURSE" },
  { label: "Coffee", value: "COFFEE" },
  { label: "non-Coffee", value: "NONCOFFEE" },
  { label: "Snack", value: "SNACK" },
  { label: "Dessert", value: "DESERT" },
];

export default function AdminMenuPage() {
  const [menus, setMenus] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "MAINCOURSE",
    price: "",
    image: null,
    imageUrl: "",
  });
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    fetchMenus();
  }, []);

  useEffect(() => {
    console.log('Data menu:', menus);
    console.log('Kategori aktif:', category);
  }, [menus, category]);

  async function fetchMenus() {
    try {
      const res = await fetch("/api/menu");
      if (!res.ok) {
        throw new Error('Failed to fetch menus');
      }
      const data = await res.json();
      setMenus(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching menus:', error);
      setMenus([]);
    }
  }

  function handleOpenForm() {
    setForm({ name: "", description: "", category: "MAINCOURSE", price: "", image: null, imageUrl: "" });
    setShowForm(true);
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setForm((f) => ({ ...f, image: file, imageUrl: URL.createObjectURL(file) }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("price", form.price);
      if (form.image) formData.append("image", form.image);
      if (form.id) {
        // Edit menu (PATCH)
        const res = await fetch(`/api/menu/${form.id}`, {
          method: "PATCH",
          body: formData,
        });
        if (res.ok) {
          setShowForm(false);
          fetchMenus();
        } else {
          const errMsg = await res.text();
          alert("Gagal mengedit menu: " + errMsg);
        }
      } else {
        // Tambah menu baru (POST)
        const res = await fetch("/api/menu", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          setShowForm(false);
          fetchMenus();
        } else {
          const errMsg = await res.text();
          alert("Gagal menambah menu: " + errMsg);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  // Toggle isAvailable (see/unsee)
  // async function handleToggleSee(menu) {
  //   await fetch(`/api/menu/${menu.id}`, {
  //     method: "PATCH",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ isAvailable: !menu.isAvailable }),
  //   });
  //   fetchMenus();
  // }

  // Delete menu
  async function handleDelete(menu) {
    if (!confirm(`Hapus menu "${menu.name}"?`)) return;
    await fetch(`/api/menu/${menu.id}`, { method: "DELETE" });
    fetchMenus();
  }

  // Edit menu
  function handleEdit(menu) {
    setForm({
      name: menu.name,
      description: menu.description,
      category: menu.category,
      price: menu.price,
      image: null,
      imageUrl: menu.imageUrl || "",
      id: menu.id,
    });
    setShowForm(true);
  }

  const filteredMenus = Array.isArray(menus)
    ? (category === "All"
        ? menus
        : menus.filter((m) => m.category === categories.find(cat => cat.label === category)?.value))
    : [];

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

  // Sidebar & Layout
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-56 bg-[#1C1C1C] text-white flex flex-col items-center py-8 rounded-r-3xl">
        <div className="mb-12 w-full">
          <div className="text-2xl font-bold text-center mb-8">Dashboard</div>
          <nav className="flex flex-col gap-4 px-6">
            <Link href="/admin" className="py-2 px-4 rounded-lg hover:bg-gray-800 transition text-lg font-medium">Dashboard</Link>
            <Link href="/admin/menu" className="py-2 px-4 rounded-lg bg-gray-800 text-white text-lg font-medium">Menu</Link>
            <Link href="/admin/history" className="py-2 px-4 rounded-lg hover:bg-gray-800 transition text-lg font-medium">History</Link>
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
          <h1 className="text-3xl font-bold text-black">Dashboard Admin</h1>
          <button onClick={handleOpenForm} className="bg-black text-white rounded-full px-8 py-3 font-semibold text-lg flex items-center gap-2 shadow hover:bg-gray-800 transition">
            <span className="text-2xl">+</span> Tambah Menu
          </button>
        </div>
        {/* Kategori menu */}
        <div className="flex gap-8 mb-8 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.label}
              className={`pb-2 px-4 text-lg font-semibold border-b-4 transition-all ${category === cat.label ? "border-black text-black" : "border-transparent text-gray-500 hover:text-black hover:border-black"}`}
              onClick={() => setCategory(cat.label)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        {/* Grid Menu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {filteredMenus.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 text-xl py-16">Tidak ada menu untuk kategori ini.</div>
          ) : (
            filteredMenus.map((item) => (
              <div key={item.id} className="bg-black rounded-2xl shadow-lg p-6 flex flex-col text-white min-h-[380px] w-full">
                <div className="flex flex-col items-center flex-1">
                  <div className="w-40 h-40 mb-4 relative bg-white/10 rounded-xl p-2">
                    <Image 
                      src={item.imageUrl || "/coffee-cup.png"} 
                      alt={item.name} 
                      fill 
                      style={{ objectFit: "contain" }} 
                      className="rounded-lg"
                    />
                  </div>
                  <div className="w-full text-center">
                    <h3 className="font-bold text-xl mb-2 text-white">{item.name}</h3>
                    <p className="text-white/90 text-sm mb-3 line-clamp-2 min-h-[40px]">{item.description}</p>
                    <div className="font-bold text-lg mb-3 text-white">Rp{Number(item.price).toLocaleString("id-ID")}</div>
                  </div>
                </div>
                <div className="flex gap-2 justify-center mt-4">
                  <button 
                    className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-all duration-300 ease-in-out" 
                    onClick={() => handleEdit(item)} 
                    type="button"
                  >
                    Edit
                  </button>
                  <button 
                    className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-all duration-300 ease-in-out" 
                    onClick={() => handleDelete(item)} 
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Form Tambah Menu */}
        {showForm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-full max-w-3xl shadow-lg relative flex flex-col min-h-[500px]">
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-4 bg-black rounded-t-xl">
                <button type="button" onClick={() => setShowForm(false)} className="text-white text-lg font-medium flex items-center gap-2 hover:text-gray-300 transition-colors">
                  <span className="text-2xl">←</span> Kembali
                </button>
                <h2 className="text-xl font-bold text-white">{form.id ? 'Edit Menu' : 'Tambah Menu'}</h2>
                <div className="w-24" /> {/* Spacer */}
              </div>
              {/* Konten dua kolom */}
              <div className="flex flex-1 gap-8 p-8">
                {/* Gambar */}
                <div className="flex flex-col items-center w-1/2">
                  <div className="w-56 h-56 relative rounded-xl overflow-hidden bg-gray-50 mb-4 border-2 border-dashed border-gray-300">
                    {form.imageUrl ? (
                      <Image src={form.imageUrl} alt="Preview" fill style={{ objectFit: "cover" }} className="rounded-lg" />
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
                        <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium">Pilih Gambar Menu</span>
                      </div>
                    )}
                  </div>
                  <label className="w-full">
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    <span className="block w-full py-3 px-4 rounded-lg bg-black text-white text-center font-medium cursor-pointer hover:bg-gray-800 transition-colors">
                      {form.imageUrl ? 'Ganti Gambar' : 'Upload Gambar'}
                    </span>
                  </label>
                </div>
                {/* submit */}
                <form onSubmit={handleSubmit} className="flex flex-col w-1/2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block font-semibold text-gray-800 mb-1.5">Nama Menu</label>
                      <input 
                        type="text" 
                        placeholder="Contoh: Cappuccino" 
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-black focus:ring-1 focus:ring-black transition-colors text-gray-800 placeholder-gray-400" 
                        value={form.name} 
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                        required 
                        readOnly={!!form.id}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-800 mb-1.5">Deskripsi</label>
                      <textarea 
                        placeholder="Deskripsi singkat menu" 
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-black focus:ring-1 focus:ring-black transition-colors text-gray-800 placeholder-gray-400" 
                        value={form.description} 
                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
                        required 
                        rows="3"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-800 mb-1.5">Kategori</label>
                      <select 
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-black focus:ring-1 focus:ring-black transition-colors text-gray-800" 
                        value={form.category} 
                        onChange={e => setForm(f => ({ ...f, category: e.target.value }))} 
                        required
                      >
                        {categories.filter(c => c.value !== "ALL").map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-800 mb-1.5">Harga</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Rp</span>
                        <input 
                          type="number" 
                          placeholder="0" 
                          className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-black focus:ring-1 focus:ring-black transition-colors text-gray-800 placeholder-gray-400" 
                          value={form.price} 
                          onChange={e => setForm(f => ({ ...f, price: e.target.value }))} 
                          required 
                          min={0}
                        />
                      </div>
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full py-3 rounded-lg bg-black text-white font-semibold shadow-lg hover:bg-gray-800 transition-colors mt-6 disabled:bg-gray-400" 
                    disabled={loading}
                  >
                    {loading ? "Menyimpan..." : "Simpan Menu"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 