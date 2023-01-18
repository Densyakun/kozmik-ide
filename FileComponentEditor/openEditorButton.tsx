import { useContext } from 'react'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import { setPathContext } from '.'
import { ButtonElementProps, MenuButton } from '../components/FileExplorer/diritem/ItemMenu'

const text = 'Open file component editor'

const button: MenuButton = {
  text: text,
  filter: item => !item.isDirectory,
  Element: ({ handleClose, path }: ButtonElementProps) => {
    const setPath = useContext(setPathContext)

    return <MenuItem onClick={() => {
      handleClose()

      setPath(() => path)
    }}>
      <ListItemIcon>
        <ShareOutlinedIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>{text}</ListItemText>
    </MenuItem>
  }
}

export default button