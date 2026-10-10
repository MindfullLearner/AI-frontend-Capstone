# ThinkLens — Generative UI, Tool Calling & Testing

## 📌 Project Overview

**ThinkLens** is an AI-powered decision and reasoning companion designed to help users structure decisions, analyze options, and understand the reasoning behind their choices.

This project includes a generative UI and tool-calling workflow powered by the Vercel AI SDK and Google Gemini. It also includes automated component tests, AI-tool validation tests, an end-to-end (E2E) test, and a GitHub Actions CI workflow.

The goal is to build a reliable AI-powered interface while applying software testing and continuous integration practices.

## 🎯 Project Objectives

* Integrate an AI assistant into a React-based application.
* Execute server-side decision analysis through an AI tool.
* Validate structured inputs using Zod.
* Render tool results as dedicated React components.
* Handle streaming, loading, success, and error states.
* Test components and validation logic with automated tests.
* Verify the primary chat workflow using Playwright.
* Run automated tests through GitHub Actions on pushes and pull requests.

## 🧠 Feature: Decision Analysis Tool

ThinkLens includes a server-side `analyzeDecision` tool that processes structured decision information, including:

* Decision details
* Available options
* Evaluation criteria and weights
* Scores for each option
* Constraints and considerations

The tool validates its input, calculates weighted scores, and returns structured analysis.

### Tool Output

The structured result can include:

* An overall decision summary
* Scores for individual options
* Reasoning for each option
* Key considerations
* Potential risks

The calculation is performed by server-side application logic rather than relying solely on free-form model-generated text.

## 🛠️ Technology Stack

* **Next.js**
* **React**
* **TypeScript**
* **Vercel AI SDK**
* **Google Gemini**
* **Zod**
* **Tailwind CSS**
* **React Markdown**
* **Vitest**
* **React Testing Library**
* **Playwright**
* **GitHub Actions**
* **Vercel**

## 📂 Important Files

### AI Configuration

`src/lib/ai/config.ts`

Contains the Gemini model configuration and ThinkLens system prompt.

### Server-Side Decision Analysis Tool

`src/lib/ai/tools/analyze-decision.ts`

Contains the Zod input schema, validation rules, decision-analysis logic, and structured tool output.

### Chat API

`src/app/api/chat/route.ts`

Responsible for receiving chat messages, calling the Gemini model, providing the decision-analysis tool, and streaming responses to the frontend.

### Chat Interface

`src/app/components/chat.tsx`

Handles streaming assistant messages, tool-call lifecycle states, Markdown rendering, decision-analysis results, errors, and chat interactions.

### Decision Analysis Result Component

`src/app/components/decision-analysis-result.tsx`

Displays the structured analysis as a readable React component rather than raw JSON.

### Decision Setup Form

`src/app/components/decision-setup-form.tsx`

Provides the decision setup form, validates required information, and displays a structured preview of the entered decision.

### Testing Files

* `src/app/components/chat.test.tsx` — chat component tests
* `src/app/components/decision-analysis-result.test.tsx` — decision-analysis result rendering test
* `src/app/components/decision-setup-form.test.tsx` — decision setup form validation and preview tests
* `src/lib/ai/tools/analyze-decision.test.ts` — decision-analysis schema validation tests
* `e2e/chat.spec.ts` — Playwright end-to-end test

### CI Workflow

`.github/workflows/ci.yml`

Defines the GitHub Actions workflow that installs dependencies, runs the automated test suite, installs the Playwright browser, and runs the E2E tests.

## 🔄 Tool-Calling Workflow

The AI can request the server-side decision-analysis tool when appropriate.

```text
User Message
     ↓
Gemini Model
     ↓
Tool Call
     ↓
analyzeDecision
     ↓
Validated Structured Result
     ↓
DecisionAnalysisResult Component
     ↓
Assistant Follow-Up Response
```

The chat interface represents tool execution through dedicated UI states instead of exposing raw tool data to the user.

### Tool Lifecycle States

1. **Input streaming:** Displays a message while the model prepares the tool input.
2. **Input available:** Indicates that decision analysis is being processed.
3. **Output available:** Renders the structured result using `DecisionAnalysisResult`.
4. **Output error:** Displays an error message if the tool execution fails.

The API also allows the model to continue its response after receiving the tool result.

## 🧪 Testing Strategy

Testing focuses on component behavior, input validation, tool output, and the primary user workflow.

### 1. Component Testing

Vitest and React Testing Library are used to test React components.

