import { FixedSizeList, ListChildComponentProps } from 'react-window';
import Alert from '@mui/material/Alert';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import useDirectory from '../lib/useDirectory';
import { Dir } from '../pages/api/dir';

function renderRow(props: ListChildComponentProps<Dir>) {
  const { data: items, index, style } = props;
  const item = items[index];

  return (
    <ListItem
      style={style}
      key={index}
      component="div"
      disablePadding
      secondaryAction={
        <IconButton edge="end" aria-label="delete">
          <DeleteIcon />
        </IconButton>
      }
    >
      <ListItemButton>
        {item.isDirectory &&
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
        }
        <ListItemText inset={!item.isDirectory} primary={item.name} />
      </ListItemButton>
    </ListItem>
  );
}

export default function Directory({ path }: { path: string }) {
  const { items, isLoading, isError } = useDirectory(path);

  if (isLoading) return <Skeleton
    width={'100%'}
    height={400}
  />;
  if (isError) return <Alert severity="error">failed to load.</Alert>;

  if (!items.length) return <Alert severity="info">
    Your search did not match any documents.
  </Alert>;

  return (
    <>
      <FixedSizeList
        height={400}
        width={'100%'}
        itemCount={items.length}
        itemData={items}
        itemSize={46}
        overscanCount={5}
      >
        {renderRow}
      </FixedSizeList>
    </>
  )
}
