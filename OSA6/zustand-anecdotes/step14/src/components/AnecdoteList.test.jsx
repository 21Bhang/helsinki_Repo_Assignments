import { describe, expect, it, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; // Extends matchers like toBeInTheDocument
import { useAnecdoteStore } from "../store";
import AnecdoteList from "./AnecdoteList";

describe("AnecdoteList Component Sorting Test", () => {
  beforeEach(() => {
    // 1. Clear store state before running the test
    useAnecdoteStore.setState({ anecdotes: [], filter: "" });
  });

  it("renders anecdotes sorted from highest to lowest votes count", () => {
    // 2. Mock anecdotes array where items are out of order
    const unsortedAnecdotes = [
      { id: "1", content: "Low vote anecdote", votes: 2 },
      { id: "2", content: "Highest vote anecdote", votes: 15 },
      { id: "3", content: "Medium vote anecdote", votes: 7 },
    ];

    // 3. Inject this out-of-order data straight into the Zustand store state
    useAnecdoteStore.setState({ anecdotes: unsortedAnecdotes });

    // 4. Render the component on the virtual DOM screen
    render(<AnecdoteList />);

    // 5. Select all rendered text elements on screen
    const items = screen.getAllByText(/vote anecdote/i);

    // 6. Assert that the elements appear down the screen in the sorted sequence
    expect(items[0]).toHaveTextContent("Highest vote anecdote");
    expect(items[1]).toHaveTextContent("Medium vote anecdote");
    expect(items[2]).toHaveTextContent("Low vote anecdote");
  });
});
