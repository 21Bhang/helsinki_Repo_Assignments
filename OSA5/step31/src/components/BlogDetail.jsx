import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Link as MuiLink,
  Stack,
  Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";

// 5.31: single-blog view rendered as a MUI Card.
// (icons come from @mui/icons-material; if you have not installed it,
// drop the icon imports and the startIcon props.)
const BlogDetail = ({
  blog,
  handleLike,
  handleDelete,
  currentUsername,
  isLoggedIn,
}) => {
  const onLike = () => {
    handleLike({
      ...blog,
      likes: (blog.likes ?? 0) + 1,
      user: blog.user?.id ?? blog.user,
    });
  };

  const canDelete = currentUsername && blog.user?.username === currentUsername;

  return (
    <Card className="blog-detail" sx={{ my: 2 }}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {blog.title} {blog.author}
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ my: 1 }}>
          <MuiLink href={blog.url} target="_blank" rel="noreferrer">
            {blog.url}
          </MuiLink>
          <Chip
            label={`likes ${blog.likes ?? 0}`}
            size="small"
            color="primary"
          />
        </Stack>

        {blog.user && (
          <Typography variant="body2" color="text.secondary">
            added by {blog.user.name}
          </Typography>
        )}
      </CardContent>

      <CardActions>
        {isLoggedIn && (
          <Button
            type="button"
            size="small"
            variant="outlined"
            startIcon={<FavoriteIcon />}
            onClick={onLike}
          >
            like
          </Button>
        )}
        {canDelete && (
          <Button
            type="button"
            size="small"
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleDelete(blog)}
          >
            remove
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default BlogDetail;
