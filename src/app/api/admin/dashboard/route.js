import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '../../../../lib/session';

export async function GET(request) {
  try {
    const session = await getSession(request);
    
    // Check if user is admin
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Query statistik dari database menggunakan OrderItem
    const totalItemsSold = await prisma.orderItem.aggregate({
      _sum: {
        quantity: true
      }
    });

    // Get all order items to calculate total revenue
    const orderItems = await prisma.orderItem.findMany({
      select: {
        quantity: true,
        price: true
      }
    });

    // Calculate total revenue by multiplying quantity with price for each item
    const totalRevenue = orderItems.reduce((sum, item) => {
      return sum + (item.quantity * item.price);
    }, 0);

    const jumlahPengguna = await prisma.user.count();
    const jumlahMenu = await prisma.menuItem.count();

    const stats = [
      { label: "Total Item Terjual", value: totalItemsSold._sum.quantity || 0 },
      { label: "Jumlah Pengguna", value: jumlahPengguna },
      { label: "Jumlah Menu", value: jumlahMenu },
      { label: "Total Revenue", value: `Rp${totalRevenue.toLocaleString("id-ID")}` },
    ];

    // Query order terbaru
    const orders = await prisma.order.findMany({
      where: {
        status: {
          notIn: ['COMPLETED', 'CANCELLED']
        }
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        items: true,
      },
      take: 10,
    });

    return NextResponse.json({ stats, orders });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
} 