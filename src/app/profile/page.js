"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session?.user?.id) {
      async function fetchProfile() {
        try {
          const res = await fetch(`/api/users/${session.user.id}`);
          if (res.ok) {
            const data = await res.json();
            setProfile({
              username: data.name || "",
              email: data.email || "",
              phone: data.phone || "",
            });
          } else {
            const error = await res.json();
            setError(error.error || "Failed to load profile");
            console.error("Failed to load profile:", error);
          }
        } catch (e) {
          setError("Failed to load profile");
          console.error("Error loading profile:", e);
        } finally {
          setLoading(false);
        }
      }
      fetchProfile();
    }
  }, [status, session, router]);

  function handleChange(e) {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setError("");
    setSuccess(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!session?.user?.id) return;
    
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch(`/api/users/${session.user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.username || "",
          email: profile.email || "",
          phone: profile.phone || null,
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
        });
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError("Gagal memperbarui profil");
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading" || loading) {
    return <div className="p-8 text-center text-black">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center">
      {/* Sidebar */}
      <aside className="w-56 bg-white rounded-xl shadow flex flex-col py-6 mr-8">
        <div>
          <div className="flex items-center gap-2 px-6 py-3 font-bold text-lg text-[#6d4c2c] bg-[#f7f5f2] rounded-t-xl">
            <span className="text-2xl">👤</span> Profile
          </div>
          <Link href="/profile/history" className="flex items-center gap-2 px-6 py-3 text-lg hover:bg-[#f7f5f2] transition">
            <span className="text-2xl">🕒</span> History Order
          </Link>
        </div>
        <div className="mt-auto px-6 py-3">
          <button 
            onClick={() => signOut()}
            className="flex items-center gap-2 text-lg text-[#6d4c2c] hover:underline"
          >
            <span className="text-2xl">↩️</span> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="bg-white rounded-xl shadow p-10 w-full max-w-xl">
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block font-semibold mb-1 text-black">Username</label>
            <input
              type="text"
              name="username"
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black"
              value={profile.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-black">Email</label>
            <input
              type="email"
              name="email"
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black"
              value={profile.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-black">Number Phone</label>
            <input
              type="text"
              name="phone"
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black"
              value={profile.phone}
              onChange={handleChange}
              placeholder="Contoh: 081234567890"
            />
          </div>
          <div className="flex gap-4 mt-4">
            <Link href="/" className="flex-1 py-2 rounded bg-[#a89c8a] text-white font-semibold shadow hover:bg-[#6d4c2c] transition flex items-center justify-center gap-2">
              <span className="text-xl">↩️</span> Back
            </Link>
            <button 
              type="submit" 
              className="flex-1 py-2 rounded bg-black text-white font-semibold shadow hover:bg-gray-800 transition disabled:opacity-50"
              disabled={saving || status !== "authenticated"}
            >
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
} 