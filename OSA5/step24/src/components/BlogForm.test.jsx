import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

describe("<BlogForm />", () => {
  test("calls createBlog with the right details when a new blog is created", async () => {
    const user = userEvent.setup();
    const createBlog = vi.fn();

    render(<BlogForm createBlog={createBlog} />);

    const titleInput = screen.getByLabelText("title");
    const authorInput = screen.getByLabelText("author");
    const urlInput = screen.getByLabelText("url");
    const submitButton = screen.getByRole("button", { name: "create" });

    await user.type(titleInput, "Refactoring");
    await user.type(authorInput, "Martin Fowler");
    await user.type(
      urlInput,
      "https://martinfowler.com/books/refactoring.html",
    );
    await user.click(submitButton);

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0]).toEqual({
      title: "Refactoring",
      author: "Martin Fowler",
      url: "https://martinfowler.com/books/refactoring.html",
    });
  });
});
