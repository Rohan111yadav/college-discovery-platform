import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Query parameters
    const search = searchParams.get("search") || "";
    const location = searchParams.get("location") || "";
    const minFees = parseFloat(searchParams.get("minFees") || "0");
    const maxFees = parseFloat(searchParams.get("maxFees") || "99999999");
    const minRating = parseFloat(searchParams.get("minRating") || "0");
    const sortBy = searchParams.get("sortBy") || "rating"; // rating, fees, name
    const sortOrder = searchParams.get("sortOrder") || "desc"; // asc, desc
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "6", 10);

    const skip = (page - 1) * limit;

    // Build filter clause
    const where: Prisma.CollegeWhereInput = {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search } },
                { location: { contains: search } },
                { description: { contains: search } },
              ],
            }
          : {},
        location
          ? {
              location: { contains: location },
            }
          : {},
        {
          fees: {
            gte: minFees,
            lte: maxFees,
          },
        },
        {
          rating: {
            gte: minRating,
          },
        },
      ],
    };

    // Build order clause
    let orderBy: Prisma.CollegeOrderByWithRelationInput = {};
    if (sortBy === "fees") {
      orderBy = { fees: sortOrder as Prisma.SortOrder };
    } else if (sortBy === "name") {
      orderBy = { name: sortOrder as Prisma.SortOrder };
    } else {
      orderBy = { rating: sortOrder as Prisma.SortOrder };
    }

    // Run parallel queries for total count and paginated colleges
    const [total, colleges] = await db.$transaction([
      db.college.count({ where }),
      db.college.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          _count: {
            select: { courses: true },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        colleges,
        pagination: {
          total,
          page,
          limit,
          totalPages,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch colleges API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch colleges" },
      { status: 500 }
    );
  }
}
