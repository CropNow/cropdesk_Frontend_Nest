// @vitest-environment jsdom
import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { NotFoundPage } from "../NotFoundPage";
import "@testing-library/jest-dom";

describe("NotFoundPage", () => {
  test("renders 404 header and description text", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
    expect(screen.getByText("The page you're looking for doesn't exist.")).toBeInTheDocument();
  });

  test("renders Go to Dashboard link", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );

    const link = screen.getByRole("link", { name: /go to dashboard/i });
    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toBe("/dashboard");
  });
});
