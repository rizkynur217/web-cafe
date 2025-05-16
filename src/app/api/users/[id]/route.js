import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

// GET a specific user by ID
export async function GET(request, { params }) {
    try {
      const session = await getSession(request);
      if (!session?.user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      const id = parseInt(params.id);
      
      if (isNaN(id)) {
        return NextResponse.json(
          { error: 'Invalid ID format' },
          { status: 400 }
        );
      }

      // Only allow users to view their own profile or admin to view any profile
      if (session.user.id !== id && session.user.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Not authorized to view this profile' },
          { status: 403 }
        );
      }
      
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          createdAt: true
        }
      });
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      return NextResponse.json(
        { error: 'Error fetching user' },
        { status: 500 }
      );
    }
}

// UPDATE a user
export async function PUT(request, { params }) {
    try {
        const session = await getSession(request);
        if (!session?.user) {
          return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
          );
        }

        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid ID format' },
                { status: 400 }
            );
        }

        // Only allow users to update their own profile or admin to update any profile
        if (session.user.id !== id && session.user.role !== 'ADMIN') {
          return NextResponse.json(
            { error: 'Not authorized to update this profile' },
            { status: 403 }
          );
        }

        const data = await request.json();

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id }
        });

        if (!existingUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // If email is being changed, check if it's already taken
        if (data.email && data.email !== existingUser.email) {
          const emailExists = await prisma.user.findUnique({
            where: { email: data.email }
          });
          if (emailExists) {
            return NextResponse.json(
              { error: 'Email already in use' },
              { status: 400 }
            );
          }
        }

        // Prepare update data
        const updateData = {
            name: data.name,
            email: data.email,
            phone: data.phone
        };

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                createdAt: true
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json(
            { error: 'Error updating user: ' + error.message },
            { status: 500 }
        );
    }
}

// DELETE a user
export async function DELETE(request, { params }) {
    try {
        const session = await getSession(request);
        if (!session?.user) {
          return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
          );
        }

        // Only admin can delete users
        if (session.user.role !== 'ADMIN') {
          return NextResponse.json(
            { error: 'Only administrators can delete users' },
            { status: 403 }
          );
        }

        const id = parseInt(params.id);
        if (isNaN(id)) {
          return NextResponse.json(
            { error: 'Invalid ID format' },
            { status: 400 }
          );
        }

        const deletedUser = await prisma.user.delete({
            where: { id }
        });
        return NextResponse.json(deletedUser);
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
          { error: 'Failed to delete user: ' + error.message },
          { status: 500 }
        );
    }
}
