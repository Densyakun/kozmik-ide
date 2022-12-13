import DeleteIcon from '@mui/icons-material/Delete'
import { Button } from '../DirItemMenu'

const button: Button = {
  text: 'Delete', icon: DeleteIcon, onClick: (path, item, dirItems, setDirItems) => {
    path = encodeURIComponent(path)

    if (item.isDirectory)
      fetch("/api/dir", {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: path })
      })
        .then((response: any) => {
          if (!response.ok) throw new Error('Network response was not OK')

          dirItems.splice(dirItems.findIndex(item => item.name === item.name), 1)

          setDirItems([...dirItems])
        })
        .catch((error) => {
          console.error(error)
        })
    else
      fetch("/api/file", {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: path })
      })
        .then((response: any) => {
          if (!response.ok) throw new Error('Network response was not OK')

          setDirItems([...dirItems])
        })
        .catch((error) => {
          console.error(error)
        })
  }
}

export default button