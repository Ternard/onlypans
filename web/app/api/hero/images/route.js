import { NextResponse } from "next/server";
import { payloadClient } from "@/lib/getPayload";

export async function GET() {
  const payload = await payloadClient();
  const { docs } = await payload.find({
    collection: "hero-images",
    where: {
      isActive: { equals: true },
    },
    sort: "displayOrder",
    limit: 100,
  });
  return NextResponse.json(docs);
}
