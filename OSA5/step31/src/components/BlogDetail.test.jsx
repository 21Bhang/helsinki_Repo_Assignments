import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogDetail from "./BlogDetail";

describe("<BlogDetail /> (5.27)", () => {
  const blog = {
    id: "abc123",
    title: "Test-driven UI is fun",
    author: "Kent C. Dodds",
    url: "https://testing-library.com",
    likes: 7,
    user: { username: "kentcdodds", name: "Kent C. Dodds" },
  };

  test("unauthenticated user sees blog info and likes but no buttons", () => {
    render(<BlogDetail blog={blog} isLoggedIn={false} />);

    expect(
      screen.getByText(`${blog.title} ${blog.author}`, { exact: false }),
    ).toBeInTheDocument();
    expect(screen.getByText(blog.url)).toBeInTheDocument();
    expect(
      screen.getByText(`likes ${blog.likes}`, { exact: false }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: "like" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "remove" }),
    ).not.toBeInTheDocument();
  });

  test("authenticated non-creator sees only the like button", () => {
    render(
      <BlogDetail
        blog={blog}
        isLoggedIn={true}
        currentUsername="someoneElse"
        handleLike={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "like" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "remove" }),
    ).not.toBeInTheDocument();
  });

  test("creator sees both like and remove buttons", async () => {
    const user = userEvent.setup();
    const handleLike = vi.fn();
    const handleDelete = vi.fn();

    render(
      <BlogDetail
        blog={blog}
        isLoggedIn={true}
        currentUsername="kentcdodds"
        handleLike={handleLike}
        handleDelete={handleDelete}
      />,
    );

    const likeButton = screen.getByRole("button", { name: "like" });
    const removeButton = screen.getByRole("button", { name: "remove" });

    expect(likeButton).toBeInTheDocument();
    expect(removeButton).toBeInTheDocument();

    await user.click(likeButton);
    expect(handleLike.mock.calls).toHaveLength(1);

    await user.click(removeButton);
    expect(handleDelete.mock.calls).toHaveLength(1);
    expect(handleDelete.mock.calls[0][0]).toEqual(blog);
  });
});
