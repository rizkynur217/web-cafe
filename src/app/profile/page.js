"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    phone: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuthAndLoadProfile() {
      try {
        // Check authentication
        const authRes = await fetch('/api/auth/me');
        if (!authRes.ok) {
          router.push('/login');
          return;
        }

        const userData = await authRes.json();
        
        // Load profile data
        const profileRes = await fetch(`/api/users/${userData.id}`);
        if (profileRes.ok) {
          const data = await profileRes.json();
          setProfile({
            username: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            role: data.role || "",
          });
        } else {
          const error = await profileRes.json();
          setError(error.error || "Failed to load profile");
          console.error("Failed to load profile:", error);
        }
      } catch (e) {
        console.error("Error:", e);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    checkAuthAndLoadProfile();
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    
    // larangan untuk admin mengganti profilenya
    if (profile.role === "ADMIN") {
      setError("Admin tidak diperbolehkan mengubah profil");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      // Get current user ID
      const authRes = await fetch('/api/auth/me');
      if (!authRes.ok) {
        throw new Error('Not authenticated');
      }
      const userData = await authRes.json();

      // Update profile
      const res = await fetch(`/api/users/${userData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.username,
          email: profile.email,
          phone: profile.phone,
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Gagal memperbarui profil");
      } else {
        setSuccess(true);
        setProfile({
          username: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          role: data.role || "",
        });
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError("Gagal memperbarui profil");
    } finally {
      setSaving(false);
    }
  }

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
    return <div className="p-8 text-center text-black">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center">
      {/* Mobile Navigation */}
      <div className="fixed top-0 left-0 right-0 bg-white p-4 flex items-center justify-between md:hidden z-50">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="text-2xl text-[#6d4c2c]"
        >
          ☰
        </button>
        <h1 className="text-xl font-bold text-[#6d4c2c]">Profile Info</h1>
        {profile.username ? (
          <Link href="/profile" className="w-8 h-8 rounded-full bg-[#6d4c2c] text-white flex items-center justify-center font-semibold text-sm">
            {profile.username.split(' ').map(word => word[0]).join('').toUpperCase()}
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
            className="flex items-center gap-2 px-6 py-3 text-lg hover:bg-[#f7f5f2] transition text-[#6d4c2c] font-bold bg-[#f7f5f2]"
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
            href="/" 
            className="flex items-center gap-2 px-6 py-3 text-lg hover:bg-[#f7f5f2] transition"
          >
            <span className="text-2xl">🏠</span> Home
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-6 py-3 text-lg hover:bg-[#f7f5f2] transition text-red-600"
          >
            <span className="text-2xl">↩️</span> Logout
          </button>
        </div>
      )}

      {/* Desktop Sidebar - Hide on mobile */}
      <aside className="hidden md:flex w-56 bg-white rounded-xl shadow flex-col py-6 mr-8">
        <div>
          <div className="flex items-center gap-2 px-6 py-3 font-bold text-lg text-[#6d4c2c] bg-[#f7f5f2] rounded-t-xl">
            <span className="text-2xl">👤</span> Profile
          </div>
          <Link href="/profile/history" className="flex items-center gap-2 px-6 py-3 text-lg hover:bg-[#f7f5f2] transition">
            <span className="text-2xl">🕒</span> History Order
          </Link>
          <Link href="/menu" className="flex items-center gap-2 px-6 py-3 text-lg hover:bg-[#f7f5f2] transition">
            <span className="text-2xl">📋</span> Menu
          </Link>
          <Link href="/" className="flex items-center gap-2 px-6 py-3 text-lg hover:bg-[#f7f5f2] transition">
            <span className="text-2xl">🏠</span> Home
          </Link>
        </div>
        <div className="mt-auto px-6 py-3">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-lg text-[#6d4c2c] hover:underline"
          >
            <span className="text-2xl">↩️</span> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content - Add padding top for mobile */}
      <main className="flex-1 max-w-xl bg-white rounded-xl shadow p-8 mt-20 md:mt-0">
        <h1 className="text-3xl font-bold text-center mb-8 text-black">Profile Info</h1>
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg">
            Profile berhasil diperbarui!
          </div>
        )}
        {profile.role === "ADMIN" && (
          <div className="mb-6 p-4 bg-black text-white rounded-lg text-center">
            Admin tidak diperbolehkan mengubah profil
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block font-semibold mb-1 text-black">Username</label>
            <input
              type="text"
              name="username"
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black"
              value={profile.username}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              required
              disabled={profile.role === "ADMIN"}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-black">Email</label>
            <input
              type="email"
              name="email"
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              required
              disabled={profile.role === "ADMIN"}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-black">Number Phone</label>
            <input
              type="text"
              name="phone"
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="Contoh: 081234567890"
              disabled={profile.role === "ADMIN"}
            />
          </div>
          <div className="flex gap-4 mt-4">
            <Link href="/" className="flex-1 py-2 rounded bg-[#a89c8a] text-white font-semibold shadow hover:bg-[#6d4c2c] transition flex items-center justify-center gap-2">
              <span className="text-xl">↩️</span> Back
            </Link>
            {profile.role !== "ADMIN" && (
              <button 
                type="submit" 
                className="flex-1 py-2 rounded bg-black text-white font-semibold shadow hover:bg-gray-800 transition disabled:opacity-50"
                disabled={saving || profile.role === "ADMIN"}
              >
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
} 