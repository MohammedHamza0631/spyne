import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// ✅ GET - Get a single car by ID
export async function GET(req, { params }) {
  try {
    const car = await db.car.findUnique({
      where: { id: params.id },
    });

    if (!car)
      return NextResponse.json({ error: "Car not found" }, { status: 404 });

    return NextResponse.json(car, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch car" }, { status: 500 });
  }
}

// ✅ PUT - Update a car
export async function PUT(req, { params }) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { title, description, images, tags } = await req.json();

    const existingCar = await db.car.findUnique({ where: { id: params.id } });

    if (!existingCar || existingCar.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized or Car not found" },
        { status: 403 }
      );
    }

    const updatedCar = await db.car.update({
      where: { id: params.id },
      data: { title, description, images, tags, updatedAt: new Date() },
    });

    return NextResponse.json(updatedCar, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update car" },
      { status: 500 }
    );
  }
}

// ✅ DELETE - Delete a car
export async function DELETE(req, { params }) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const existingCar = await db.car.findUnique({ where: { id: params.id } });

    if (!existingCar || existingCar.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized or Car not found" },
        { status: 403 }
      );
    }

    await db.car.delete({ where: { id: params.id } });

    return NextResponse.json(
      { message: "Car deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete car" },
      { status: 500 }
    );
  }
}
