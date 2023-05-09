import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import DeleteIcon from '@mui/icons-material/Delete'
import { ButtonElementProps, MenuButton } from '../ItemMenu'

const text = 'Delete'

const button: MenuButton = {
  text: text,
  Element: ({ handleClose, path, item, dirItems, setDirItems }: ButtonElementProps) => {
    return <MenuItem onClick={() => {
      handleClose()
      //ファイル消す時に確認する
      var res = confirm(`Are you sure you want to delete ${item.name}?`)

      if(res == true){
        fetch(`/api/fs/remove?path=${encodeURIComponent(path)}`, {
          method: 'POST'
        })

        .then((response: Response) => {
          if (!response.ok) throw new Error('Network response was not OK')

          dirItems.splice(dirItems.findIndex(item => item.name === item.name), 1)

          setDirItems([...dirItems])
        })
        .catch((error) => {
          console.error(error)
        })
      }

      if(res == false){
      alert("File not deleted") 

        return
      }
        
    }}>
      <ListItemIcon>
        <DeleteIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>{text}</ListItemText>
    </MenuItem>
  }
}

export default button