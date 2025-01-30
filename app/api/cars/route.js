import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// GET all cars (with global search)
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("q"); // Search keyword

    let cars;
    if (search) {
      cars = await db.car.findMany({
        where: {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { tags: { hasSome: [search] } },
          ],
        },
        include: { user: true },
        orderBy: { createdAt: "desc" },
      });
    } else {
      cars = await db.car.findMany({
        include: { user: true },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json(cars, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch cars" },
      { status: 500 }
    );
  }
}

// POST - Create a new car
export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Ensure user exists in Prisma DB
    let user = await db.user.findUnique({ where: { clerkUserId: userId } });

    // If user doesn't exist, create it
    if (!user) {
      return NextResponse.json(
        { error: "User does not exist in DB. Please relogin." },
        { status: 403 }
      );
    }
    const { title, description, images, carType, company, dealer, tags } =
      await req.json();

    const newCar = await db.car.create({
      data: {
        title,
        description,
        images: images.slice(0, 10), // Ensure max 10 images
        carType,
        company,
        dealer,
        tags,
        userId: user.id,
      },
    });

    return NextResponse.json(newCar, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to create car" },
      { status: 500 }
    );
  }
}
