import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Container from '@mui/material/Container'
import useUser from '@/lib/useUser'
import { useEffect, useState } from 'react'
import NodeComponent from '@/TSMorphEditor/NodeComponent'
import { NodeJson } from '../api/ts-morph/source-file'

const Home: NextPage = () => {
  const { user } = useUser()

  const router = useRouter()
  const { path: filePath } = router.query

  let [sourceFile, setSourceFile] = useState<NodeJson>()

  function fetchSourceFile() {
    fetch(`/api/ts-morph/source-file-save-test?path=${encodeURIComponent(filePath as string)}`, {
      method: 'GET',
    })
      .then(async (response: Response) => {
        if (!response.ok) throw new Error('Network response was not OK');

        //setDirty(false);
        setSourceFile(await response.json());
      })
      .catch(error => {
        console.error(error);
      });
  }

  useEffect(() => {
    if (!user || !user.isLoggedIn || !filePath) return

    fetchSourceFile()
  }, [user, user?.isLoggedIn, filePath])

  if (!user || !user.isLoggedIn || !filePath) return <></>

  return (
    <>
      <Head>
        <title>{filePath} - ts-morph editor - Kozmik IDE</title>
      </Head>

      <Container fixed>
        <p>File path: {filePath}</p>
        {sourceFile && <NodeComponent node={sourceFile} />}
      </Container>
    </>
  )
}

export default Home
