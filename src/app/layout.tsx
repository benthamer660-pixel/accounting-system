import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import "../styles/print.css";
import { MainLayout } from "@/components/layout/main-layout";
import { Toaster } from "react-hot-toast";
import { AppContextProvider } from "@/contexts/app-context";
import { SettingsProvider } from "@/contexts/settings-context";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "نظام المحاسبة - إدارة شاملة لأعمالك",
  description: "نظام محاسبي متكامل لإدارة المنتجات والعملاء والفواتير والمخزون",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} font-cairo antialiased`}>
        <SettingsProvider>
          <AppContextProvider>
            <MainLayout>
              {children}
            </MainLayout>
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </AppContextProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
