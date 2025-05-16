import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '../../../lib/session';

// POST /api/orders - Create a new order
export async function POST(request) {
    try {    
      const session = await getSession(request);
      console.log('Session:', session);
      
      // Check authentication
      if (!session?.user) {
        console.log('No user in session');
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
  
      const userId = session.user.id;
      console.log('User ID:', userId);
      
      const data = await request.json();
      console.log('Request body:', data);
      
      const { items, notes, paymentMethod } = data;
  
      // Validate request body
      if (!Array.isArray(items) || items.length === 0) {
        console.log('Missing or invalid items array');
        return NextResponse.json(
          { error: 'Data pesanan tidak lengkap' },
          { status: 400 }
        );
      }
  
      // Extract menu item IDs to fetch their prices
      const menuItemIds = items.map(item => Number(item.id));
      console.log('Menu item IDs:', menuItemIds);
  
      // Fetch menu items to get their prices
      const menuItems = await prisma.menuItem.findMany({
        where: {
          id: {
            in: menuItemIds,
          },
        },
      });
      
      console.log('Menu items found:', menuItems);
      
      if (menuItems.length === 0) {
        console.log('No menu items found');
        return NextResponse.json(
          { error: 'Menu items tidak ditemukan' },
          { status: 400 }
        );
      }
  
      // Calculate order total and create items array
      let totalPrice = 0;
      const orderItems = [];
  
      for (const item of items) {
        const menuItem = menuItems.find(mi => mi.id === Number(item.id));
        
        if (!menuItem) {
          console.log(`Menu item with ID ${item.id} not found`);
          return NextResponse.json(
            { error: `Menu item dengan ID ${item.id} tidak ditemukan` },
            { status: 400 }
          );
        }
  
        const quantity = Number(item.qty) || 1;
        const price = menuItem.price;
        totalPrice += price * quantity;
        
        orderItems.push({
          menuItemId: menuItem.id,
          quantity: quantity,
          price: price,
        });
      }
      
      console.log('Order items to create:', orderItems);
      console.log('Total price:', totalPrice);

      // Log the exact data we're sending to Prisma
      const orderData = {
        data: {
          userId: userId,
          totalPrice: totalPrice,
          status: 'PENDING',
          notes: notes || null,
          paymentMethod: paymentMethod || null,
          items: {
            create: orderItems
          }
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
      };
      console.log('Creating order with data:', JSON.stringify(orderData, null, 2));
  
      try {
        // Create the order in the database
        const order = await prisma.order.create(orderData);
        
        console.log('Order created successfully, order ID:', order.id);
        return NextResponse.json(order, { status: 201 });
      } catch (dbError) {
        // Log the full error details
        console.error('Database error creating order:', {
          error: dbError,
          message: dbError.message,
          code: dbError.code,
          meta: dbError.meta
        });
        return NextResponse.json(
          { error: 'Gagal membuat pesanan: ' + dbError.message },
          { status: 500 }
        );
      }
  
    } catch (error) {
      console.error('Error creating order:', {
        error: error,
        message: error.message,
        stack: error.stack
      });
      return NextResponse.json(
        { error: 'Gagal membuat pesanan: ' + error.message },
        { status: 500 }
      );
    }
  } 