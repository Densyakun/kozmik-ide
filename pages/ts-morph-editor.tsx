import path from 'path'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Container from '@mui/material/Container'
import useUser from '@/lib/useUser'
import { Project } from 'ts-morph'
import { KozmikFileSystemHost } from '@/TSMorphEditor/FileSystemHost'
import { useEffect, useState } from 'react'

const Home: NextPage = () => {
  const { user } = useUser()

  const router = useRouter()
  const { path: projectPath } = router.query

  const [sourceFilesCount, setSourceFilesCount] = useState(-1)

  let [diagnosticsCount, setDiagnosticsCount] = useState(-1)

  let [formatDiagnosticsWithColorAndContext, setFormatDiagnosticsWithColorAndContext] = useState("")

  let [project, setProject] = useState<Project>()

  useEffect(() => {
    if (!project) return;

    const sourceFiles = project.getSourceFiles()
    setSourceFilesCount(sourceFiles.length)

    const diagnostics = project.getPreEmitDiagnostics()
    setDiagnosticsCount(diagnostics.length)

    setFormatDiagnosticsWithColorAndContext(project.formatDiagnosticsWithColorAndContext(diagnostics))
  }, [project])

  useEffect(() => {
    if (!user || !user.isLoggedIn || !projectPath) return

    const fs = new KozmikFileSystemHost()

    fs.downloadOnInit(projectPath as string)
      .then(() => {
        setProject(new Project({
          fileSystem: fs,
          tsConfigFilePath: path.join(projectPath as string, 'tsconfig.json'),
        }))

        fs.useDownloadedFilePaths = false
      })
  }, [user, user?.isLoggedIn, projectPath])

  if (!user || !user.isLoggedIn || !projectPath) return <></>

  return (
    <>
      <Head>
        <title>Kozmik IDE - ts-morph editor</title>
      </Head>

      <Container fixed>
        <p>Project path: {projectPath}</p>
        <p>Source files: {sourceFilesCount}</p>
        <p>Diagnostics: {diagnosticsCount}</p>
        <p>{formatDiagnosticsWithColorAndContext}</p>
      </Container>
    </>
  )
}

export default Home
