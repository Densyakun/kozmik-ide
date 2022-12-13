import { resolve } from 'path';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import Alert from '@mui/material/Alert';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
import FolderIcon from '@mui/icons-material/Folder';
import LinkIcon from '@mui/icons-material/Link';
import DirectoryOrFileNameInput from './diritem/DirectoryOrFileNameInput';
import DirItemMenu from './diritem/DirItemMenu';
import useDirectory from '../lib/useDirectory';
import { Dir } from '../pages/api/dir';

function renderRow(props: ListChildComponentProps<{
  items: (Dir[number]
    | {
      name?: undefined,
      isDirectory: boolean,
      element: JSX.Element
    })[], onClick: (name: string) => void, currentPath: string, dirItems: Dir, setDirItems: (diritems: Dir) => void
}>) {
  const { data: { items, onClick, currentPath, dirItems, setDirItems }, index, style } = props;
  const item = items[index];
  const isDirItem = item.name !== undefined;

  return (
    <ListItem
      style={style}
      key={index}
      component="div"
      disablePadding
    >
      <ListItemButton onClick={e => { if (isDirItem && (item.isDirectory || item.isSymbolicLink)) onClick(item.name) }}>
        <ListItemIcon>
          {item.isDirectory && <FolderIcon />}
          {isDirItem && item.isSymbolicLink && <LinkIcon />}
        </ListItemIcon>
        {item.name === undefined
          ? item.element
          : <ListItemText primary={item.name} />
        }
      </ListItemButton>
      {item.name !== undefined && <DirItemMenu path={resolve(currentPath, item.name)} item={item} dirItems={dirItems} setDirItems={setDirItems} />}
    </ListItem>
  );
}

export default function Directory({ path, onClick }: { path: string, onClick: (name: string) => void }) {
  let { items, isLoading, isError, mutate } = useDirectory(path);

  if (isLoading) return <Skeleton
    width={'100%'}
    height={400}
  />;
  if (isError) return <Alert severity="error">failed to load.</Alert>;

  if (!items.length) return <Alert severity="info">
    Your search did not match any documents.
  </Alert>;

  let directories: Dir = [];
  let files: Dir = [];
  items.forEach(item => item.isDirectory || item.isSymbolicLink ? directories.push(item) : files.push(item));

  const handleMakeDirItem = (newItem: Dir[number]) => {
    mutate([...items, newItem]);
  };

  const items1 = [
    ...directories,
    { isDirectory: true, element: <DirectoryOrFileNameInput currentPath={path} handleMakeDirItem={handleMakeDirItem} isDirectory={true} /> },
    ...files,
    { isDirectory: false, element: <DirectoryOrFileNameInput currentPath={path} handleMakeDirItem={handleMakeDirItem} isDirectory={false} /> }
  ];

  return (
    <>
      <FixedSizeList
        height={400}
        width={'100%'}
        itemCount={items1.length}
        itemData={{ items: items1, onClick, currentPath: path, dirItems: items, setDirItems: mutate }}
        itemSize={46}
        overscanCount={5}
      >
        {renderRow}
      </FixedSizeList>
    </>
  )
}
