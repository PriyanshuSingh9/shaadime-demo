import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const inquiry = await prisma.weddingInquiry.create({
      data: {
        p1name: body.p1name ?? "",
        p2name: body.p2name ?? "",
        email: body.email ?? "",
        phone: body.phone ?? "",
        community: body.community ?? "",
        city: body.city ?? "",
        weddingDate: body.weddingDate ?? null,
        guests: body.guests ?? "",
        venueType: body.venueType ?? "",
        budget: body.budget ?? 0,
        styles: body.styles ?? [],
        services: body.services ?? [],
        events: body.events ?? [],
        notes: body.notes ?? "",
        referral: body.referral ?? "",
      },
    });

    return NextResponse.json(
      { success: true, id: inquiry.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("[save-inquiry] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save inquiry" },
      { status: 500 }
    );
  }
}
