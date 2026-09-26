import type { Metadata } from "next";
import { Bricolage_Grotesque, Montserrat } from "next/font/google";
import { profile } from "@/data/profile";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const body = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const fullName = `${profile.firstName} ${profile.lastName}`;

export const metadata: Metadata = {
  title: fullName,
  description: `${fullName} — builder, explorer, and generalist. A new quest begins.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
