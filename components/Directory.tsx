import { resolve } from 'path';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import Alert from '@mui/material/Alert';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Skeleton from '@mui/material/Skeleton';
import FolderIcon from '@mui/icons-material/Folder';
import LinkIcon from '@mui/icons-material/Link';
import CreateDirItemNameInput from './diritem/CreateDirItemNameInput';
import DirItemNameInput from './diritem/DirItemNameInput';
import DirItemMenu from './diritem/DirItemMenu';
import useDirectory from '../lib/useDirectory';
import { Dir } from '../pages/api/fs/dir';

function renderRow(props: ListChildComponentProps<{
  items: { item: Dir[number], element: JSX.Element }[],
  onClick: (name: string) => void,
  currentPath: string,
  dirItems: Dir,
  setDirItems: (diritems: Dir) => void
}>) {
  const { data: { items, onClick, currentPath, dirItems, setDirItems }, index, style } = props;
  const { item, element } = items[index];

  return (
    <ListItem
      style={style}
      key={index}
      component="div"
      disablePadding
    >
      <ListItemButton onClick={e => { if (item.name && (item.isDirectory || item.isSymbolicLink)) onClick(item.name) }}>
        <ListItemIcon>
          {item.isDirectory && <FolderIcon />}
          {item.name && item.isSymbolicLink && <LinkIcon />}
        </ListItemIcon>
      </ListItemButton>
      {element}
      {item.name && <DirItemMenu path={resolve(currentPath, item.name)} item={item} dirItems={dirItems} setDirItems={setDirItems} />}
    </ListItem>
  );
}

export default function Directory({
  path,
  onClick
}: {
  path: string,
  onClick: (name: string) => void
}) {
  let { items, isLoading, isError, mutate } = useDirectory(path);

  if (isLoading) return <Skeleton
    width={'100%'}
    height={400}
  />;
  if (isError) return <Alert severity="error">failed to load.</Alert>;

  let directories: { item: Dir[number], element: JSX.Element }[] = [];
  let files: { item: Dir[number], element: JSX.Element }[] = [];
  items.forEach(item => item.isDirectory || item.isSymbolicLink
    ? directories.push({ item, element: <DirItemNameInput currentPath={path} item={item} dirItems={items} setDirItems={mutate} /> })
    : files.push({ item, element: <DirItemNameInput currentPath={path} item={item} dirItems={items} setDirItems={mutate} /> }));

  const items1: { item: Dir[number], element: JSX.Element }[] = [
    ...directories,
    {
      item: { name: "", isSymbolicLink: false, isDirectory: true },
      element: <CreateDirItemNameInput currentPath={path} isDirectory={true} dirItems={items} setDirItems={mutate} />
    },
    ...files,
    {
      item: { name: "", isSymbolicLink: false, isDirectory: false },
      element: <CreateDirItemNameInput currentPath={path} isDirectory={false} dirItems={items} setDirItems={mutate} />
    }
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
