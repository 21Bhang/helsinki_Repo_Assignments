import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAnecdoteStore } from "./store";
import anecdoteService from "./services/anecdotes";

vi.mock("./notificationStore", () => ({
  useNotificationStore: {
    getState: () => ({
      actions: {
        showNotification: vi.fn(),
      },
    }),
  },
}));

describe("Anecdote Store Voting Operations", () => {
  beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes: [], filter: "" });
    vi.clearAllMocks();
  });

  it("verifies that voting increases the number of votes for an anecdote", async () => {
    const initialAnecdote = {
      id: "99",
      content: "Writing tests helps prevent regression bugs",
      votes: 5,
    };
    useAnecdoteStore.setState({ anecdotes: [initialAnecdote] });

    const expectedServerPayload = {
      ...initialAnecdote,
      votes: 6,
    };

    const voteServiceSpy = vi
      .spyOn(anecdoteService, "vote")
      .mockResolvedValue(expectedServerPayload);

    await useAnecdoteStore.getState().actions.voteAnecdote("99");

    expect(voteServiceSpy).toHaveBeenCalledTimes(1);
    expect(voteServiceSpy).toHaveBeenCalledWith("99", {
      id: "99",
      content: "Writing tests helps prevent regression bugs",
      votes: 6,
    });

    const updatedState = useAnecdoteStore.getState();
    const targetItem = updatedState.anecdotes.find((a) => a.id === "99");

    expect(targetItem.votes).toBe(6);
  });
});
