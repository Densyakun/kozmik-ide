import { FixedSizeList, ListChildComponentProps } from 'react-window';
import Alert from '@mui/material/Alert';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
import FolderIcon from '@mui/icons-material/Folder';
import LinkIcon from '@mui/icons-material/Link';
import useDirectory from '../lib/useDirectory';
import { Dir } from '../pages/api/dir';

function renderRow(props: ListChildComponentProps<{ items: Dir, onClick: (name: string) => void }>) {
  const { data: { items, onClick }, index, style } = props;
  const item = items[index];

  return (
    <ListItem
      style={style}
      key={index}
      component="div"
      disablePadding
    >
      <ListItemButton onClick={e => { if (item.isDirectory || item.isSymbolicLink) onClick(item.name) }}>
        {(item.isDirectory || item.isSymbolicLink) &&
          <ListItemIcon>
            {item.isDirectory && <FolderIcon />}
            {item.isSymbolicLink && <LinkIcon />}
          </ListItemIcon>
        }
        <ListItemText inset={!(item.isDirectory || item.isSymbolicLink)} primary={item.name} />
      </ListItemButton>
    </ListItem>
  );
}

export default function Directory({ path, onClick }: { path: string, onClick: (name: string) => void }) {
  let { items, isLoading, isError } = useDirectory(path);

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

  const items1 = [...directories, ...files];

  return (
    <>
      <FixedSizeList
        height={400}
        width={'100%'}
        itemCount={items1.length}
        itemData={{ items: items1, onClick: onClick }}
        itemSize={46}
        overscanCount={5}
      >
        {renderRow}
      </FixedSizeList>
    </>
  )
}
