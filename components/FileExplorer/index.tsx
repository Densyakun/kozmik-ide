import path from 'path';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CurrentPathInput from './CurrentPathInput';
import Directory from "./Directory";
import ParentDirectoryButton from './ParentDirectoryButton';
import useFileExplorer from '../../lib/useFileExplorer';

export default function FileExplorer() {
  const { currentPath, setCurrentPath } = useFileExplorer()

  const handleClick = (name: string) => {
    const newCurrentPath = path.resolve(currentPath, name)
    setCurrentPath(newCurrentPath)
  }

  return <>
    <Stack spacing={2}>
      <Typography variant="h6">
        File explorer
      </Typography>
      <Stack direction="row" alignItems="center" spacing={2}>
        <ParentDirectoryButton currentPath={currentPath} setCurrentPath={setCurrentPath} />
        <CurrentPathInput defaultValue={currentPath} setCurrentPath={setCurrentPath} />
      </Stack>
      <Directory path={currentPath} onClick={handleClick} />
    </Stack>
  </>
}
