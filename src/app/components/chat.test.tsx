import { cleanup, render, screen } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { Chat } from "./chat";

const { mockUseChat } = vi.hoisted(() => ({
  mockUseChat: vi.fn(),
}));

vi.mock("@ai-sdk/react", () => ({
  useChat: mockUseChat,
}));

vi.mock("ai", () => ({
  DefaultChatTransport: vi.fn(),
}));

describe("Chat", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseChat.mockReturnValue({
      messages: [],
      sendMessage: vi.fn(),
      status: "ready",
      stop: vi.fn(),
      error: undefined,
      regenerate: vi.fn(),
    });
  });

  it("renders the empty state for a new chat", () => {
    render(<Chat />);

    expect(
      screen.getByText(/ThinkLens helps you think through a decision/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Help me decide between two job offers",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "What information am I missing before making this decision?",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Compare learning React vs. Python first",
      })
    ).toBeInTheDocument();
  });

  it("renders a user message as plain text", () => {
    mockUseChat.mockReturnValue({
      messages: [
        {
          id: "user-1",
          role: "user",
          parts: [
            {
              type: "text",
              text: "Help me choose between two jobs",
            },
          ],
        },
      ],
      sendMessage: vi.fn(),
      status: "ready",
      stop: vi.fn(),
      error: undefined,
      regenerate: vi.fn(),
    });

    render(<Chat />);

    expect(screen.getByText("You")).toBeInTheDocument();

    expect(
      screen.getByText("Help me choose between two jobs")
    ).toBeInTheDocument();
  });

  it("renders an assistant message", () => {
    mockUseChat.mockReturnValue({
      messages: [
        {
          id: "assistant-1",
          role: "assistant",
          parts: [
            {
              type: "text",
              text: "Consider the salary, growth, and work-life balance.",
            },
          ],
        },
      ],
      sendMessage: vi.fn(),
      status: "ready",
      stop: vi.fn(),
      error: undefined,
      regenerate: vi.fn(),
    });

    render(<Chat />);

    expect(screen.getByText("ThinkLens")).toBeInTheDocument();

    expect(
      screen.getByText(
        "Consider the salary, growth, and work-life balance."
      )
    ).toBeInTheDocument();
  });

  it("shows the thinking state while a message is being submitted", () => {
    mockUseChat.mockReturnValue({
      messages: [],
      sendMessage: vi.fn(),
      status: "submitted",
      stop: vi.fn(),
      error: undefined,
      regenerate: vi.fn(),
    });

    render(<Chat />);

    expect(screen.getByText("Thinking...")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Stop" })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: "Send" })
    ).not.toBeInTheDocument();
  });
  it("shows the stop button while the response is streaming", () => {
    mockUseChat.mockReturnValue({
        messages: [
        {
            id: "assistant-streaming-1",
            role: "assistant",
            parts: [
            {
                type: "text",
                text: "I am still analyzing your decision...",
            },
            ],
        },
        ],
        sendMessage: vi.fn(),
        status: "streaming",
        stop: vi.fn(),
        error: undefined,
        regenerate: vi.fn(),
    });

    render(<Chat />);

    expect(
        screen.getByText("I am still analyzing your decision...")
    ).toBeInTheDocument();

    expect(
        screen.getByRole("button", { name: "Stop" })
    ).toBeInTheDocument();

    expect(
        screen.queryByRole("button", { name: "Send" })
    ).not.toBeInTheDocument();
    });
    it("shows the error state and retries the response", async () => {
    const regenerate = vi.fn();

    mockUseChat.mockReturnValue({
        messages: [],
        sendMessage: vi.fn(),
        status: "error",
        stop: vi.fn(),
        error: new Error("Request failed"),
        regenerate,
    });

    render(<Chat />);

    expect(
        screen.getByText(/Something went wrong and the response failed/i)
    ).toBeInTheDocument();

    expect(
        screen.getByText(/Request failed/i)
    ).toBeInTheDocument();

    const retryButton = screen.getByRole("button", {
        name: "Retry",
    });

    expect(retryButton).toBeInTheDocument();

    retryButton.click();

    expect(regenerate).toHaveBeenCalledTimes(1);
    });
    it("shows the preparing state while decision analysis input is streaming", () => {
    mockUseChat.mockReturnValue({
        messages: [
        {
            id: "tool-1",
            role: "assistant",
            parts: [
            {
                type: "tool-analyzeDecision",
                state: "input-streaming",
            },
            ],
        },
        ],
        sendMessage: vi.fn(),
        status: "ready",
        stop: vi.fn(),
        error: undefined,
        regenerate: vi.fn(),
    });

    render(<Chat />);

    expect(
        screen.getByText("Preparing decision analysis...")
    ).toBeInTheDocument();
    });
    it("shows the analyzing state when decision analysis input is available", () => {
    mockUseChat.mockReturnValue({
        messages: [
        {
            id: "tool-2",
            role: "assistant",
            parts: [
            {
                type: "tool-analyzeDecision",
                state: "input-available",
            },
            ],
        },
        ],
        sendMessage: vi.fn(),
        status: "ready",
        stop: vi.fn(),
        error: undefined,
        regenerate: vi.fn(),
    });

    render(<Chat />);

    expect(
        screen.getByText("Analyzing your decision...")
    ).toBeInTheDocument();
    });
    it("shows the decision analysis error when the tool fails", () => {
        mockUseChat.mockReturnValue({
            messages: [
            {
                id: "tool-error-1",
                role: "assistant",
                parts: [
                {
                    type: "tool-analyzeDecision",
                    state: "output-error",
                    errorText: "Unable to analyze the decision.",
                },
                ],
            },
            ],
            sendMessage: vi.fn(),
            status: "ready",
            stop: vi.fn(),
            error: undefined,
            regenerate: vi.fn(),
        });

        render(<Chat />);

        expect(
            screen.getByText(
            "Decision analysis failed: Unable to analyze the decision."
            )
        ).toBeInTheDocument();
        });
        it("renders the decision analysis result when the tool completes", () => {
    const analysisResult = {
        summary: "Option A provides the best balance.",
        options: [
        {
            name: "Option A",
            score: 85,
            reasoning: "Lower cost and good flexibility.",
        },
        {
            name: "Option B",
            score: 70,
            reasoning: "Higher cost but stronger long-term benefits.",
        },
        ],
        keyConsiderations: ["Budget", "Flexibility"],
        risks: ["Option A may require additional setup time."],
    };

    mockUseChat.mockReturnValue({
        messages: [
        {
            id: "tool-result-1",
            role: "assistant",
            parts: [
            {
                type: "tool-analyzeDecision",
                state: "output-available",
                output: analysisResult,
            },
            ],
        },
        ],
        sendMessage: vi.fn(),
        status: "ready",
        stop: vi.fn(),
        error: undefined,
        regenerate: vi.fn(),
    });

    render(<Chat />);

    expect(
        screen.getByRole("heading", { name: "Decision Analysis" })
    ).toBeInTheDocument();

    expect(
        screen.getByText("Option A")
    ).toBeInTheDocument();

    expect(
        screen.getByText("85/100")
    ).toBeInTheDocument();

    expect(
        screen.getByText("Lower cost and good flexibility.")
    ).toBeInTheDocument();

    expect(
        screen.getByText("Option B")
    ).toBeInTheDocument();

    expect(
        screen.getByText("Budget")
    ).toBeInTheDocument();

    expect(
        screen.getByText("Option A may require additional setup time.")
    ).toBeInTheDocument();
    });
});