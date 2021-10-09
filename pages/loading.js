import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function Loading() {
  return (
    <>
      <Grid container alignItems="center" justify="center" style={{ height:"80vh" }} >
        <Grid item xs={1}>
          <CircularProgress />
        </Grid>
      </Grid>
    </>
  );
}
