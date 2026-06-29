import { useState } from "react";
import { Box, Button, TextField } from "@mui/material";

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
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 480 }}
    >
      <TextField
        id="title"
        label="title"
        name="Title"
        value={title}
        onChange={({ target }) => setTitle(target.value)}
        variant="outlined"
        size="small"
      />
      <TextField
        id="author"
        label="author"
        name="Author"
        value={author}
        onChange={({ target }) => setAuthor(target.value)}
        variant="outlined"
        size="small"
      />
      <TextField
        id="url"
        label="url"
        name="Url"
        value={url}
        onChange={({ target }) => setUrl(target.value)}
        variant="outlined"
        size="small"
      />
      <Button
        type="submit"
        variant="contained"
        sx={{ alignSelf: "flex-start" }}
      >
        create
      </Button>
    </Box>
  );
};

export default BlogForm;
