import CodeIcon from '@mui/icons-material/Code'
import { Button } from '../DirItemMenu'

const button: Button = {
  text: 'Edit code',
  icon: CodeIcon,
  filter: item => !item.isDirectory,
  onClick: (path, item, dirItems, setDirItems, setCodeEditorPath) => {
    setCodeEditorPath(() => path)
  }
}

export default button