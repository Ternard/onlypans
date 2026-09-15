import config from "@payload-config";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import "@payloadcms/next/css";
import { importMap } from "./admin/importMap";

const serverFunction = async (args) => {
  "use server";
  return handleServerFunctions({ ...args, config, importMap });
};

export default function PayloadRootLayout({ children }) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  );
}
