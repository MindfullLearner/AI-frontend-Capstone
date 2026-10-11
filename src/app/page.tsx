import { PlaceholderPage } from "./components/placeholder-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ThinkLens Home",
  description: "Connect with ThinkLens to explore decisions and reasoning.",
};
/**
 * / — ThinkLens Home
 *
 * Server Component: static placeholder content only.
 */
export default function HomePage() {
  return (
    <PlaceholderPage
      title="ThinkLens Home"
      description="ThinkLens is an AI decision and reasoning companion. This landing page will introduce the product and guide you toward starting or reviewing a decision."
    />
  );
}
