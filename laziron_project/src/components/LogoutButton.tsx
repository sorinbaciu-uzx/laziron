"use client";

import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

export function LogoutButton({ className }: { className?: string }) {
  const t = useTranslations("Auth");
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className={
        className ??
        "rounded-md border border-ink/15 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-gold hover:text-gold-dark"
      }
    >
      {t("logout")}
    </button>
  );
}
