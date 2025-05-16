"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

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

    fetchReviews();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#fafafa] pb-16">
      {/* Top Spacing */}
      <div className="h-6"></div>
      
      {/* Navbar */}
      <nav className="flex justify-center mt-8 mb-12">
        <div className="flex gap-8 bg-black border border-white rounded-full px-8 py-3 font-medium text-base shadow-lg">
          <Link href="/" className="text-white hover:text-gray-300 transition-colors relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-white hover:after:w-full after:transition-all">
            Home
          </Link>
          <span className="text-gray-600 select-none">|</span>
          <Link href="/menu" className="text-white hover:text-gray-300 transition-colors relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-white hover:after:w-full after:transition-all">
            Menu
          </Link>
          <span className="text-gray-600 select-none">|</span>
          <a href="#" className="text-white hover:text-gray-300 transition-colors relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-white hover:after:w-full after:transition-all">
            Contact
          </a>
        </div>
      </nav>

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
  );
} 