import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Coursa — Learn Programming the Modern Way",
    template: "%s | Coursa",
  },
  description:
    "The modern platform for learning programming. High-quality courses, interactive lessons, and certificates — all in one place.",
  keywords: [
    "programming courses",
    "learn to code",
    "online education",
    "web development",
    "javascript",
    "python",
  ],
  openGraph: {
    title: "Coursa — Learn Programming the Modern Way",
    description:
      "The modern platform for learning programming. High-quality courses, interactive lessons, and certificates.",
    type: "website",
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                className:
                  "!bg-card !text-card-foreground !border !border-border",
              }}
            />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
