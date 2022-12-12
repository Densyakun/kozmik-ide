import path from 'path';
import Stack from '@mui/material/Stack';
import CurrentPathInput from './CurrentPathInput';
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
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <ParentDirectoryButton currentPath={currentPath} setCurrentPath={setCurrentPath} />
        <CurrentPathInput defaultValue={currentPath} setCurrentPath={setCurrentPath} />
      </Stack>
      <Directory path={currentPath} onClick={handleClick} />
    </Stack>
  </>
}
