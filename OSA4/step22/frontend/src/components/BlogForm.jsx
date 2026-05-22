import { useState } from "react";

const BlogForm = ({ onCreate }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await onCreate({ title, author, url });
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <div className="card">
      <h3>Create a new blog</h3>
      <form onSubmit={submit}>
        <label>
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          Author
          <input value={author} onChange={(e) => setAuthor(e.target.value)} />
        </label>
        <label>
          URL
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </label>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default BlogForm;
