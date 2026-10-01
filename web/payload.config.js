import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import sharp from "sharp";

import { Users } from "./collections/Users.js";
import { Products } from "./collections/Products.js";
import { Orders } from "./collections/Orders.js";
import { CateringRequests } from "./collections/CateringRequests.js";
import { ContactMessages } from "./collections/ContactMessages.js";
import { Events } from "./collections/Events.js";
import { EventBookings } from "./collections/EventBookings.js";
import { HeroImages } from "./collections/HeroImages.js";
import { NewsletterSubscribers } from "./collections/NewsletterSubscribers.js";
import { SiteSettings } from "./collections/SiteSettings.js";
import { Media } from "./collections/Media.js";
import { Recipes } from "./collections/Recipes.js";
import { Gallery } from "./collections/Gallery.js";
import { Quotes } from "./collections/Quotes.js";
import { MenuItems } from "./collections/MenuItems.js";
import { Services } from "./collections/Services.js";

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET,
  admin: { user: Users.slug },
  collections: [
    Users,
    Products,
    Orders,
    CateringRequests,
    ContactMessages,
    Events,
    EventBookings,
    HeroImages,
    NewsletterSubscribers,
    SiteSettings,
    Media,
    Recipes,
    Gallery,
    Quotes,
    MenuItems,
    Services,
  ],
  // Uploads go to Vercel Blob when a token is set (production); locally they stay in ./media.
  plugins: [vercelBlobStorage({ enabled: !!process.env.BLOB_READ_WRITE_TOKEN, collections: { media: true }, token: process.env.BLOB_READ_WRITE_TOKEN })],
  editor: lexicalEditor(),
  sharp,
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL },
  }),
});
