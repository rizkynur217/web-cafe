import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '../../../lib/session';

export async function POST(request) {
  try {
    const session = await getSession(request);
    
    // Check if user is admin
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { orderId, status } = data;

    // Validate input
    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Order ID and status are required' },
        { status: 400 }
      );
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: {
        id: Number(orderId)
      },
      data: {
        status: status
      },
      include: {
        items: {
          include: {
            menuItem: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
} 