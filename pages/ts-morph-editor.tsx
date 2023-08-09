import path from 'path'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Container from '@mui/material/Container'
import useUser from '@/lib/useUser'
import { Project } from 'ts-morph'

export const getServerSideProps: GetServerSideProps<{
  sourceFilesCount: number,
  diagnosticsCount: number,
  formatDiagnosticsWithColorAndContext: string,
}> = async (context) => {
  const project = new Project({
    tsConfigFilePath: path.join(context.query.path as string as string, 'tsconfig.json'),
  })

  const sourceFiles = project.getSourceFiles()

  const diagnostics = project.getPreEmitDiagnostics()

  const formatDiagnosticsWithColorAndContext = project.formatDiagnosticsWithColorAndContext(diagnostics)

  return {
    props: {
      sourceFilesCount: sourceFiles.length,
      diagnosticsCount: diagnostics.length,
      formatDiagnosticsWithColorAndContext,
    }
  }
}

export default function Page({
  sourceFilesCount,
  diagnosticsCount,
  formatDiagnosticsWithColorAndContext,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { user } = useUser()

  const router = useRouter()
  const { path: projectPath } = router.query

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
