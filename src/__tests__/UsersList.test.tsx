import React from "react";
import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { UsersList } from "../components/UsersList/UsersList";
import { ThemeProvider } from "../components/ThemeProvider";
import "@testing-library/jest-dom";
import "@/i18n";

// Mock the fetchUsers API call
vi.mock("@/services/api", () => ({
  fetchUsers: vi.fn().mockResolvedValue({ data: [] }),
}));

describe("UsersList Component", () => {
  it("renders the form inputs and Add User button", () => {
    render(
      <ThemeProvider>
        <UsersList />
      </ThemeProvider>,
    );

    // Check for form elements
    expect(
      screen.getByPlaceholderText("Full name"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Email"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /Add User/i,
      }),
    ).toBeInTheDocument();
  });

  it("handles typing into the name input", () => {
    render(
      <ThemeProvider>
        <UsersList />
      </ThemeProvider>,
    );

    const nameInput =
      screen.getByPlaceholderText("Full name");

    // Simulate typing a name
    fireEvent.change(nameInput, {
      target: { value: "Edward Fish" },
    });

    // Check if the input now contains the typed value
    expect(nameInput).toHaveValue("Edward Fish");
  });
});
