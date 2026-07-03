import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAnecdoteStore } from "./store";
import anecdoteService from "./services/anecdotes";

describe("Anecdote Store Initialization", () => {
  beforeEach(() => {
    // 1. Reset the store state to empty before each test run
    useAnecdoteStore.setState({ anecdotes: [], filter: "" });

    // 2. Clear any existing mock behaviors or histories
    vi.restoreAllMocks();
  });

  it("verifies the state is initialized with the anecdotes returned by the backend", async () => {
    // Mock data mimicking what db.json or a real server would return
    const mockBackendAnecdotes = [
      { id: "1", content: "Testing code is fun", votes: 4 },
      { id: "2", content: "Zustand simplifies state management", votes: 12 },
    ];

    // 3. Spy on the service and force it to return our mock array
    const getAllSpy = vi
      .spyOn(anecdoteService, "getAll")
      .mockResolvedValue(mockBackendAnecdotes);

    // 4. Trigger the initialize action inside the store
    await useAnecdoteStore.getState().actions.initialize();

    // 5. Assertions: Ensure the service function was actually executed
    expect(getAllSpy).toHaveBeenCalledTimes(1);

    // 6. Assertions: Check that the store state matches the mock data exactly
    const finalState = useAnecdoteStore.getState();
    expect(finalState.anecdotes).toHaveLength(2);
    expect(finalState.anecdotes).toEqual(mockBackendAnecdotes);
    expect(finalState.anecdotes[1].content).toBe(
      "Zustand simplifies state management",
    );
  });
});
