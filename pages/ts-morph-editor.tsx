import path from 'path'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Container from '@mui/material/Container'
import useUser from '@/lib/useUser'
import { Project } from 'ts-morph'
import { KozmikFileSystemHost } from '@/TSMorphEditor/FileSystemHost'

const Home: NextPage = () => {
  const { user } = useUser()

  const router = useRouter()
  const { path: projectPath } = router.query

  if (!user || !user.isLoggedIn || !projectPath) return <></>

  const fs = new KozmikFileSystemHost()
  const project = new Project({
    fileSystem: fs,
    tsConfigFilePath: path.join(projectPath as string, 'tsconfig.json'),
  })

  const sourceFiles = project.getSourceFiles()

  const diagnostics = project.getPreEmitDiagnostics()

  const formatDiagnosticsWithColorAndContext = project.formatDiagnosticsWithColorAndContext(diagnostics)

  return (
    <>
      <Head>
        <title>Kozmik IDE - ts-morph editor</title>
      </Head>

      <Container fixed>
        <p>Project path: {projectPath}</p>
        <p>Source files: {sourceFiles.length}</p>
        <p>Diagnostics: {diagnostics.length}</p>
        <p>{formatDiagnosticsWithColorAndContext}</p>
      </Container>
    </>
  )
}

export default Home
