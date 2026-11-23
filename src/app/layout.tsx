import type { Metadata } from "next";
import Link from "next/link";
import { t } from "@/i18n";
import { TRPCProvider } from "@/trpc/Provider";
import "./globals.css";

export const metadata: Metadata = {
  title: t("meta.title"),
  description: t("meta.description"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TRPCProvider>
          <header className="app-header">
            <div className="container header-inner">
              <Link href="/">
                <p className="brand-title">{t("header.brand")}</p>
                <p className="brand-subtitle">{t("header.subtitle")}</p>
              </Link>
              <Link href="/tasks/new" className="btn btn-primary">
                {t("header.newTaskButton")}
              </Link>
            </div>
          </header>
          <main className="container main-content">{children}</main>
        </TRPCProvider>
      </body>
    </html>
  );
}
