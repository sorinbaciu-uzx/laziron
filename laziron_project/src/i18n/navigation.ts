import { createNavigation } from "next-intl/navigation";
import { createElement, type ComponentProps } from "react";
import { routing } from "./routing";

/**
 * Locale-aware navigation helpers. Use these instead of next/link and
 * next/navigation so that the active locale prefix is handled automatically.
 */
const nav = createNavigation(routing);

export const { redirect, usePathname, useRouter, getPathname } = nav;

const BaseLink = nav.Link;
type LinkProps = ComponentProps<typeof BaseLink>;

/**
 * Locale-aware Link that opens in a new tab by default (site-wide requirement).
 * Pass `target="_self"` to override for in-page navigation.
 */
export function Link(props: LinkProps) {
  return createElement(BaseLink, {
    target: "_blank",
    rel: "noopener noreferrer",
    ...props,
  });
}
