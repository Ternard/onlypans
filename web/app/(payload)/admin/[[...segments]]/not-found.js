import config from "@payload-config";
import { NotFoundPage } from "@payloadcms/next/views";
import { importMap } from "../importMap";

export default function NotFound({ params, searchParams }) {
  return NotFoundPage({ config, params, searchParams, importMap });
}
