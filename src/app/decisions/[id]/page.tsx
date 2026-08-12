import { PlaceholderPage } from "../../components/placeholder-page";

type DecisionPageProps = {
  params: Promise<{ id: string }>;
};

/**
 * /decisions/[id] — Decision Workspace
 *
 * Server Component: reads the dynamic `id` route parameter and renders it
 * to confirm routing works, without fetching or displaying any real
 * decision data yet.
 */
export default async function DecisionPage({ params }: DecisionPageProps) {
  const { id } = await params;

  return (
    <PlaceholderPage
      title="Decision Workspace"
      description="This page will be the workspace for a single decision: its details, options, and structure. No decision data is loaded yet."
      detail={`Route parameter received: id = "${id}"`}
    />
  );
}
