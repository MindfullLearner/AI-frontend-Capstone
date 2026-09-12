# ThinkLens — Generative UI & Tool Calling

## 📌 Assignment Overview

This assignment adds a **generative UI and tool-calling workflow** to ThinkLens, an AI decision and reasoning companion.

The goal was to move beyond a basic streaming chatbot by allowing the AI to call a **server-side decision analysis tool**, process structured decision data, and display the tool's result as a dedicated interactive UI component.

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
