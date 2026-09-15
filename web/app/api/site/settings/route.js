import { NextResponse } from "next/server";
import { payloadClient } from "@/lib/getPayload";

export async function GET() {
  const payload = await payloadClient();
  const { docs } = await payload.find({ collection: "site-settings", limit: 1000 });
  const settings = {};
  for (const doc of docs) {
    settings[doc.settingKey] = doc.settingValue;
  }
  return NextResponse.json(settings);
}
