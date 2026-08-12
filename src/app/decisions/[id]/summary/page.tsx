import { PlaceholderPage } from "../../../components/placeholder-page";

type SummaryPageProps = {
  params: Promise<{ id: string }>;
};

/**
 * /decisions/[id]/summary — Decision Summary
 *
 * Server Component: reads the dynamic `id` route parameter and renders it
 * to confirm routing works. No summary logic is implemented yet.
 */
export default async function SummaryPage({ params }: SummaryPageProps) {
  const { id } = await params;

  return (
    <PlaceholderPage
      title="Decision Summary"
      description="This page will present a structured summary of the decision once it has been worked through. No summary is generated yet."
      detail={`Route parameter received: id = "${id}"`}
    />
  );
}
