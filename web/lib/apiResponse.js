import { NextResponse } from "next/server";

export function apiResponse(success, message, data = null) {
  return NextResponse.json({ success, message, data });
}
