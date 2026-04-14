import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import Nav from "@/components/shared/Nav";

export const metadata: Metadata = {
  title: "ShareBite — Smart Community Food Network",
  description: "Reduce food waste. Share surplus. Build community.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-page text-primary font-body min-h-screen">
        <div className="max-w-md mx-auto relative min-h-screen flex flex-col pb-24">
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
          <Nav />
        </div>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              fontFamily: "DM Sans, system-ui, sans-serif",
            },
          }}
        />
      </body>
    </html>
  );
}
