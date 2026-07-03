import { describe, expect, it, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useAnecdoteStore } from "../store";
import AnecdoteList from "./AnecdoteList";

describe("AnecdoteList Filtering Tests", () => {
  beforeEach(() => {
    // 1. Reset state before each individual evaluation blocks execution
    useAnecdoteStore.setState({ anecdotes: [], filter: "" });
  });

  it("filters list reactively showing matching phrases and hiding mismatches", () => {
    // 2. Populate store with different search candidate string values
    const originalAnecdotes = [
      { id: "1", content: "Learn Javascript development", votes: 0 },
      { id: "2", content: "Zustand makes programming simple", votes: 0 },
      { id: "3", content: "Writing good clean code is nice", votes: 0 },
    ];
    useAnecdoteStore.setState({ anecdotes: originalAnecdotes });

    // 3. Set a specific search query inside the store state directly
    useAnecdoteStore.setState({ filter: "code" });

    // 4. Render the list view onto the virtual DOM context screen layout
    render(<AnecdoteList />);

    // 5. Verification: The text containing 'code' should render successfully on screen
    expect(
      screen.getByText("Writing good clean code is nice"),
    ).toBeInTheDocument();

    // 6. Verification: Text strings not containing 'code' should NOT be present anywhere in the document
    expect(
      screen.queryByText("Learn Javascript development"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Zustand makes programming simple"),
    ).not.toBeInTheDocument();
  });
});
