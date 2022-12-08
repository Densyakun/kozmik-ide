import path from 'path';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Directory from "./Directory";

const initCurrentPath = './'

export default function FileExplorer() {
  const router = useRouter()

  const [currentPath, setCurrentPath] = useState('')

  useEffect(() => {
    setCurrentPath(router.query.currentPath as string || initCurrentPath)
  }, [router.query.currentPath])

  const handleClick = (name: string) => {
    const newCurrentPath = path.resolve(currentPath, name)
    setCurrentPath(newCurrentPath)
    router.push(newCurrentPath === initCurrentPath ? {} : { query: { currentPath: newCurrentPath } }, undefined, { scroll: false })
  }

  return <>
    <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
      {currentPath}
    </Typography>
    <Directory path={currentPath} onClick={handleClick} />
  </>
}
