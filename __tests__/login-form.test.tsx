import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

// Mock next/navigation useRouter
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

// Mock next-auth signIn
vi.mock("next-auth/react", () => ({
  signIn: vi.fn().mockResolvedValue({}),
}));

import { LoginForm } from "@/components/auth/login-form";

describe("LoginForm", () => {
  it("renders inputs and submits successfully with valid data", async () => {
    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText(/name@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/•+/i);
    const submit = screen.getByRole("button", { name: /sign in/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");

    await userEvent.click(submit);
  });
});
