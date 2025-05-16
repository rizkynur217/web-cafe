import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

// GET /api/reviews - Get all reviews or filter by menuItemId
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const menuItemId = searchParams.get('menuItemId');
    const orderId = searchParams.get('orderId');

    const where = {};
    if (menuItemId) where.menuItemId = parseInt(menuItemId);
    if (orderId) where.orderId = parseInt(orderId);

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
          },
        },
        menuItem: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Create a new review
export async function POST(request) {
  try {
    const session = await getSession(request);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { rating, comment, menuItemId, orderId } = data;

    // Validate required fields
    if (!rating || !menuItemId || !orderId) {
      return NextResponse.json(
        { error: 'Rating, menu item ID, and order ID are required' },
        { status: 400 }
      );
    }

    // Validate rating is between 1 and 5
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if order exists and belongs to user
    const order = await prisma.order.findUnique({
      where: { 
        id: parseInt(orderId)
      },
      include: {
        items: {
          where: { 
            menuItemId: parseInt(menuItemId)
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Not authorized to review this order' },
        { status: 403 }
      );
    }

    // Check if the menu item was actually in the order
    if (order.items.length === 0) {
      return NextResponse.json(
        { error: 'This menu item was not in the order' },
        { status: 400 }
      );
    }

    // Check if review already exists
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        menuItemId: parseInt(menuItemId),
        orderId: parseInt(orderId),
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this item for this order' },
        { status: 400 }
      );
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        comment: comment?.trim() || null,
        userId: session.user.id,
        menuItemId: parseInt(menuItemId),
        orderId: parseInt(orderId),
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        menuItem: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review: ' + error.message },
      { status: 500 }
    );
  }
} 