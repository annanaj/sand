import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge variant="active">Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it.each([
    "active",
    "inactive",
    "success",
    "error",
    "warning",
    "info",
  ] as const)(
    'renders variant "%s" without crashing',
    (variant) => {
      render(<Badge variant={variant}>{variant}</Badge>);
      expect(screen.getByText(variant)).toBeInTheDocument();
    },
  );
});

describe("Badge.Dot", () => {
  it("renders a span", () => {
    const { container } = render(<Badge.Dot />);
    expect(
      container.querySelector("span"),
    ).toBeInTheDocument();
  });
});

describe("Badge.Label", () => {
  it("renders children", () => {
    render(<Badge.Label>Online</Badge.Label>);
    expect(screen.getByText("Online")).toBeInTheDocument();
  });
});

describe("Badge.Count", () => {
  it("displays the value when below max", () => {
    render(<Badge.Count value={3} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it('displays value equal to max without "+"', () => {
    render(<Badge.Count value={100} max={100} />);
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it('displays "max+" when value exceeds max', () => {
    render(<Badge.Count value={142} max={99} />);
    expect(screen.getByText("99+")).toBeInTheDocument();
  });

  it("uses default max of 99", () => {
    render(<Badge.Count value={200} />);
    expect(screen.getByText("99+")).toBeInTheDocument();
  });

  it("displays zero", () => {
    render(<Badge.Count value={0} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("works with custom max", () => {
    render(<Badge.Count value={5} max={3} />);
    expect(screen.getByText("3+")).toBeInTheDocument();
  });
});

describe("Badge composition", () => {
  it("renders Dot and Label together", () => {
    render(
      <Badge variant="active">
        <Badge.Dot />
        <Badge.Label>Online</Badge.Label>
      </Badge>,
    );
    expect(screen.getByText("Online")).toBeInTheDocument();
  });

  it("renders Count inside Badge", () => {
    render(
      <Badge variant="error">
        <Badge.Count value={5} />
      </Badge>,
    );
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});
