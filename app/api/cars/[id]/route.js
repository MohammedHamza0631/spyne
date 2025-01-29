import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// GET a single car
export async function GET(req, { params }) {
  try {
    const car = await db.car.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    return NextResponse.json(car, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch car" }, { status: 500 });
  }
}

// UPDATE a car
export async function PUT(req, { params }) {
  const carParams = await params;
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Get the database user
    const user = await db.user.findUnique({
      where: { clerkUserId }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 403 });
    }

    // Find the car
    const car = await db.car.findUnique({ 
      where: { id: carParams.id } 
    });

    if (!car || car.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized Access" }, { status: 403 });
    }

    const { title, description, images, carType, company, dealer, tags } =
      await req.json();

    const updatedCar = await db.car.update({
      where: { id: carParams.id },
      data: { title, description, images, carType, company, dealer, tags },
    });

    return NextResponse.json(updatedCar, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update car" },
      { status: 500 }
    );
  }
}

// DELETE a car
export async function DELETE(req, { params }) {
  const carParams = await params;
  try {
    // Get clerk user ID
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Get the database user
    const user = await db.user.findUnique({
      where: { clerkUserId }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 403 });
    }

    // Find the car
    const car = await db.car.findUnique({ 
      where: { id: carParams.id }
    });

    // Check if car exists and belongs to user
    if (!car || car.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete the car
    await db.car.delete({ 
      where: { id: carParams.id }
    });

    return NextResponse.json({ message: "Car deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to delete car" },
      { status: 500 }
    );
  }
}