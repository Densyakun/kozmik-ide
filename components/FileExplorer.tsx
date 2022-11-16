import Typography from '@mui/material/Typography';
import Directory from "./Directory";

export default function FileExplorer({ path }: { path: string }) {
  return (
    <>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        {path}
      </Typography>
      <Directory path={path} />
    </>
  )
}
