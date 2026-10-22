
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MarkdownMessage } from "./markdown-message";

describe("MarkdownMessage", () => {
  it("renders Markdown headings and formatted text", () => {
    render(
      <MarkdownMessage text={"## Best Option\n\nThis is **important**."} />
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Best Option" })
    ).toBeInTheDocument();

    expect(screen.getByText("important").tagName).toBe("STRONG");
  });
  
    it("renders links with safe new-tab attributes", () => {
    render(
        <MarkdownMessage
        text={"Read the [documentation](https://example.com/docs)."}
        />
    );

    const link = screen.getByRole("link", { name: "documentation" });

    expect(link).toHaveAttribute("href", "https://example.com/docs");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer noopener");
    });
    
    it("renders inline code with the expected styling", () => {
    render(
        <MarkdownMessage text={"Use `npm test` to run the tests."} />
    );

    const code = screen.getByText("npm test");

    expect(code.tagName).toBe("CODE");
    expect(code).toHaveClass("rounded");
    expect(code).toHaveClass("font-mono");
    });
    
    it("renders fenced code blocks with block styling", () => {
    render(
        <MarkdownMessage
        text={"```javascript\nconsole.log('Hello');\n```"}
        />
    );

    const code = screen.getByText("console.log('Hello');");

    expect(code.tagName).toBe("CODE");
    expect(code).toHaveClass("block");
    expect(code).toHaveClass("font-mono");
    });
    
    it("does not render raw HTML as live markup", () => {
    render(
        <MarkdownMessage text={'<img src="x" onerror="alert(1)" />'} />
    );

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(document.querySelector('[onerror="alert(1)"]')).toBeNull();
    });


});
