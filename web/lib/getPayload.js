import { getPayload } from "payload";
import config from "@payload-config";

let cached;

export async function payloadClient() {
  if (!cached) {
    cached = await getPayload({ config });
  }
  return cached;
}
