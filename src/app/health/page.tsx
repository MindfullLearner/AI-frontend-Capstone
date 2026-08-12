import { PlaceholderPage } from "../components/placeholder-page";

/**
 * /health — Health Check
 *
 * Server Component: static placeholder content only. This page will later
 * render fetched data to confirm the app is up and reachable.
 */
export default function HealthPage() {
  return (
    <PlaceholderPage
      title="Health Check"
      description="This page will confirm that ThinkLens is running correctly by rendering live status data. No data is fetched yet at this stage."
    />
  );
}
