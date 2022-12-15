import DeleteIcon from '@mui/icons-material/Delete'
import { Button } from '../DirItemMenu'

const button: Button = {
  text: 'Delete', icon: DeleteIcon, onClick: (path, item, dirItems, setDirItems) => {
    path = encodeURIComponent(path)

    fetch(`/api/fs/remove?path=${path}`, {
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
}

export default button