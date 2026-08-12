import { PlaceholderPage } from "../../../components/placeholder-page";

type AnalysisPageProps = {
  params: Promise<{ id: string }>;
};

/**
 * /decisions/[id]/analysis — Reasoning Analysis
 *
 * Server Component: reads the dynamic `id` route parameter and renders it
 * to confirm routing works. No AI or analysis logic is implemented yet.
 */
export default async function AnalysisPage({ params }: AnalysisPageProps) {
  const { id } = await params;

  return (
    <PlaceholderPage
      title="Reasoning Analysis"
      description="This page will surface the AI's reasoning about this decision: assumptions, missing information, contradictions, and trade-offs. No analysis is generated yet."
      detail={`Route parameter received: id = "${id}"`}
    />
  );
}
