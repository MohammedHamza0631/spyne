import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// ✅ GET all cars (Global Search)
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  try {
    const cars = await db.car.findMany({
      where: query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
              { tags: { has: query } },
            ],
          }
        : {},
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(cars, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch cars" },
      { status: 500 }
    );
  }
}

// ✅ POST - Create a new car
export async function POST(req) {
  const { userId } = await auth();

  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { title, description, images, carType, company, dealer, tags } =
      await req.json();

    if (!title || !description || !images.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newCar = await db.car.create({
      data: {
        title,
        description,
        images,
        carType,
        company,
        dealer,
        tags,
        userId,
      },
    });

    return NextResponse.json(newCar, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create car" },
      { status: 500 }
    );
  }
}
