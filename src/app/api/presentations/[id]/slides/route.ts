import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      type,
      title,
      content,
      backgroundColor,
      textColor,
      timerDuration,
      sessionKey,
      imageUrl,
      notes,
    } = body;

    // Get the highest order number
    const lastSlide = await prisma.presentationSlide.findFirst({
      where: { presentationId: params.id },
      orderBy: { order: "desc" },
    });

    const nextOrder = lastSlide ? lastSlide.order + 1 : 0;

    const slide = await prisma.presentationSlide.create({
      data: {
        presentationId: params.id,
        order: nextOrder,
        type,
        title,
        content,
        backgroundColor,
        textColor,
        timerDuration,
        sessionKey,
        imageUrl,
        notes,
      },
    });

    return NextResponse.json(slide);
  } catch (error) {
    console.error("Error creating slide:", error);
    return NextResponse.json(
      { error: "Failed to create slide" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { slides } = body;

    // Update slide orders in a transaction
    await prisma.$transaction(
      slides.map((slide: any, index: number) =>
        prisma.presentationSlide.update({
          where: { id: slide.id },
          data: { order: index },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering slides:", error);
    return NextResponse.json(
      { error: "Failed to reorder slides" },
      { status: 500 }
    );
  }
}
