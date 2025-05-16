import { Inter } from 'next/font/google'
import { Providers } from "./providers";
import "./globals.css";
import { cookies } from "next/headers";
import LogoutButton from "@/components/LogoutButton";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Web Cafe",
  description: "Web Cafe - Your favorite coffee shop",
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("userId");
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {/* Tombol logout demo di pojok kanan atas jika login */}
          {/* {isLoggedIn && <LogoutButton />} */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
