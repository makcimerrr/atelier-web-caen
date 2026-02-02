import type { Metadata } from "next";
import { Inter, Space_Grotesk, Poppins, Roboto_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Zone01 Site Builder - Crée ton site web",
  description: "Atelier de découverte du développement web - Construis ton premier site en quelques minutes !",
  keywords: ["zone01", "atelier", "web", "développement", "site builder", "éducation"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${spaceGrotesk.variable} ${poppins.variable} ${robotoMono.variable}`}>
      <body className="font-sans antialiased bg-slate-50 text-slate-900 overflow-hidden">
        {children}
      </body>
    </html>
  );
}
