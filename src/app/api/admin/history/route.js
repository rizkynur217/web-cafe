import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

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

    // Query completed and cancelled orders
    const orders = await prisma.order.findMany({
      where: {
        status: {
          in: ['COMPLETED', 'CANCELLED']
        }
      },
      orderBy: { 
        createdAt: 'desc' 
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        items: true
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching history data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history data' },
      { status: 500 }
    );
  }
} 