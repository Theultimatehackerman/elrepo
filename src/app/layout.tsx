import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import { ThemeSync } from "@/components/layout/ThemeSync";
import { themeInitScript } from "@/lib/theme/init-script";
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
  title: "Content OS — Seu conteúdo, organizado do início ao fim",
  description:
    "Plataforma de organização e gestão de conteúdo para Social Medias, freelancers e pequenas agências.",
  icons: {
    icon: "/midialogo.png",
    shortcut: "/midialogo.png",
    apple: "/midialogo.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: o script abaixo altera <html data-theme style> antes da hidratação.
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeSync />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
