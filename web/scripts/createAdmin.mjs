import { getPayload } from "payload";
import config from "../payload.config.js";

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error("Usage: node scripts/createAdmin.mjs <email> <password>");
  process.exit(1);
}

async function main() {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({ collection: "users", where: { email: { equals: email } }, limit: 1 });
  if (docs.length) {
    console.log("User already exists");
  } else {
    await payload.create({ collection: "users", data: { email, password } });
    console.log("Admin user created:", email);
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
