"use client";

import Link from "next/link";
import { t } from "@/i18n";

interface ErrorPageProps {
  reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <section className="card-panel empty-state" role="alert">
      <h1 className="page-title">{t("errors.boundaryTitle")}</h1>
      <p className="muted">{t("errors.boundaryDescription")}</p>
      <div className="form-actions" style={{ justifyContent: "center" }}>
        <button type="button" className="btn btn-primary" onClick={reset}>
          {t("errors.retryButton")}
        </button>
        <Link href="/" className="btn">
          {t("header.backToList")}
        </Link>
      </div>
    </section>
  );
}
