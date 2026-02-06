import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { SavedSite, SavedSiteSummary } from "@/app/types/builder";

const DATA_DIR = path.join(process.cwd(), "app/data/sites");
const INDEX_FILE = path.join(DATA_DIR, "index.json");

// Resend webhook event types
type ResendEventType =
  | "email.sent"
  | "email.delivered"
  | "email.bounced"
  | "email.complained"
  | "email.delivery_delayed"
  | "email.opened"
  | "email.clicked";

interface ResendWebhookEvent {
  type: ResendEventType;
  created_at: string;
  data: {
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    bounce?: {
      message: string;
      type: string;
    };
  };
}

async function readIndex(): Promise<SavedSiteSummary[]> {
  const data = await fs.readFile(INDEX_FILE, "utf-8");
  return JSON.parse(data);
}

async function writeIndex(index: SavedSiteSummary[]): Promise<void> {
  await fs.writeFile(INDEX_FILE, JSON.stringify(index, null, 2));
}

async function readSite(id: string): Promise<SavedSite> {
  const filePath = path.join(DATA_DIR, `${id}.json`);
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

async function updateSite(site: SavedSite): Promise<void> {
  const filePath = path.join(DATA_DIR, `${site.id}.json`);
  await fs.writeFile(filePath, JSON.stringify(site, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const event: ResendWebhookEvent = await request.json();

    console.log(`Resend webhook received: ${event.type}`, event.data.to);

    // Only process bounce and delivery events
    if (!["email.bounced", "email.delivered", "email.complained"].includes(event.type)) {
      return NextResponse.json({ received: true });
    }

    const recipientEmail = event.data.to[0];
    if (!recipientEmail) {
      return NextResponse.json({ received: true });
    }

    // Find the site by email
    const index = await readIndex();
    const siteEntry = index.find(
      (s) => s.studentInfo.email.toLowerCase() === recipientEmail.toLowerCase()
    );

    if (!siteEntry) {
      console.log(`No site found for email: ${recipientEmail}`);
      return NextResponse.json({ received: true });
    }

    // Update site with email status
    const site = await readSite(siteEntry.id);

    if (event.type === "email.bounced") {
      site.emailBounced = true;
      site.emailBouncedAt = event.created_at;
      site.emailBounceReason = event.data.bounce?.message || "Unknown reason";
      site.emailBounceType = event.data.bounce?.type || "unknown";

      siteEntry.emailBounced = true;
      siteEntry.emailBouncedAt = event.created_at;
      siteEntry.emailBounceReason = site.emailBounceReason;
    } else if (event.type === "email.delivered") {
      site.emailDelivered = true;
      site.emailDeliveredAt = event.created_at;

      siteEntry.emailDelivered = true;
      siteEntry.emailDeliveredAt = event.created_at;
    } else if (event.type === "email.complained") {
      site.emailComplained = true;
      site.emailComplainedAt = event.created_at;

      siteEntry.emailComplained = true;
      siteEntry.emailComplainedAt = event.created_at;
    }

    await updateSite(site);
    await writeIndex(index);

    console.log(`Updated site ${siteEntry.id} with ${event.type} status`);

    return NextResponse.json({ received: true, updated: siteEntry.id });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Resend may send a GET request to verify the webhook
export async function GET() {
  return NextResponse.json({ status: "Webhook endpoint active" });
}
