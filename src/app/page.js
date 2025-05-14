import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import LogoutButton from "@/components/LogoutButton";

export default async function Home() {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("userId");
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white">
      {/* Background image with overlay */}
      <div className="absolute inset-0 -z-10 grayscale">
        <div className="absolute inset-0 bg-black/80 z-10"></div>
        <Image
          src="/bg.jpg"
          alt="Coffee Shop Background"
          fill
          style={{ objectFit: "cover" }}
          className="grayscale"
          priority
        />
      </div>

      {/* Top navigation */}
      <div className="absolute top-6 right-8 flex gap-3 z-10">
        {isLoggedIn ? (
          <>
            <Link href="/profile">
              <button className="px-5 py-2 rounded-full bg-white text-black font-medium shadow-lg hover:bg-gray-200 transition-all duration-300">Profile</button>
            </Link>
            <LogoutButton className="px-5 py-2 rounded-full bg-white text-black font-medium shadow-lg hover:bg-gray-200 transition-all duration-300" />
          </>
        ) : (
          <>
            <Link href="/register">
              <button className="px-5 py-2 rounded-full bg-white text-black font-medium shadow-lg hover:bg-gray-200 transition-all duration-300">Sign Up</button>
            </Link>
            <Link href="/login">
              <button className="px-5 py-2 rounded-full bg-white text-black font-medium shadow-lg hover:bg-gray-200 transition-all duration-300">Sign In</button>
            </Link>
          </>
        )}
      </div>

      {/* Main content */}
      <div className="w-full max-w-4xl px-4 flex flex-col items-center">
        {/* Navigation buttons */}
        <div className="w-full max-w-md flex flex-col gap-4 mb-12">
          <Link href="/menu">
            <button className="w-full py-4 rounded-xl bg-white text-black font-semibold shadow-lg hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-3 group">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="transform group-hover:scale-110 transition-transform duration-300">
                <path d="M2 21h19v-2H2v2zm6-4h12v-2H8v2zm-6-4h16v-2H2v2zm0-8v2h19V5H2z"/>
              </svg>
              <span className="text-lg">Menu</span>
            </button>
          </Link>
          <a
            href="https://instagram.com/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="w-full py-4 rounded-xl bg-white text-black font-semibold shadow-lg hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-3 group">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="transform group-hover:scale-110 transition-transform duration-300">
                <path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.3-1.1-.5-2.3-.5-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1zM19 12h2c0-4.9-4-8.9-9-8.9v2c3.9 0 7 3.1 7 6.9zm-4 0h2c0-2.8-2.2-5-5-5v2c1.7 0 3 1.3 3 3z"/>
              </svg>
              <span className="text-lg">Contact</span>
            </button>
          </a>
          <a
            href="https://maps.google.com/?q=Your+Coffee+Shop+Address"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="w-full py-4 rounded-xl bg-white text-black font-semibold shadow-lg hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-3 group">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="transform group-hover:scale-110 transition-transform duration-300">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span className="text-lg">Google Maps</span>
            </button>
          </a>
          <div className="w-full max-w-md md:max-w-2xl h-[2px] bg-white/20"></div>
          <div className="w-full max-w-md md:max-w-2xl h-[2px] bg-white/20"></div>
        </div>

        {/* Social media navigation */}
        <div className="flex gap-6 items-center justify-center mb-8">
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
            <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-110 overflow-hidden">
              <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </div>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-110 overflow-hidden">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.5 0h-9C3.4 0 0 3.4 0 7.5v9C0 20.6 3.4 24 7.5 24h9c4.1 0 7.5-3.4 7.5-7.5v-9C24 3.4 20.6 0 16.5 0zm5.1 16.5c0 2.8-2.3 5.1-5.1 5.1h-9c-2.8 0-5.1-2.3-5.1-5.1v-9C2.4 4.7 4.7 2.4 7.5 2.4h9c2.8 0 5.1 2.3 5.1 5.1v9z"/>
                <path d="M12 5.8c-3.4 0-6.2 2.8-6.2 6.2s2.8 6.2 6.2 6.2 6.2-2.8 6.2-6.2-2.8-6.2-6.2-6.2zm0 10c-2.1 0-3.8-1.7-3.8-3.8s1.7-3.8 3.8-3.8 3.8 1.7 3.8 3.8-1.7 3.8-3.8 3.8z"/>
                <circle cx="18.3" cy="5.7" r="1.5"/>
              </svg>
            </div>
          </a>
          <a href="mailto:your.email@example.com" target="_blank" rel="noopener noreferrer">
            <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-110 overflow-hidden">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
