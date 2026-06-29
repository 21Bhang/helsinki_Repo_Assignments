import { useState } from "react";

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const succeeded = await createBlog({ title, author, url });
    if (succeeded) {
      setTitle("");
      setAuthor("");
      setUrl("");
    }
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            title
            <input
              type="text"
              value={title}
              name="Title"
              onChange={({ target }) => setTitle(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            author
            <input
              type="text"
              value={author}
              name="Author"
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            url
            <input
              type="text"
              value={url}
              name="Url"
              onChange={({ target }) => setUrl(target.value)}
            />
          </label>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogForm;
