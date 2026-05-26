import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET: Fetch all saved comparisons for the user, including the full college objects
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in first." },
        { status: 401 }
      );
    }

    const comparisons = await db.comparison.findMany({
      where: { userId: session.user.id },
      orderBy: { id: "desc" },
    });

    // For each comparison, fetch the full college data
    const richComparisons = await Promise.all(
      comparisons.map(async (comp) => {
        const collegeIdsArray = comp.collegeIds ? comp.collegeIds.split(",") : [];
        const colleges = await db.college.findMany({
          where: {
            id: { in: collegeIdsArray },
          },
          include: {
            courses: true,
          },
        });
        return {
          id: comp.id,
          collegeIds: collegeIdsArray,
          colleges: colleges,
        };
      })
    );

    return NextResponse.json({ comparisons: richComparisons }, { status: 200 });
  } catch (error) {
    console.error("Fetch comparisons error:", error);
    return NextResponse.json(
      { error: "Failed to fetch comparisons" },
      { status: 500 }
    );
  }
}

// POST: Save or update a college comparison list for the user
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in first." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { collegeIds } = body; // Array of strings (college IDs)

    if (!collegeIds || !Array.isArray(collegeIds) || collegeIds.length === 0) {
      return NextResponse.json(
        { error: "collegeIds array is required and cannot be empty" },
        { status: 400 }
      );
    }

    if (collegeIds.length > 3) {
      return NextResponse.json(
        { error: "You can compare up to 3 colleges side-by-side" },
        { status: 400 }
      );
    }

    // Verify all colleges in the list exist
    const collegesCount = await db.college.count({
      where: {
        id: { in: collegeIds },
      },
    });

    if (collegesCount !== collegeIds.length) {
      return NextResponse.json(
        { error: "One or more of the specified college IDs is invalid" },
        { status: 404 }
      );
    }

    // Create or update comparison list
    // Let's create a new saved comparison for the user
    const comparison = await db.comparison.create({
      data: {
        userId: session.user.id,
        collegeIds: collegeIds.join(","),
      },
    });

    return NextResponse.json(
      { message: "Comparison saved successfully", comparison },
      { status: 201 }
    );
  } catch (error) {
    console.error("Save comparison error:", error);
    return NextResponse.json(
      { error: "Failed to save comparison" },
      { status: 500 }
    );
  }
}
