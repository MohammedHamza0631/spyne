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
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const car = await db.car.findUnique({ where: { id: params.id } });
    if (!car || car.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { title, description, images, carType, company, dealer, tags } =
      await req.json();

    const updatedCar = await db.car.update({
      where: { id: params.id },
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
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const car = await db.car.findUnique({ where: { id: params.id } });
    if (!car || car.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await db.car.delete({ where: { id: params.id } });

    return NextResponse.json({ message: "Car deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete car" },
      { status: 500 }
    );
  }
}
