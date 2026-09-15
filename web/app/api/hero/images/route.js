import { NextResponse } from "next/server";
import { payloadClient } from "@/lib/getPayload";

export async function GET(request) {
  const brand = new URL(request.url).searchParams.get("brand");
  const payload = await payloadClient();
  const { docs } = await payload.find({
    collection: "hero-images",
    where: {
      isActive: { equals: true },
      ...(brand ? { brand: { equals: brand } } : {}),
    },
    sort: "displayOrder",
    limit: 100,
  });
  return NextResponse.json(docs);
}
