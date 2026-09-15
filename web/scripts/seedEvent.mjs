import { getPayload } from "payload";
import config from "../payload.config.js";

async function main() {
  const payload = await getPayload({ config });
  const { totalDocs } = await payload.find({ collection: "events", limit: 1 });
  if (totalDocs === 0) {
    await payload.create({
      collection: "events",
      data: {
        title: "Brisket & Blues Night",
        description: "Live music, all-you-can-eat brisket.",
        eventDate: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString(),
        venue: "Only Pans Backlot",
        ticketPrice: 25,
        brand: "only-pans",
        timeOptions: [
          { time: "6:00 PM", availableTickets: 40 },
          { time: "8:00 PM", availableTickets: 40 },
        ],
      },
    });
    console.log("Seeded sample event with time options");
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
