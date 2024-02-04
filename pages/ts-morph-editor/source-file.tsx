import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import useUser from '@/lib/useUser'
import dynamic from 'next/dynamic';

const SourceFileContainer = dynamic(() => import('@/TSMorphEditor/SourceFileContainer'), { ssr: false });

const Home: NextPage = () => {
  const { user } = useUser()

  const router = useRouter()
  const { path: filePath } = router.query

  if (!user || !user.isLoggedIn || !filePath) return <></>

  return (
    <>
      <Head>
        <title>{filePath} - ts-morph editor - Kozmik IDE</title>
      </Head>

      <SourceFileContainer filePath={filePath as string} />
    </>
  )
}

export default Home
