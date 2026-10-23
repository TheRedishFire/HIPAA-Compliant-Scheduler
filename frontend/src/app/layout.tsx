import type { Metadata } from "next";
import "./globals.css";
import "@fontsource/roboto/index.css";
import "@fontsource/cormorant-garamond/index.css";

export const metadata: Metadata = {
  title: "Valentine Counseling",

};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white antialiased text-[#241f21]">{children}</body>
    </html>
  );
}