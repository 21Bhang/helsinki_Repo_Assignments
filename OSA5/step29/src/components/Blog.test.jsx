import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Blog from "./Blog";

describe("<Blog /> list item", () => {
  const blog = {
    id: "abc123",
    title: "Test-driven UI is fun",
    author: "Kent C. Dodds",
    url: "https://testing-library.com",
    likes: 7,
  };

  test("renders a link with title and author pointing to /blogs/:id", () => {
    render(
      <MemoryRouter>
        <Blog blog={blog} />
      </MemoryRouter>,
    );

    const link = screen.getByRole("link", {
      name: `${blog.title} ${blog.author}`,
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", `/blogs/${blog.id}`);
  });
});
