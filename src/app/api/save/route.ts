import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET: Retrieve all saved colleges for the logged-in user
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in first." },
        { status: 401 }
      );
    }

    const savedColleges = await db.savedCollege.findMany({
      where: { userId: session.user.id },
      include: {
        college: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(
      { savedColleges: savedColleges.map((sc) => sc.college) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch saved colleges error:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved colleges" },
      { status: 500 }
    );
  }
}

// POST: Save/Unsave (toggle) a college for the logged-in user
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
    const { collegeId } = body;

    if (!collegeId) {
      return NextResponse.json(
        { error: "College ID is required" },
        { status: 400 }
      );
    }

    // Check if the college exists
    const collegeExists = await db.college.findUnique({
      where: { id: collegeId },
    });

    if (!collegeExists) {
      return NextResponse.json(
        { error: "College not found" },
        { status: 404 }
      );
    }

    // Check if already saved
    const existingSave = await db.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId: session.user.id,
          collegeId: collegeId,
        },
      },
    });

    if (existingSave) {
      // Unsave
      await db.savedCollege.delete({
        where: {
          userId_collegeId: {
            userId: session.user.id,
            collegeId: collegeId,
          },
        },
      });

      return NextResponse.json(
        { saved: false, message: "College removed from saved items" },
        { status: 200 }
      );
    } else {
      // Save
      await db.savedCollege.create({
        data: {
          userId: session.user.id,
          collegeId: collegeId,
        },
      });

      return NextResponse.json(
        { saved: true, message: "College added to saved items" },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Toggle saved college error:", error);
    return NextResponse.json(
      { error: "Failed to save or unsave college" },
      { status: 500 }
    );
  }
}
