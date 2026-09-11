// Local type matching the analyzeDecision tool's output shape. Defined
// here (rather than imported from the tool) so this component has no
// dependency on where or whether that file exists — it only needs the
// shape of the data it's given.
type DecisionAnalysisOption = {
  name: string;
  score: number;
  reasoning: string;
};

export type DecisionAnalysisResultData = {
  summary: string;
  options: DecisionAnalysisOption[];
  keyConsiderations: string[];
  risks: string[];
};

type DecisionAnalysisResultProps = {
  result: DecisionAnalysisResultData;
};

// Keeps the visual bar in range even if a score is ever slightly outside
// 0-100 (e.g. a rounding edge case upstream) — purely a rendering safety
// net, not a validation step.
function clampToPercent(score: number): number {
  return Math.min(100, Math.max(0, score));
}

/**
 * Renders the output of the analyzeDecision tool as a readable ThinkLens
 * card, instead of raw JSON. This component is presentational only: it
 * takes the already-computed result as a prop and displays it — no API
 * calls, no AI logic, no tool execution, and no internal state. That also
 * makes it safe to render from a Client Component (e.g. inside the chat)
 * without needing "use client" itself, since it has nothing interactive
 * going on.
 */
export function DecisionAnalysisResult({ result }: DecisionAnalysisResultProps) {
  const { summary, options, keyConsiderations, risks } = result;

  return (
    <div className="flex flex-col gap-5 rounded-lg border border-border bg-surface p-6">
      <h2 className="text-lg font-semibold text-foreground">Decision Analysis</h2>

      <p className="text-sm leading-6 text-foreground">{summary}</p>

      <div className="flex flex-col gap-3 border-t border-border pt-5">
        <h3 className="text-base font-semibold text-foreground">
          Option Comparison
        </h3>

        <div className="flex flex-col gap-3">
          {options.map((option) => {
            const percent = clampToPercent(option.score);

            return (
              <div
                key={option.name}
                className="flex flex-col gap-2 rounded-md border border-border p-4"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-medium text-foreground">
                    {option.name}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {option.score}/100
                  </span>
                </div>

                <div
                  role="progressbar"
                  aria-label={`${option.name} weighted score`}
                  aria-valuenow={percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="h-2 w-full overflow-hidden rounded-full bg-background"
                >
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <p className="text-sm text-muted">{option.reasoning}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-border pt-5">
        <h3 className="text-base font-semibold text-foreground">
          Key Considerations
        </h3>
        <ul className="list-disc space-y-1 pl-5 text-sm text-foreground">
          {keyConsiderations.map((consideration, index) => (
            <li key={index}>{consideration}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-2 border-t border-border pt-5">
        <h3 className="text-base font-semibold text-foreground">
          Risks &amp; Limitations
        </h3>
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
          {risks.map((risk, index) => (
            <li key={index}>{risk}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
