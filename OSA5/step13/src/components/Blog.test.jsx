import { render, screen } from "@testing-library/react";
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

    // Title and author appear together in the summary line
    expect(
      screen.getByText(`${blog.title} ${blog.author}`, { exact: false }),
    ).toBeInTheDocument();

    // Details (url + likes) are hidden by default
    expect(screen.queryByText(blog.url)).not.toBeInTheDocument();
    expect(
      screen.queryByText(`likes ${blog.likes}`, { exact: false }),
    ).not.toBeInTheDocument();
  });
});
