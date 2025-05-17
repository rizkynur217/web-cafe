import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import LogoutButton from "@/components/LogoutButton";

export default async function Home() {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("userId");
  return (
    <div className="relative min-h-screen flex flex-col bg-black text-white">
      {/* Background image with overlay */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-black/75 z-10"></div>
      </div>

      {/* Top navigation */}
      <nav className="sticky top-0 w-full bg-black/30 backdrop-blur-sm z-50 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">☕</span>
            <span className="text-xl font-bold">TARR CAFE</span>
          </Link>
          <div className="flex gap-3 w-full sm:w-auto justify-end">
            {isLoggedIn ? (
              <>
                <Link href="/profile" className="w-full sm:w-auto">
                  <button className="w-full px-5 py-2 rounded-full bg-white text-black font-medium shadow-lg hover:bg-gray-200 transition-all duration-300">Profile</button>
                </Link>
                <LogoutButton className="w-full px-5 py-2 rounded-full bg-white text-black font-medium shadow-lg hover:bg-gray-200 transition-all duration-300" />
              </>
            ) : (
              <>
                <Link href="/register" className="w-full sm:w-auto">
                  <button className="w-full px-5 py-2 rounded-full bg-white text-black font-medium shadow-lg hover:bg-gray-200 transition-all duration-300">Sign Up</button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <button className="w-full px-5 py-2 rounded-full bg-white text-black font-medium shadow-lg hover:bg-gray-200 transition-all duration-300">Sign In</button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[80vh] px-4 py-20">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-4">
              Mau Ngopi??
              <span className="block text-[#C8A27A] font-extrabold mt-2">TARR AJA!</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto opacity-90">
              Tempat yang sempurna untuk menikmati kopi berkualitas dengan suasana yang cozy dan nyaman
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 w-full max-w-md mx-auto">
            <Link href="/menu" className="w-full">
              <button className="w-full px-8 py-4 rounded-xl bg-[#C8A27A] text-white font-semibold shadow-lg hover:bg-[#b08d68] transition-all duration-300 flex items-center justify-center gap-3 group">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="transform group-hover:scale-110 transition-transform duration-300">
                  <path d="M2 21h19v-2H2v2zm6-4h12v-2H8v2zm-6-4h16v-2H2v2zm0-8v2h19V5H2z"/>
                </svg>
                <span className="text-lg">Lihat Menu</span>
              </button>
            </Link>
            <a href="#location" className="w-full">
              <button className="w-full px-8 py-4 rounded-xl border-2 border-[#C8A27A] text-[#C8A27A] font-semibold hover:bg-[#C8A27A] hover:text-white transition-all duration-300 flex items-center justify-center gap-3 group">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="transform group-hover:scale-110 transition-transform duration-300">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span className="text-lg">Lokasi Kami</span>
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 px-4 bg-black/40">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Quick Order */}
            <div className="bg-[#C8A27A]/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-[#C8A27A]/15 transition-all duration-300 border border-[#C8A27A]/20">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Pesan Cepat</h3>
              <p className="text-gray-300 mb-4">TARR! Langsung pesan kopi favoritmu dengan mudah</p>
              <Link href="/menu">
                <button className="text-[#C8A27A] hover:text-white transition-colors duration-300 font-medium">
                  Pesan Sekarang →
                </button>
              </Link>
            </div>
            
            {/* Special Menu */}
            <div className="bg-[#C8A27A]/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-[#C8A27A]/15 transition-all duration-300 border border-[#C8A27A]/20">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-semibold mb-2">Menu Spesial</h3>
              <p className="text-gray-300 mb-4">TARR! Temukan menu spesial dan signature drinks kami</p>
              <Link href="/menu">
                <button className="text-[#C8A27A] hover:text-white transition-colors duration-300 font-medium">
                  Lihat Special →
                </button>
              </Link>
            </div>
            
            {/* Membership */}
            <div className="bg-[#C8A27A]/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-[#C8A27A]/15 transition-all duration-300 border border-[#C8A27A]/20">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-semibold mb-2">Member TARR</h3>
              <p className="text-gray-300 mb-4">Gabung membership untuk dapatkan benefit spesial</p>
              <Link href="/register">
                <button className="text-[#C8A27A] hover:text-white transition-colors duration-300 font-medium">
                  Gabung Sekarang →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="location" className="py-20 px-4 bg-black/40">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-2">Kunjungi TARR CAFE</h2>
          <p className="text-[#C8A27A] text-lg mb-12">Tempat nongkrong asik dengan kopi berkualitas</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 text-left">
              <div>
                <h3 className="text-xl font-semibold mb-2">Alamat</h3>
                <p className="text-gray-300">123 Coffee Street, Jakarta, Indonesia</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Jam Buka</h3>
                <p className="text-gray-300">Senin - Minggu: 10:00 - 23:00 WIB</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Kontak</h3>
                <p className="text-gray-300">WhatsApp: 0812-3456-7890</p>
                <p className="text-gray-300">Email: hello@tarrcafe.com</p>
              </div>
              <div className="flex gap-4 pt-4">
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#C8A27A]/10 hover:bg-[#C8A27A] text-[#C8A27A] hover:text-white flex items-center justify-center transition-all duration-300">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#C8A27A]/10 hover:bg-[#C8A27A] text-[#C8A27A] hover:text-white flex items-center justify-center transition-all duration-300">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.5 0h-9C3.4 0 0 3.4 0 7.5v9C0 20.6 3.4 24 7.5 24h9c4.1 0 7.5-3.4 7.5-7.5v-9C24 3.4 20.6 0 16.5 0zm5.1 16.5c0 2.8-2.3 5.1-5.1 5.1h-9c-2.8 0-5.1-2.3-5.1-5.1v-9C2.4 4.7 4.7 2.4 7.5 2.4h9c2.8 0 5.1 2.3 5.1 5.1v9z"/>
                    <path d="M12 5.8c-3.4 0-6.2 2.8-6.2 6.2s2.8 6.2 6.2 6.2 6.2-2.8 6.2-6.2-2.8-6.2-6.2-6.2zm0 10c-2.1 0-3.8-1.7-3.8-3.8s1.7-3.8 3.8-3.8 3.8 1.7 3.8 3.8-1.7 3.8-3.8 3.8z"/>
                    <circle cx="18.3" cy="5.7" r="1.5"/>
                  </svg>
                </a>
                <a href="mailto:hello@tarrcafe.com" className="w-12 h-12 rounded-full bg-[#C8A27A]/10 hover:bg-[#C8A27A] text-[#C8A27A] hover:text-white flex items-center justify-center transition-all duration-300">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://i.pinimg.com/736x/f3/dc/d8/f3dcd86f78dc2708e3a75bc4aa77e65e.jpg"
                alt="TARR CAFE Store"
                fill
                style={{ objectFit: "cover" }}
                className="hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[#C8A27A]/20">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-400">
          <p>© 2024 TARR CAFE. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
