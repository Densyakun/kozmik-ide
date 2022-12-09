import path from 'path';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Directory from "./Directory";
import ParentDirectoryButton from './ParentDirectoryButton';
import useFileExplorer from '../lib/useFileExplorer';

export default function FileExplorer() {
  const { currentPath, setCurrentPath } = useFileExplorer()

  const handleClick = (name: string) => {
    const newCurrentPath = path.resolve(currentPath, name)
    setCurrentPath(newCurrentPath)
  }

  return <>
    <Stack direction="row" alignItems="center" spacing={2}>
      <ParentDirectoryButton currentPath={currentPath} setCurrentPath={setCurrentPath} />
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        {currentPath}
      </Typography>
    </Stack>
    <Directory path={currentPath} onClick={handleClick} />
  </>
}
