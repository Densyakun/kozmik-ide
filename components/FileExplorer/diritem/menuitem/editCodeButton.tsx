import { useContext } from 'react'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import CodeIcon from '@mui/icons-material/Code'
import { setCodeEditorPathContext } from '../../../CodeEditor'
import { ButtonElementProps, MenuButton } from '../../../FileExplorer/diritem/DirItemMenu'

const text = 'Edit code'

const button: MenuButton = {
  text: text,
  filter: item => !item.isDirectory,
  Element: ({ handleClose, path }: ButtonElementProps) => {
    const setCodeEditorPath = useContext(setCodeEditorPathContext)

    return <MenuItem onClick={() => {
      handleClose()

      setCodeEditorPath(() => path)
    }}>
      <ListItemIcon>
        <CodeIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>{text}</ListItemText>
    </MenuItem>
  }
}

export default button