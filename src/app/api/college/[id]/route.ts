import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "College ID is required" },
        { status: 400 }
      );
    }

    const college = await db.college.findUnique({
      where: { id },
      include: {
        courses: {
          orderBy: {
            fees: "asc",
          },
        },
      },
    });

    if (!college) {
      return NextResponse.json(
        { error: "College not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ college }, { status: 200 });
  } catch (error) {
    console.error("Fetch college detail API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch college details" },
      { status: 500 }
    );
  }
}
