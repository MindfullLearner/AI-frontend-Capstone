# ThinkLens — Generative UI & Tool Calling

## 📌 Assignment Overview

This assignment adds a **generative UI and tool-calling workflow** to ThinkLens, an AI decision and reasoning companion.

The goal was to move beyond a basic streaming chatbot by allowing the AI to call a **server-side decision analysis tool**, process structured decision data, and display the tool's result as a dedicated UI component.

The implementation uses the **Vercel AI SDK**, Google Gemini, Zod schemas, and React components.

---

## 🎯 Assignment Objectives

This implementation covers the following requirements:

- Add at least one server-side AI tool.
- Define the tool using a typed Zod schema.
- Execute the tool on the server.
- Handle different tool-call lifecycle states.
- Render tool states as dedicated UI instead of raw JSON.
- Display the tool result using a real React component.
- Handle failed tool execution with a designed error state.
- Allow the AI to continue its response after receiving the tool result.
- Deploy and test the complete workflow.

---

## 🧠 Feature: Decision Analysis Tool

ThinkLens includes a server-side `analyzeDecision` tool.

The AI can use this tool when a user's decision contains structured information such as:

- Decision
- Options
- Criteria
- Criterion weights
- Scores for each option
- Constraints and considerations

The tool validates the input, calculates weighted scores, and returns structured analysis.

### Tool Output

The tool produces:

- Overall decision summary
- Score for each option
- Reasoning for each option
- Key considerations
- Potential risks

The calculation is performed deterministically by the server-side tool rather than being generated as arbitrary text by the model.

---

## 🛠️ Technology Stack

- **Next.js**
- **React**
- **TypeScript**
- **Vercel AI SDK**
- **Google Gemini**
- **Zod**
- **Tailwind CSS**
- **React Markdown**

---

## 📂 Important Files

### AI Configuration

```text
src/lib/ai/config.ts
```

Contains:

- Gemini model configuration
- ThinkLens system prompt

### Server-Side Tool

```text
src/lib/ai/tools/analyze-decision.ts
```

Contains:

- Zod input schema
- Input validation
- Decision analysis logic
- Structured tool output

### Chat API

```text
src/app/api/chat/route.ts
```

Responsible for:

- Receiving chat messages
- Converting UI messages to model messages
- Calling the Gemini model
- Providing the `analyzeDecision` tool
- Streaming the response back to the frontend
- Allowing a follow-up model step after the tool execution

### Tool Result Component

```text
src/app/components/decision-analysis-result.tsx
```

Displays the structured decision analysis as a dedicated UI component.

### Chat Interface

```text
src/app/components/chat.tsx
```

Handles:

- Streaming assistant messages
- Tool lifecycle states
- Markdown rendering
- Decision analysis result rendering
- Tool execution errors
- Auto-scroll behavior
- Stop/thinking states

### Navigation

```text
src/app/components/navbar.tsx
```

Includes a direct **Chat** navigation link so users can access the AI interface without manually entering `/chat`.

---

## 🔄 Tool Calling Lifecycle

The frontend handles the tool lifecycle using typed tool parts.

### 1. Input Streaming

When the model begins preparing the tool input, the interface displays:

> Preparing decision analysis...

This indicates that the tool input is still being streamed.

---

### 2. Input Available

Once the complete tool input is available, the interface displays:

> Analyzing your decision...

This indicates that the server-side tool is being executed.

---

### 3. Output Available

After successful execution, the tool result is rendered using the:

```text
DecisionAnalysisResult
```

React component.

The result includes visual elements such as:

- Decision summary
- Option scores
- Score indicators
- Reasoning
- Key considerations
- Risks

The tool result is therefore presented as a meaningful UI rather than a raw JSON object.

---

### 4. Output Error

If the tool execution fails, the interface displays a dedicated error state:

> Decision analysis failed: ...

The error is visually separated from normal assistant messages so users can understand that the tool operation failed.

---

