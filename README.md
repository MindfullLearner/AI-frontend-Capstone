# ThinkLens — AI Decision & Reasoning Companion

ThinkLens is an AI-powered decision-support application designed to help users organize decisions, compare alternatives, examine assumptions, and reason through their options.

The project is being developed as part of the FlyRank AI Frontend Engineering Internship.

## Features

- **Structured decision-making:** Organize a decision and its alternatives.
- **AI-powered chat:** Interact with the AI assistant through a streaming chat interface.
- **Decision analysis:** Present structured decision-analysis results when supported by the assistant.
- **Responsive interface:** Use the application across different screen sizes.
- **Error handling:** Display a user-friendly message when AI response generation fails.

## Technology Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Vercel AI SDK
- Google Gemini API

## Getting Started

### Prerequisites

- Node.js version compatible with the project's `package.json`
- npm
- A Google Gemini API key

### Installation

Clone the repository:

```bash
git clone https://github.com/MindfullLearner/AI-frontend-Capstone.git
cd AI-frontend-Capstone
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root and configure the environment variables required by the application.

Do not commit `.env.local` or expose API keys in source code, screenshots, or public logs.

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Production Build

Run the following commands to check the project before deployment:

```bash
npm run lint
npm run build
npm run start
```

The `start` command runs the previously generated production build. Run `build` first.

## Production Reliability and API Validation

The chat API route includes the following safeguards:

- A request-body size limit of 1 MB.
- A message-count limit of 50.
- Validation of incoming UI messages.
- HTTP 400 responses for invalid JSON and invalid request structures.
- A configured maximum route duration of 30 seconds.
- Limited AI SDK retries and server-side logging of streaming errors.

The chat interface displays a user-friendly error message and offers a retry action when generation fails.

**Current limitation:** These safeguards do not implement comprehensive rate limiting. They also do not eliminate temporary upstream AI service failures.

## Testing and Verification

The following checks have passed during local development:

| Check | Result |
|---|---|
| ESLint | Passed |
| Production build | Passed |
| Production server startup | Passed |
| Homepage loading in production mode | Passed |
| Main-page navigation | Passed |
| Layout and styling | Passed |
| AI chat response in local production mode | Passed |
| Invalid JSON API request | Returned HTTP 400 |
| Missing messages array | Returned HTTP 400 |
| Empty messages array | Returned HTTP 400 |

Cross-browser testing and deployed-production verification remain to be completed.

## Architecture Overview

- `src/app/` — Next.js application routes and pages.
- `src/app/api/chat/route.ts` — Chat API endpoint, request validation, and AI streaming.
- `src/app/components/chat.tsx` — Chat interface, response states, and error handling.
- `src/app/layout.tsx` — Shared application layout.
- `src/lib/ai/` — AI configuration and related functionality.

## AI Usage and Development Decisions

AI assistance was used during implementation and debugging. Changes were reviewed and tested locally before being considered complete.

During production testing, the Gemini API returned a temporary HTTP 503 service-unavailable error. This demonstrated that upstream AI services may fail even when the application itself builds and runs successfully.

The Google-hosted font import was removed after it caused a font compilation failure in the local build environment. The application now uses its existing CSS/system font fallbacks rather than depending on that remote font import.

## Screenshots

Screenshots of:
The ThinkLens homepage.
![Home Page](screenshots/HomePage.png "Home Page")
The chat interface with a successful response.
![Chat Page](screenshots/SuccessfulChat.png "Succesfull Response")
A responsive mobile layout.
![Mobile View](screenshots/MobileView.png "Mobile Layout")
## License

See the repository's `LICENSE` file for licensing terms.
feature/production-polish