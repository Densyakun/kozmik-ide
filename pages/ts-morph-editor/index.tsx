import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Container from '@mui/material/Container'
import useUser from '@/lib/useUser'
import { useEffect, useState } from 'react'
import { ProjectJson } from '@/pages/api/ts-morph/project'
import NodeComponent from '@/TSMorphEditor/NodeComponent'

import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

function BasicList({ sourceFiles }: { sourceFiles: string[] }) {
  return (
    <List>
      {sourceFiles.map(sourceFile =>
        <ListItem disablePadding>
          <ListItemButton component="a" href={`/ts-morph-editor/source-file?path=${sourceFile}`}>
            <ListItemText primary={sourceFile} />
          </ListItemButton>
        </ListItem>
      )}
    </List>
  );
}


const Home: NextPage = () => {
  const { user } = useUser()

  const router = useRouter()
  const { path: projectPath } = router.query

  let [project, setProject] = useState<ProjectJson>()

  function fetchProject() {
    fetch(`/api/ts-morph/project?path=${encodeURIComponent(projectPath as string)}`, {
      method: 'GET',
    })
      .then(async (response: Response) => {
        if (!response.ok) throw new Error('Network response was not OK');

        //setDirty(false);
        setProject(await response.json());
      })
      .catch(error => {
        console.error(error);
      });
  }

  useEffect(() => {
    if (!user || !user.isLoggedIn || !projectPath) return

    fetchProject()
  }, [user, user?.isLoggedIn, projectPath])

  if (!user || !user.isLoggedIn || !projectPath) return <></>

  return (
    <>
      <Head>
        <title>Kozmik IDE - ts-morph editor</title>
      </Head>

      <Container fixed>
        <p>Project path: {projectPath}</p>
        {project && <>
          <p>Source files ({project.sourceFiles.length}):</p>
          {/*project.sourceFiles.map(sourceFile => <>
            <p>{sourceFile.filePath}</p>
            {sourceFile.filePath === "/workspaces/kozmik-ide/pages/index.tsx" &&
              <NodeComponent node={sourceFile} />
            }
          </>)*/}
          <BasicList sourceFiles={project.sourceFiles} />
          {/*<p>Diagnostics: {project.diagnostics}</p>*/}
          <p>{project.formatDiagnosticsWithColorAndContext}</p>
        </>}
      </Container>
    </>
  )
}

export default Home
