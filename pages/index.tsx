import type { NextPage } from 'next'
import Head from 'next/head'
import Container from '@mui/material/Container'
import FileExplorer from '../components/FileExplorer'
import LoginForm from '../components/LoginForm'
import LogoutButton from '../components/LogoutButton'
import useUser from '../lib/useUser'

const Home: NextPage = () => {
  const { user } = useUser()

  if (!user) return <></>

  return (
    <>
      <Head>
        <title>Kozmik IDE</title>
      </Head>

      {user.isLoggedIn
        ? (
          <>
            {(user.loginPasswordIsExist ?? false) &&
              <LogoutButton />
            }

            <Container fixed>
              <FileExplorer path='./' />
            </Container>
          </>
        )
        : (
          <>
            < LoginForm />
          </>
        )
      }
    </>
  )
}

export default Home