## 🔁 Multi-Step Tool Execution

The chat API allows the model to perform a second step after the tool executes.

The workflow is:

```text
User Message
     ↓
Gemini
     ↓
Tool Call
     ↓
analyzeDecision
     ↓
Structured Tool Result
     ↓
Gemini reads result
     ↓
Final Assistant Response
```

This allows ThinkLens to both display the structured analysis component and continue with a natural-language explanation based on the tool result.

---

## 🧪 Validation & Testing

The implementation was tested locally and on the deployed Preview environment.

### Manual Tests

| Test | Result |
|---|---|
| Open Chat from navbar | ✅ Pass |
| Send normal chat message | ✅ Pass |
| Trigger decision analysis | ✅ Pass |
| Tool input streaming state | ✅ Pass |
| Tool input available state | ✅ Pass |
| Tool result component | ✅ Pass |
| Assistant continues after tool result | ✅ Pass |
| Tool execution error state | ✅ Pass |
| Mobile/responsive chat interface | ✅ Pass |
| Production/Preview deployment | ✅ Pass |

### Code Validation

The project was also checked using:

```bash
npm run lint
```

```bash
npx tsc --noEmit
```

```bash
npm run build
```

All three completed successfully.

---

## 🌐 Preview Deployment

The completed feature was deployed using Vercel.

**Preview URL:**

[Open ThinkLens Preview](https://ai-frontend-capstone-govoqmcaf-learner-eea1.vercel.app)

The deployed version was manually tested by:

1. Opening the ThinkLens application.
2. Navigating to Chat using the navbar.
3. Sending a decision-related prompt.
4. Triggering the `analyzeDecision` tool.
5. Verifying the tool lifecycle UI.
6. Verifying the Decision Analysis component.
7. Verifying the final assistant response.

---

## 💡 Design Decisions

### Why use a server-side tool?

Decision scoring is deterministic and should not depend entirely on the language model.

The AI decides **when the analysis tool is useful**, while the tool performs the actual structured calculation.

This creates a separation between:

```text
AI reasoning → decides when to use the tool
       ↓
Server tool → validates and calculates
       ↓
React UI → presents the result
```

### Why use Zod?

Zod provides runtime validation for the structured tool input.

This prevents invalid data such as:

- Fewer than two options
- Missing criteria
- Invalid weights
- Invalid scores
- Duplicate criteria
- Missing criterion scores

from being silently processed.

### Why render a component instead of JSON?

Raw JSON is difficult for normal users to understand.

The `DecisionAnalysisResult` component transforms the structured tool output into a readable decision-analysis interface.

This demonstrates the main idea of **generative UI**: AI-generated tool interactions can result in meaningful application UI instead of only text.

---

## 📚 Key Learning Outcomes

Through this assignment, I learned how to:

- Define AI tools using the Vercel AI SDK.
- Create typed tool schemas with Zod.
- Validate AI-generated structured input.
- Execute tools on the server.
- Handle streaming tool-call lifecycle states.
- Render tool results as React components.
- Handle tool execution failures in the UI.
- Use multi-step AI tool execution.
- Separate AI reasoning from deterministic application logic.
- Test AI functionality through both local and deployed environments.
- Connect an AI feature to the main application navigation.
- Deploy and verify an AI-powered feature in a Preview environment.

---

## 🚀 Future Improvements

Possible future improvements include:

- Add charts for option comparison.
- Add more decision-analysis tools.
- Allow users to edit tool-generated analysis.
- Save tool results with individual decisions.
- Add custom data streaming for richer UI feedback.
- Add user confirmation for tools that perform external actions.

---

## 👩‍💻 Project

**ThinkLens — AI Decision & Reasoning Companion**

Built as part of the **FlyRank AI Frontend AI Engineering Internship**.

**Feature Branch:**

```text
feature/generative-ui-tools
```

**Main Feature:**

```text
Generative UI + Server-Side Tool Calling
```
