import path from 'path';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

export default function ParentDirectoryButton({ currentPath, setCurrentPath }: { currentPath: string, setCurrentPath: (newCurrentPath: string) => void }) {
  const parentPath = path.resolve(currentPath, '../');

  return <IconButton aria-label="up one level"
    component={Link}
    href={`?currentPath=${parentPath}`}
    onClick={e => {
      e.preventDefault();
      setCurrentPath(parentPath);
    }}>
    <ArrowUpwardIcon />
  </IconButton>;
}
