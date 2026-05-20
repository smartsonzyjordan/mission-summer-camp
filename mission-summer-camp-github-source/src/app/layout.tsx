import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { AppStateProvider } from "@/context/AppState";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mission Summer Camp: Galaxy Journey",
  description: "A galaxy-themed summer mission PWA for kids and parents.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Galaxy Journey"
  }
};

export const viewport: Viewport = {
  themeColor: "#171343",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppStateProvider>{children}</AppStateProvider>
      </body>
    </html>
  );
}
