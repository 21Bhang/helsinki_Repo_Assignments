import { Box, Button, TextField } from "@mui/material";

const LoginForm = ({
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
  handleSubmit,
}) => (
  <Box
    component="form"
    onSubmit={handleSubmit}
    sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 360 }}
  >
    <TextField
      id="username"
      label="username"
      name="Username"
      value={username}
      onChange={handleUsernameChange}
      variant="outlined"
      size="small"
    />
    <TextField
      id="password"
      label="password"
      name="Password"
      type="password"
      value={password}
      onChange={handlePasswordChange}
      variant="outlined"
      size="small"
    />
    <Button type="submit" variant="contained" sx={{ alignSelf: "flex-start" }}>
      login
    </Button>
  </Box>
);

export default LoginForm;
