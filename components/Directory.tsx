import { FixedSizeList, ListChildComponentProps } from 'react-window';
import Alert from '@mui/material/Alert';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
import FolderIcon from '@mui/icons-material/Folder';
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
      {item.isDirectory
        ? <ListItemButton onClick={e => { onClick(item.name) }}>
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText primary={item.name} />
        </ListItemButton>
        : <ListItemText inset primary={item.name} />
      }
    </ListItem>
  );
}

export default function Directory({ path, onClick }: { path: string, onClick: (name: string) => void }) {
  const { items, isLoading, isError } = useDirectory(path);

  if (isLoading) return <Skeleton
    width={'100%'}
    height={400}
  />;
  if (isError) return <Alert severity="error">failed to load.</Alert>;

  if (!items.length) return <Alert severity="info">
    Your search did not match any documents.
  </Alert>;

  items.sort((a, b) => a.isDirectory === b.isDirectory ? 0 : a.isDirectory ? -1 : 1);

  return (
    <>
      <FixedSizeList
        height={400}
        width={'100%'}
        itemCount={items.length}
        itemData={{ items: items, onClick: onClick }}
        itemSize={46}
        overscanCount={5}
      >
        {renderRow}
      </FixedSizeList>
    </>
  )
}
