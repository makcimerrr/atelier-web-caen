import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { put } from "@vercel/blob";
import { SavedSite } from "@/app/types/builder";
import { generateHTML, wrapInDocument } from "@/app/lib/export/html-generator";
import { generateFullCSS } from "@/app/lib/export/css-generator";
import { generateJS, generateReadme } from "@/app/lib/export/js-generator";
import { generateZip, sanitizeFilename } from "@/app/lib/export/zip-generator";
import { readIndex, writeIndex, readSite, writeSite } from "@/app/lib/storage";

// Lazy init to avoid build errors when API key is not set
function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY not configured");
  }
  return new Resend(process.env.RESEND_API_KEY);
}

// Delay helper for rate limiting (Resend allows 2 requests/second)
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateEmailTemplate(studentName: string, siteName: string, downloadUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
  <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 24px;">
    <h1 style="color: white; margin: 0 0 8px 0; font-size: 28px;">Bravo ${studentName} !</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 16px;">Ton site "${siteName}" est pret !</p>
  </div>

  <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center;">
    <h2 style="margin: 0 0 16px 0; font-size: 18px; color: #1e293b;">Telecharge ton site</h2>
    <a href="${downloadUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">Telecharger le ZIP</a>
    <p style="margin: 16px 0 0 0; font-size: 12px; color: #94a3b8;">Ce lien reste disponible pendant 30 jours</p>
  </div>

  <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <h2 style="margin: 0 0 16px 0; font-size: 18px; color: #1e293b;">Contenu du ZIP</h2>
    <ul style="margin: 0; padding: 0; list-style: none;">
      <li style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center;">
        <span style="background: #dbeafe; color: #1d4ed8; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; margin-right: 12px;">HTML</span>
        <strong>index.html</strong> - La page principale
      </li>
      <li style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center;">
        <span style="background: #fce7f3; color: #be185d; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; margin-right: 12px;">CSS</span>
        <strong>styles.css</strong> - Les styles visuels
      </li>
      <li style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center;">
        <span style="background: #fef3c7; color: #b45309; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; margin-right: 12px;">JS</span>
        <strong>script.js</strong> - Les interactions
      </li>
      <li style="padding: 8px 0; display: flex; align-items: center;">
        <span style="background: #e2e8f0; color: #475569; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; margin-right: 12px;">TXT</span>
        <strong>README.txt</strong> - Les instructions
      </li>
    </ul>
  </div>

  <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <h2 style="margin: 0 0 16px 0; font-size: 18px; color: #1e293b;">Comment voir ton site ?</h2>
    <ol style="margin: 0; padding-left: 20px; color: #475569;">
      <li style="margin-bottom: 8px;">Telecharge et decompresse le fichier ZIP</li>
      <li style="margin-bottom: 8px;">Ouvre le dossier extrait</li>
      <li style="margin-bottom: 8px;">Double-clique sur <strong>index.html</strong></li>
      <li>Ton site s'ouvre dans ton navigateur !</li>
    </ol>
  </div>

  <div style="text-align: center; color: #64748b; font-size: 14px;">
    <p style="margin: 0 0 8px 0;">Felicitations pour ton travail lors de cet atelier !</p>
    <p style="margin: 0;">A bientot,<br><strong>L'equipe Atelier Web</strong></p>
  </div>
</body>
</html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const { siteIds } = await request.json();

    if (!siteIds || !Array.isArray(siteIds) || siteIds.length === 0) {
      return NextResponse.json(
        { error: "Aucun site selectionne" },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Cle API Resend non configuree" },
        { status: 500 }
      );
    }

    const results: { id: string; success: boolean; error?: string }[] = [];
    const index = await readIndex();

    for (let i = 0; i < siteIds.length; i++) {
      const siteId = siteIds[i];

      // Rate limiting: wait 600ms between emails (max ~1.6 requests/second to stay under limit)
      if (i > 0) {
        await delay(600);
      }

      try {
        // Load site data
        const site = await readSite(siteId);
        if (!site) {
          results.push({ id: siteId, success: false, error: "Site non trouve" });
          continue;
        }
        const studentName = `${site.studentInfo.prenom} ${site.studentInfo.nom}`;

        // Generate export files
        const { html: bodyHTML, usedClasses } = generateHTML(site.blocks, site.settings);
        const fullHTML = wrapInDocument(bodyHTML, site.settings);
        const css = generateFullCSS(usedClasses, site.settings);
        const js = generateJS();
        const readme = generateReadme(site.settings.siteName, studentName);

        // Generate ZIP
        const zipBuffer = await generateZip(
          fullHTML,
          css,
          js,
          readme,
          site.settings.siteName
        );

        const filename = `${sanitizeFilename(site.settings.siteName)}.zip`;

        // Upload ZIP to Vercel Blob
        const blob = await put(`exports/${siteId}/${filename}`, zipBuffer, {
          access: "public",
          addRandomSuffix: false,
          allowOverwrite: true,
        });

        const downloadUrl = blob.url;

        // Send email with download link (no attachment)
        const { error } = await getResend().emails.send({
          from: process.env.RESEND_FROM_EMAIL || "Atelier Web <onboarding@resend.dev>",
          to: site.studentInfo.email,
          subject: `Ton site "${site.settings.siteName}" est pret !`,
          html: generateEmailTemplate(studentName, site.settings.siteName, downloadUrl),
        });

        if (error) {
          console.error(`Error sending email to ${site.studentInfo.email}:`, error);
          results.push({ id: siteId, success: false, error: error.message });
        } else {
          // Update site with email sent status
          site.emailSent = true;
          site.emailSentAt = new Date().toISOString();
          await writeSite(site);

          // Update index
          const indexEntry = index.find((s) => s.id === siteId);
          if (indexEntry) {
            indexEntry.emailSent = true;
            indexEntry.emailSentAt = site.emailSentAt;
          }

          results.push({ id: siteId, success: true });
        }
      } catch (err) {
        console.error(`Error processing site ${siteId}:`, err);
        results.push({
          id: siteId,
          success: false,
          error: err instanceof Error ? err.message : "Erreur inconnue",
        });
      }
    }

    // Save updated index
    await writeIndex(index);

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;

    return NextResponse.json({
      message: `${successCount} email(s) envoye(s)${failCount > 0 ? `, ${failCount} echec(s)` : ""}`,
      results,
      successCount,
      failCount,
    });
  } catch (error) {
    console.error("Error in send-emails:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi des emails" },
      { status: 500 }
    );
  }
}
