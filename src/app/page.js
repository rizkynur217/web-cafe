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
            <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.425 3.678 1.406 2.697 2.387 2.403 3.499 2.344 4.78.013 8.332 0 8.741 0 12c0 3.259.013 3.668.072 4.948.059 1.281.353 2.393 1.334 3.374.981.981 2.093 1.275 3.374 1.334C8.332 23.987 8.741 24 12 24c3.259 0 3.668-.013 4.948-.072 1.281-.059 2.393-.353 3.374-1.334.981-.981 1.275-2.093 1.334-3.374.059-1.28.072-1.689.072-4.948 0-3.259-.013-3.668-.072-4.948-.059-1.281-.353-2.393-1.334-3.374-.981-.981-2.093-1.275-3.374-1.334C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
