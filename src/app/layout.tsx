import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "Qabeza AuthorityOS",
    template: "%s · Qabeza AuthorityOS"
  },
  description:
    "Turn one expert insight into credible LinkedIn posts, newsletters, carousel briefs, short-video scripts, and lead-generation assets.",
  openGraph: {
    title: "Qabeza AuthorityOS",
    description: "Turn expertise into demand—without publishing generic AI content.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
