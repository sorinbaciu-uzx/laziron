"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * Lightweight modal/dialog rendered through a portal on `document.body`.
 * Closes on Escape or backdrop click; locks body scroll while open. The
 * backdrop is a dark scrim — the only place on the site where dark is allowed
 * because a modal needs to focus the user on the panel.
 */
export function Modal({
  open,
  onClose,
  children,
  closeLabel = "Close",
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  closeLabel?: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/55 p-3 backdrop-blur-sm sm:items-center sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="absolute top-4 right-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 bg-white text-ink transition-colors hover:border-gold hover:text-gold-dark"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
