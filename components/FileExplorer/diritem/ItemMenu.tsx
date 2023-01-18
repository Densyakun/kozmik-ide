import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import deleteButton from './menuitem/deleteButton';
import editCodeButton from '../../CodeEditor/editCodeButton';
import openFileComponentEditorButton from '../../../FileComponentEditor/openEditorButton';
import openDirectoryComponentEditorButton from '../../../DirectoryComponentEditor/openEditorButton';
import { DirItem } from '../../../pages/api/fs/dir';

export type ButtonElementProps = {
  handleClose: () => void,
  path: string,
  item: DirItem,
  dirItems: DirItem[],
  setDirItems: (dirItems: DirItem[]) => void
};

export type MenuButton = {
  text: string,
  icon?: typeof JSX.Element,
  Element: (props: ButtonElementProps) => JSX.Element,
  filter?: (item: DirItem) => boolean
};

const actions: MenuButton[] = [
  openFileComponentEditorButton,
  openDirectoryComponentEditorButton,
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
  item: DirItem,
  dirItems: DirItem[],
  setDirItems: (dirItems: DirItem[]) => void
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const actionItems = actions
    .filter(action => action.filter ? action.filter(item) : true)
    .map(action => <action.Element key={action.text} handleClose={handleClose} path={path} item={item} dirItems={dirItems} setDirItems={setDirItems} />);

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