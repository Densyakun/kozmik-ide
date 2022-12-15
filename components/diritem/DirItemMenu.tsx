import { Dispatch, SetStateAction, useContext, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import deleteButton from './menuitem/deleteButton';
import editCodeButton from './menuitem/editCodeButton';
import { setCodeEditorPathContext } from '../../pages';
import { Dir } from '../../pages/api/fs/dir';

export type Button = {
  text: string,
  icon?: typeof JSX.Element,
  onClick: (
    path: string,
    item: Dir[number],
    dirItems: Dir,
    setDirItems: (dirItems: Dir) => void,
    setCodeEditorPath: Dispatch<SetStateAction<string>>
  ) => void,
  filter?: (item: Dir[number]) => boolean
};

const actions: Button[] = [
  editCodeButton,
  deleteButton,
];

const ITEM_HEIGHT = 48;

export default function LongMenu({
  path,
  item,
  dirItems,
  setDirItems
}: {
  path: string,
  item: Dir[number],
  dirItems: Dir,
  setDirItems: (dirItems: Dir) => void
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const setCodeEditorPath = useContext(setCodeEditorPathContext);

  const actionItems = actions
    .filter(action => action.filter ? action.filter(item) : true)
    .map(action => (
      <MenuItem key={action.text} onClick={() => {
        action.onClick(path, item, dirItems, setDirItems, setCodeEditorPath);
        handleClose();
      }}>
        <ListItemIcon>
          {action.icon && <action.icon fontSize="small" />}
        </ListItemIcon>
        <ListItemText>{action.text}</ListItemText>
      </MenuItem>
    ));

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {actionItems}
      </Menu>
    </div>
  );
}