"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton({ className }) {
  const router = useRouter();

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", { 
        method: "POST",
        redirect: 'manual'
      });
      window.location.href = '/';
    } catch (error) {
      console.error('Error during logout:', error);
      window.location.href = '/';
    }
  }

  return (
    <button onClick={handleLogout} className={className}>
      Logout
    </button>
  );
} 