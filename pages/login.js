import { Grid, Paper, Avatar, TextField,FormControlLabel,Checkbox,Button,Typography,Link } from "@material-ui/core";
import LockIcon from "@material-ui/icons/Lock";

export default function Login() {
  const paperStyle = {
    padding: 20,
    height: "70vh",
    width: 300,
    margin: "20px auto",
  };
  // const avatarStyle = { backgroundColor: this.primary.main };
  const btstyle= {margin:'8px 0'}
  
  return (
    <Grid>
      <Paper elevation={3} style={paperStyle}>
        <Grid align="center">
          <Avatar>
            <LockIcon/>
          </Avatar>
          <h2>Sign in</h2>
          </Grid>
          <TextField label="Username" fullWidth required></TextField>
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
          ></TextField>
          <FormControlLabel
            control={
              <Checkbox
                // checked={state.checkedB}
                // onChange={handleChange}
                name="checkedB"
                color="primary"
              />
            }
            label="Remember me"
          />
          <Button type="submit" color="primary" variant="contained" style={btstyle} fullWidth>Sign in</Button>
          <Typography>
              <Link href="#">Forget password?</Link>
          </Typography>
      </Paper>
    </Grid>
  );
}
