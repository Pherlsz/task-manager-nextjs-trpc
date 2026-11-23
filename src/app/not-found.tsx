import type { Metadata } from "next";
import Link from "next/link";
import { t } from "@/i18n";

export const metadata: Metadata = {
  title: t("meta.notFoundTitle"),
};

export default function NotFoundPage() {
  return (
    <section className="card-panel empty-state">
      <h1 className="page-title">{t("errors.pageNotFoundTitle")}</h1>
      <p className="muted">{t("errors.pageNotFoundDescription")}</p>
      <Link href="/" className="btn btn-primary">
        {t("header.backToList")}
      </Link>
    </section>
  );
}
