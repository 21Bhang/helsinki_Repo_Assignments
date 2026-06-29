import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

describe("<Blog />", () => {
  const blog = {
    id: "abc123",
    title: "Test-driven UI is fun",
    author: "Kent C. Dodds",
    url: "https://testing-library.com",
    likes: 7,
    user: { username: "kentcdodds", name: "Kent C. Dodds" },
  };

  test("renders title and author, but not url or likes by default", () => {
    render(<Blog blog={blog} />);

    expect(
      screen.getByText(`${blog.title} ${blog.author}`, { exact: false }),
    ).toBeInTheDocument();
    expect(screen.queryByText(blog.url)).not.toBeInTheDocument();
    expect(
      screen.queryByText(`likes ${blog.likes}`, { exact: false }),
    ).not.toBeInTheDocument();
  });

  test("after clicking the view button, url and likes are shown", async () => {
    const user = userEvent.setup();
    render(<Blog blog={blog} />);

    await user.click(screen.getByRole("button", { name: "view" }));

    expect(screen.getByText(blog.url)).toBeInTheDocument();
    expect(
      screen.getByText(`likes ${blog.likes}`, { exact: false }),
    ).toBeInTheDocument();
  });

  test("clicking the like button twice calls the event handler twice", async () => {
    const user = userEvent.setup();
    const handleLike = vi.fn();

    render(<Blog blog={blog} handleLike={handleLike} />);

    await user.click(screen.getByRole("button", { name: "view" }));

    const likeButton = screen.getByRole("button", { name: "like" });
    await user.click(likeButton);
    await user.click(likeButton);

    expect(handleLike.mock.calls).toHaveLength(2);
  });
});
