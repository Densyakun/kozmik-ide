import Link from 'next/link'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ForestIcon from '@mui/icons-material/Forest'
import { ButtonElementProps, MenuButton } from '../components/FileExplorer/diritem/ItemMenu'

const text = 'Open ts-morph editor'

const button: MenuButton = {
  text: text,
  filter: item => item.isDirectory,
  Element: ({ handleClose, path }: ButtonElementProps) => {
    return <Link href={`/ts-morph-editor?path=${path}`} passHref>
      <MenuItem onClick={() => {
        handleClose()
      }}>
        <ListItemIcon>
          <ForestIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>{text}</ListItemText>
      </MenuItem>
    </Link>
  }
}

export default button