import { test, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolStatusIndicator } from "../ToolStatusIndicator";

afterEach(() => {
  cleanup();
});

test("displays creating message for str_replace_editor create command", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "call" as const,
    args: {
      command: "create",
      path: "/components/Button.tsx",
    },
  };

  render(<ToolStatusIndicator toolInvocation={toolInvocation} />);

  expect(screen.getByText("Creating Button.tsx")).toBeDefined();
  expect(screen.getByLabelText("In progress: Creating Button.tsx")).toBeDefined();
});

test("displays editing message for str_replace_editor str_replace command", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "result" as const,
    args: {
      command: "str_replace",
      path: "/src/utils/helpers.js",
    },
    result: "Success",
  };

  render(<ToolStatusIndicator toolInvocation={toolInvocation} />);

  expect(screen.getByText("Editing helpers.js")).toBeDefined();
  expect(screen.getByLabelText("Completed: Editing helpers.js")).toBeDefined();
});

test("displays adding code message for str_replace_editor insert command", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "partial-call" as const,
    args: {
      command: "insert",
      path: "/App.jsx",
    },
  };

  render(<ToolStatusIndicator toolInvocation={toolInvocation} />);

  expect(screen.getByText("Adding code to App.jsx")).toBeDefined();
  expect(screen.getByLabelText("In progress: Adding code to App.jsx")).toBeDefined();
});

test("displays reading message for str_replace_editor view command", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "call" as const,
    args: {
      command: "view",
      path: "/config/settings.json",
    },
  };

  render(<ToolStatusIndicator toolInvocation={toolInvocation} />);

  expect(screen.getByText("Reading settings.json")).toBeDefined();
});

test("displays fallback message for str_replace_editor unknown command", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "call" as const,
    args: {
      command: "unknown_command",
      path: "/test.js",
    },
  };

  render(<ToolStatusIndicator toolInvocation={toolInvocation} />);

  expect(screen.getByText("Working on test.js")).toBeDefined();
});

test("displays renaming message for file_manager rename command", () => {
  const toolInvocation = {
    toolName: "file_manager",
    state: "result" as const,
    args: {
      command: "rename",
      path: "/components/Header.tsx",
      new_path: "/components/Navigation.tsx",
    },
    result: { success: true },
  };

  render(<ToolStatusIndicator toolInvocation={toolInvocation} />);

  expect(screen.getByText("Renaming Header.tsx to Navigation.tsx")).toBeDefined();
  expect(screen.getByLabelText("Completed: Renaming Header.tsx to Navigation.tsx")).toBeDefined();
});

test("displays deleting message for file_manager delete command", () => {
  const toolInvocation = {
    toolName: "file_manager",
    state: "call" as const,
    args: {
      command: "delete",
      path: "/components/UnusedComponent.tsx",
    },
  };

  render(<ToolStatusIndicator toolInvocation={toolInvocation} />);

  expect(screen.getByText("Deleting UnusedComponent.tsx")).toBeDefined();
});

test("displays fallback message for file_manager unknown command", () => {
  const toolInvocation = {
    toolName: "file_manager",
    state: "call" as const,
    args: {
      command: "unknown",
      path: "/test.js",
    },
  };

  render(<ToolStatusIndicator toolInvocation={toolInvocation} />);

  expect(screen.getByText("Managing test.js")).toBeDefined();
});

test("displays fallback message for unknown tool", () => {
  const toolInvocation = {
    toolName: "unknown_tool",
    state: "call" as const,
    args: {},
  };

  render(<ToolStatusIndicator toolInvocation={toolInvocation} />);

  expect(screen.getByText("Running unknown_tool")).toBeDefined();
});

test("handles missing or empty path gracefully", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "call" as const,
    args: {
      command: "create",
      path: "",
    },
  };

  render(<ToolStatusIndicator toolInvocation={toolInvocation} />);

  expect(screen.getByText("Creating file")).toBeDefined();
});

test("handles missing args gracefully", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "call" as const,
  };

  render(<ToolStatusIndicator toolInvocation={toolInvocation} />);

  expect(screen.getByText("Working on file")).toBeDefined();
});

test("shows loading spinner for partial-call state", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "partial-call" as const,
    args: {
      command: "create",
      path: "/test.js",
    },
  };

  render(<ToolStatusIndicator toolInvocation={toolInvocation} />);

  const spinner = screen.getByRole("status");
  expect(spinner.querySelector(".animate-spin")).toBeDefined();
});

test("shows loading spinner for call state", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "call" as const,
    args: {
      command: "create",
      path: "/test.js",
    },
  };

  render(<ToolStatusIndicator toolInvocation={toolInvocation} />);

  const spinner = screen.getByRole("status");
  expect(spinner.querySelector(".animate-spin")).toBeDefined();
});

test("shows check icon for result state", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "result" as const,
    args: {
      command: "create",
      path: "/test.js",
    },
    result: "Success",
  };

  render(<ToolStatusIndicator toolInvocation={toolInvocation} />);

  const container = screen.getByRole("status");
  expect(container.className).toContain("bg-emerald-50");
});

test("applies custom className", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "call" as const,
    args: {
      command: "create",
      path: "/test.js",
    },
  };

  render(<ToolStatusIndicator toolInvocation={toolInvocation} className="custom-class" />);

  const container = screen.getByRole("status");
  expect(container.className).toContain("custom-class");
});

test("extracts filename from complex path", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "call" as const,
    args: {
      command: "create",
      path: "/very/deep/nested/path/to/Component.tsx",
    },
  };

  render(<ToolStatusIndicator toolInvocation={toolInvocation} />);

  expect(screen.getByText("Creating Component.tsx")).toBeDefined();
});

test("handles root path correctly", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "call" as const,
    args: {
      command: "create",
      path: "/App.tsx",
    },
  };

  render(<ToolStatusIndicator toolInvocation={toolInvocation} />);

  expect(screen.getByText("Creating App.tsx")).toBeDefined();
});