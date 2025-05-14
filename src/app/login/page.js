"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Email dan password wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal login.");
      } else {
        // Cek role user dari response
        if (data.user && data.user.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 md:p-8">
        <Link href="/" className="inline-flex items-center text-black hover:bg-gray-100 px-3 py-2 rounded-lg transition-all duration-200 mb-4 group">
          <span className="transform group-hover:-translate-x-1 transition-transform duration-200">&lt;</span>
          <span className="ml-1 font-medium">Homepage</span>
        </Link>
        <h1 className="text-2xl font-bold mb-1 text-black">Masuk</h1>
        <p className="mb-6 text-sm text-black">Masukkan email dan password anda untuk melakukan login</p>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder-gray-500"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            disabled={loading}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder-gray-500"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            disabled={loading}
          />
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <button type="submit" className="w-full py-2 mt-2 rounded bg-black text-white font-semibold shadow hover:bg-gray-800 transition" disabled={loading}>{loading ? "Masuk..." : "Masuk"}</button>
        </form>
        <div className="text-center mt-4 text-sm text-black">
          Belum memiliki akun?{' '}
          <Link href="/register" className="text-black font-medium hover:underline">Daftar</Link>
        </div>
      </div>
    </div>
  );
} 