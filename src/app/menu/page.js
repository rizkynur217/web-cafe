"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const categories = [
  { label: "All", value: "ALL" },
  { label: "Main Course", value: "MAINCOURSE" },
  { label: "Coffee", value: "COFFEE" },
  { label: "non-Coffee", value: "NONCOFFEE" },
  { label: "Snack", value: "SNACK" },
  { label: "Dessert", value: "DESERT" },
];

function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("ALL");
  const [cart, setCart] = useState([]); // ambil {id, name, price, qty}
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch("/api/menu");
        if (!res.ok) throw new Error("Failed to fetch menu");
        const data = await res.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();

    // authentication
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(true);
          setIsAdmin(data.role === "ADMIN");
          setUserData(data); // Save user data
          
          if (typeof window !== "undefined" && data.role !== "ADMIN") {
            const isEditing = localStorage.getItem("isEditing");
            if (isEditing) {
              const cartData = localStorage.getItem("cart");
              if (cartData) {
                setCart(JSON.parse(cartData));
              }
              localStorage.removeItem("isEditing");
            } else {
              const pendingCart = localStorage.getItem("pendingCart");
              if (pendingCart) {
                setCart(JSON.parse(pendingCart));
                localStorage.removeItem("pendingCart");
              }
            }
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      }
    }
    checkAuth();
  }, []);

  useEffect(() => {
    let timeoutId;
    if (error) {
      setShowError(true);
      timeoutId = setTimeout(() => {
        setShowError(false);
        setTimeout(() => {
          setError("");
        }, 300);
      }, 6000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [error]);

  const filteredMenus = category === "ALL"
    ? menuItems
    : menuItems.filter((item) => item.category === category);

  // Tambah (+) ke keranjang
  function addToCart(item) {
    setError("");
    
    if (!isAuthenticated) {
      const currentCart = [...cart];
      if (typeof window !== "undefined") {
        localStorage.setItem("pendingCart", JSON.stringify(currentCart));
      }
      router.push("/login");
      return;
    }

    if (isAdmin) {
      setError("Admin tidak diperbolehkan melakukan pemesanan");
      return;
    }

    setCart((prev) => {
      const exist = prev.find((c) => c.id === item.id);
      if (exist) {
        return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      } else {
        return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }];
      }
    });
  }

  // Kurangi (-) dari keranjang
  function removeFromCart(item) {
    if (isAdmin) {
      setError("Admin tidak diperbolehkan melakukan pemesanan");
      return;
    }

    setCart((prev) => {
      const exist = prev.find((c) => c.id === item.id);
      if (exist && exist.qty > 1) {
        return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty - 1 } : c);
      } else {
        return prev.filter((c) => c.id !== item.id);
      }
    });
  }

  // Ambil quantity menu tertentu di cart
  function getQty(id) {
    const found = cart.find((c) => c.id === id);
    return found ? found.qty : 0;
  }

  // Hitung total kuantitas dan harga
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  // Navigasi ke checkout
  function goToCheckout() {
    if (cart.length > 0) {
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(cart));
      }
      router.push("/menu/checkout");
    }
  }

  // Get user initials
  const getUserInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST'
      });
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#fafafa] pb-32">
      {/* Error  */}
      {error && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-8 py-4 rounded-lg shadow-lg z-50 transition-all duration-300 ${
          showError ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          {error}
        </div>
      )}

      {/* Mobile Navigation */}
      <div className="fixed top-0 left-0 right-0 bg-white p-4 flex items-center justify-between md:hidden z-50">
        <button 
          onClick={() => setIsNavOpen(!isNavOpen)} 
          className="text-2xl text-[#6d4c2c]"
        >
          ☰
        </button>
        <h1 className="text-xl font-bold text-[#6d4c2c]">Our Menu</h1>
        {userData ? (
          <Link href="/profile" className="w-8 h-8 rounded-full bg-[#6d4c2c] text-white flex items-center justify-center font-semibold text-sm">
            {getUserInitials(userData.name)}
          </Link>
        ) : (
          <Link href="/login" className="text-[#6d4c2c]">
            👤
          </Link>
        )}
      </div>

      {/* Mobile Dropdown Menu */}
      {isNavOpen && (
        <div className="fixed top-16 left-0 right-0 bg-white shadow-lg z-40 md:hidden">
          <Link 
            href="/profile" 
            className="flex items-center gap-2 px-6 py-3 text-lg hover:bg-[#f7f5f2] transition"
          >
            <span className="text-2xl">👤</span> Profile
          </Link>
          <Link 
            href="/profile/history" 
            className="flex items-center gap-2 px-6 py-3 text-lg hover:bg-[#f7f5f2] transition"
          >
            <span className="text-2xl">🕒</span> History Order
          </Link>
          <Link 
            href="/menu" 
            className="flex items-center gap-2 px-6 py-3 text-lg hover:bg-[#f7f5f2] transition text-[#6d4c2c] font-bold bg-[#f7f5f2]"
          >
            <span className="text-2xl">📋</span> Menu
          </Link>
          <Link 
            href="/" 
            className="flex items-center gap-2 px-6 py-3 text-lg hover:bg-[#f7f5f2] transition"
          >
            <span className="text-2xl">🏠</span> Home
          </Link>
          {userData && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-6 py-3 text-lg hover:bg-[#f7f5f2] transition text-red-600"
            >
              <span className="text-2xl">↩️</span> Logout
            </button>
          )}
        </div>
      )}

      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-between items-center max-w-7xl mx-auto px-8 py-6">
        <div className="flex-1"></div>
        <div className="bg-black rounded-2xl px-8 py-3 font-medium text-base shadow-lg">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-white hover:text-gray-300 transition-colors">
              Home
            </Link>
            <Link href="/menu" className="text-white hover:text-gray-300 transition-colors">
              Menu
            </Link>
            <Link href="/profile/history" className="text-white hover:text-gray-300 transition-colors">
              History
            </Link>
            <Link href="/profile" className="text-white hover:text-gray-300 transition-colors">
              Profile
            </Link>
          </div>
        </div>
        <div className="flex-1 flex justify-end">
          {userData ? (
            <div className="flex items-center gap-4">
              <Link href="/profile">
                <div className="w-10 h-10 rounded-full bg-[#6d4c2c] text-white flex items-center justify-center font-semibold cursor-pointer hover:opacity-80 transition">
                  {getUserInitials(userData.name)}
                </div>
              </Link>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="bg-black rounded-xl px-4 py-2 text-white hover:bg-gray-800 transition-colors shadow-lg"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mt-20 md:mt-0">
        {/* Judul */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-16 text-black">
          Our Best & Special Menu
        </h1>

        {/* Kategori */}
        <div className="flex justify-center gap-6 mb-8 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.value}
              className={`pb-1 px-2 text-lg font-medium border-b-2 transition-all ${category === cat.value ? "border-black text-black" : "border-transparent text-gray-500 hover:text-black hover:border-black"}`}
              onClick={() => setCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        {/* Grid Menu */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 max-w-7xl mx-auto mb-16 px-4 sm:px-8">
          {filteredMenus.length === 0 && (
            <div className="col-span-full text-center text-gray-400 text-xl py-16">Tidak ada menu tersedia</div>
          )}
          {filteredMenus.map((item) => {
            const qty = getQty(item.id);
            return (
              <div key={item.id} className="bg-black rounded-xl shadow-lg p-5 flex items-center min-h-[160px]">
                {/* Content wrapper - horizontal layout for both mobile and desktop */}
                <div className="flex-1 flex items-center gap-4">
                  {/* Text content - left side */}
                  <div className="flex-1">
                    <div className="font-bold text-lg sm:text-xl mb-2 text-white">{item.name}</div>
                    <div className="text-gray-400 text-sm mb-3 line-clamp-2">{item.description}</div>
                    <div className="font-bold text-base sm:text-lg text-white">Rp{Number(item.price).toLocaleString("id-ID")}</div>
                  </div>

                  {/* Image and buttons */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 relative rounded-xl overflow-hidden bg-white/10">
                      <Image 
                        src={item.imageUrl || "/coffee-cup.png"} 
                        alt={item.name} 
                        fill 
                        style={{ objectFit: "cover" }} 
                        className="rounded-xl"
                      />
                    </div>
                    <div className="flex items-center justify-center gap-3 bg-white/10 rounded-full p-1">
                      <button
                        className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-xl font-bold shadow hover:bg-gray-200 transition disabled:opacity-50"
                        onClick={() => removeFromCart(item)}
                        aria-label="Kurangi dari keranjang"
                        type="button"
                        disabled={qty === 0}
                      >
                        -
                      </button>
                      {qty > 0 && (
                        <span className="font-bold text-lg w-6 text-center text-white">{qty}</span>
                      )}
                      <button
                        className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-xl font-bold shadow hover:bg-gray-200 transition"
                        onClick={() => addToCart(item)}
                        aria-label="Tambah ke keranjang"
                        type="button"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* Pop up keranjang */}
        {totalQty > 0 && (
          <div className="fixed left-1/2 -translate-x-1/2 bottom-8 bg-[#2d2323] text-white rounded-full px-8 py-3 flex items-center gap-12 shadow-lg text-lg font-semibold z-20 min-w-[320px]">
            <span>{totalQty} item</span>
            <span>{totalPrice.toLocaleString("id-ID")}</span>
            <button onClick={goToCheckout} className="text-2xl focus:outline-none" aria-label="Checkout">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61l1.38-7.39H6"/></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MenuPage; 