The tests cover chat rendering and interaction states, decision-analysis result rendering, and the decision setup form's validation and preview behavior.

Tests use accessible queries where practical, such as roles and labels, to verify user-visible behavior.

### 2. Decision-Analysis Validation Testing

The decision-analysis tests verify the tool's input schema and validation rules, including invalid or incomplete structured data.

### 3. API Mocking

The Playwright E2E test intercepts the chat API request and returns a controlled response. This allows the primary chat workflow to be tested without making a real AI API request.

### 4. End-to-End Testing

The Playwright test exercises the primary chat flow through the browser.

### 5. Continuous Integration

The GitHub Actions workflow runs on pushes and pull requests. It installs dependencies, executes the Vitest suite, installs the Chromium browser, and runs Playwright tests.

This helps detect regressions before changes are considered ready to merge.

## ✅ Verification Results

The following checks have passed locally:

| Check                       | Result          |
| --------------------------- | --------------- |
| Vitest automated test suite | 25 tests passed |
| ESLint                      | Passed          |
| Production build            | Passed          |
| Playwright E2E test         | Passed locally  |
| Latest GitHub Actions run   | Green           |

The latest GitHub Actions run was also checked on GitHub and showed a successful status for the recent commit.

> **Note:** A passing workflow does not automatically mean branch protection is enabled. Required status checks must be configured separately if merges need to be blocked when CI fails.

## ▶️ Running the Project Locally

### Prerequisites

* Node.js
* npm
* Git

### Installation

```bash
git clone https://github.com/MindfullLearner/AI-frontend-Capstone.git
cd AI-frontend-Capstone
npm ci
```

Configure the required environment variables in a local `.env.local` file according to the project's AI configuration. Do not commit API keys or other secrets.

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### Run Automated Tests

Run the complete Vitest suite:

```bash
npm test
```

Run the lint check:

```bash
npm run lint
```

Check TypeScript:

```bash
npx tsc --noEmit
```

Build the production application:

```bash
npm run build
```

Run the Playwright E2E tests:

```bash
npx playwright test
```

If Playwright's required browser is not installed locally, install it first:

```bash
npx playwright install chromium
```

## 🌐 Preview Deployment

The Generative UI and Tool Calling feature was deployed to Vercel and manually tested using the following preview URL:

[Open ThinkLens Preview](https://ai-frontend-capstone-govoqmcaf-learner-eea1.vercel.app)

The manual verification covered opening Chat, sending a decision-related prompt, triggering the analysis tool, checking its lifecycle states, viewing the result component, and checking the assistant's follow-up response.

## 💡 Key Design Decisions

### Server-Side Decision Analysis

The AI determines when the analysis tool is useful, while server-side logic validates the input and performs deterministic calculations.

### Runtime Validation with Zod

Zod provides runtime validation for structured tool input, helping prevent invalid data from being processed silently.

### Dedicated UI for Tool Results

The `DecisionAnalysisResult` component transforms structured output into a readable interface instead of displaying raw JSON.

### Mocked API Responses in Tests

Mocking the chat API makes automated tests more predictable and avoids depending on a live AI service for every test run.

### Automated CI Checks

GitHub Actions runs the test suite and E2E workflow on pushes and pull requests, providing repeatable verification of changes.

## 📚 Key Learning Outcomes

Through this project, I practised:

* Integrating AI tools into a React application.
* Defining typed schemas with Zod.
* Validating structured input and tool output.
* Handling streaming and tool-call lifecycle states.
* Rendering AI tool results as dedicated UI components.
* Testing components with Vitest and React Testing Library.
* Testing a browser workflow with Playwright.
* Mocking API responses for reliable tests.
* Running automated checks with GitHub Actions.
* Verifying changes through linting, TypeScript checks, and production builds.
* Deploying and manually verifying an AI-powered feature.

## 🚀 Future Improvements

* Add charts for comparing decision options.
* Add more decision-analysis tools.
* Allow users to edit and save analysis results.
* Improve decision history and persistence.
* Add additional E2E scenarios for error handling and form validation.
* Configure required CI status checks before merging.

## 👩‍💻 Project Information

**Project:** ThinkLens — AI Decision & Reasoning Companion
**Repository:** [MindfullLearner/AI-frontend-Capstone](https://github.com/MindfullLearner/AI-frontend-Capstone)
**Internship:** FlyRank AI Frontend Engineering Internship

### Related Feature Work

* Generative UI and server-side tool calling
* Automated testing and continuous integration
* Decision setup form validation and preview
