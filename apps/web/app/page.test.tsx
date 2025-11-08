import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "./page";

describe("HomePage", () => {
  it("renders headline", () => {
    render(<HomePage />);
    expect(
      screen.getByText(/Run your day from WhatsApp/i)
    ).toBeInTheDocument();
  });
});

