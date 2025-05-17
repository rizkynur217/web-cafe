"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch('/api/reviews');
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    }

    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUserData(data);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      }
    }

    fetchReviews();
    checkAuth();
  }, []);

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

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#fafafa] pb-16">
      {/* Mobile Navigation */}
      <div className="fixed top-0 left-0 right-0 bg-white p-4 flex items-center justify-between md:hidden z-50">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="text-2xl text-[#6d4c2c]"
        >
          ☰
        </button>
        <h1 className="text-xl font-bold text-[#6d4c2c]">Reviews</h1>
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
      {isMenuOpen && (
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
            className="flex items-center gap-2 px-6 py-3 text-lg hover:bg-[#f7f5f2] transition"
          >
            <span className="text-2xl">📋</span> Menu
          </Link>
          <Link 
            href="/reviews" 
            className="flex items-center gap-2 px-6 py-3 text-lg hover:bg-[#f7f5f2] transition text-[#6d4c2c] font-bold bg-[#f7f5f2]"
          >
            <span className="text-2xl">⭐</span> Reviews
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
              <div className="w-10 h-10 rounded-full bg-[#6d4c2c] text-white flex items-center justify-center font-semibold">
                {getUserInitials(userData.name)}
              </div>
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
          Customer Reviews
        </h1>

        {/* Reviews Grid */}
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid gap-6">
            {reviews.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                Belum ada ulasan
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="bg-black rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                      <span className="text-2xl">👤</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-white">
                        {review.user?.name || 'Anonymous'}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {review.menuItem?.name || 'Unknown Menu'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">
                        {i < review.rating ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                  
                  {review.comment && (
                    <p className="text-gray-300 text-lg">
                      "{review.comment}"
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 