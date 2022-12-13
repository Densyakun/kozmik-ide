import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import deleteButton from './menuitem/deleteButton';
import { Dir } from '../../pages/api/dir';

export type Button = {
  text: string,
  icon?: typeof JSX.Element,
  onClick: (path: string, item: Dir[number], dirItems: Dir, setDirItems: (dirItems: Dir) => void) => void
};

const options: Button[] = [
  deleteButton,
];

const ITEM_HEIGHT = 48;

export default function LongMenu({ path, item, dirItems, setDirItems }: { path: string, item: Dir[number], dirItems: Dir, setDirItems: (dirItems: Dir) => void }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
        {options.map(option => (
          <MenuItem key={option.text} onClick={() => {
            option.onClick(path, item, dirItems, setDirItems);
            handleClose();
          }}>
            <ListItemIcon>
              {option.icon && <option.icon fontSize="small" />}
            </ListItemIcon>
            <ListItemText>{option.text}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}