"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const PAYMENT_METHODS = [
  { label: "Qris", value: "qris" },
  { label: "Cash", value: "cash" },
  { label: "Debit", value: "debit" },
];

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [payment, setPayment] = useState(PAYMENT_METHODS[0].value);
  const [notes, setNotes] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Ambil cart dari localStorage
    const cartData = typeof window !== "undefined" ? localStorage.getItem("cart") : null;
    if (cartData) setCart(JSON.parse(cartData));
  }, []);

  const productTotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  const discount = 0; 
  const fee = 0;
  const total = productTotal - discount + fee;

  async function handleOrder() {
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          totalPrice: cart.reduce((sum, item) => sum + item.qty * item.price, 0),
          notes,
          paymentMethod: payment,
        }),
      });
      if (res.ok) {
        localStorage.removeItem("cart");
        router.push("/profile/history");
      } else {
        const err = await res.json();
        alert("Gagal membuat pesanan: " + (err.error || "Unknown error"));
      }
    } catch (error) {
      alert("Gagal membuat pesanan: " + error.message);
    }
  }

  function handleEdit() {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
      localStorage.setItem("isEditing", "true");
    }
    router.push("/menu");
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      {/* Header */}
      <div className="bg-black text-white px-8 py-5 flex items-center shadow-md">
        <button onClick={() => router.back()} className="text-2xl mr-4 hover:text-gray-300 transition-colors">←</button>
        <span className="text-xl font-semibold">Checkout</span>
      </div>
      {/* Konten dua kolom */}
      <div className="flex flex-1 flex-col md:flex-row gap-8 p-8 max-w-5xl mx-auto w-full">
        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex-1 min-w-[300px] border border-gray-100">
          <div className="font-bold text-xl mb-6 text-black">Order Summary</div>
          <div className="flex flex-col gap-6 mb-8">
            {cart.length === 0 && <div className="text-gray-400">Keranjang kosong</div>}
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b border-gray-100 pb-4">
                <div className="w-16 h-16 relative">
                  <Image src={item.imageUrl || "/coffee-cup.png"} alt={item.name} fill style={{ objectFit: "cover" }} className="rounded-xl" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-black">{item.name}</div>
                  <div className="text-gray-600 mt-1">Rp{item.price.toLocaleString("id-ID")} × {item.qty} pcs</div>
                </div>
                <div className="font-bold text-black">Rp{(item.price * item.qty).toLocaleString("id-ID")}</div>
              </div>
            ))}
          </div>
          <div className="mb-3 font-medium text-black">Add Notes</div>
          <input
            type="text"
            className="border border-gray-300 rounded-lg px-4 py-3 w-full mb-2 text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
            placeholder="Special requests or notes for your order"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>
        {/* Payment Method & Ringkasan */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex-1 min-w-[300px] flex flex-col gap-8 border border-gray-100">
          <div>
            <div className="font-bold text-xl mb-4 text-black">Payment Method</div>
            <select
              className="border border-gray-300 rounded-lg px-4 py-3 w-full text-black bg-white focus:outline-none focus:border-black transition-colors cursor-pointer"
              value={payment}
              onChange={e => setPayment(e.target.value)}
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-3 text-base">
            <div className="flex justify-between text-black"><span>Product total</span><span>Rp{productTotal.toLocaleString("id-ID")}</span></div>
            <div className="flex justify-between text-gray-600"><span>Discount</span><span>Rp{discount.toLocaleString("id-ID")}</span></div>
            <div className="flex justify-between text-gray-600"><span>Fee</span><span>{fee === 0 ? "Free" : `Rp${fee.toLocaleString("id-ID")}`}</span></div>
            <div className="h-px bg-gray-200 my-2"></div>
            <div className="flex justify-between font-bold text-lg text-black"><span>Total</span><span>Rp{total.toLocaleString("id-ID")}</span></div>
          </div>
          <div className="flex gap-4 mt-auto">
            <button 
              onClick={handleEdit} 
              className="flex-1 py-3 px-6 rounded-lg border-2 border-black text-black font-semibold hover:bg-black hover:text-white transition-colors"
            >
              Edit Order
            </button>
            <button 
              onClick={handleOrder} 
              className="flex-1 py-3 px-6 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition-colors"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 