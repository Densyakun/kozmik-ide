import { FC, ReactNode } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import CodeEditor, { Provider } from '../components/CodeEditor'
import ExecShellCommandForm from '../components/ExecShellCommandForm'
import FileExplorer from '../components/FileExplorer'
import LoginForm from '../components/LoginForm'
import LogoutButton from '../components/LogoutButton'
import useUser from '../lib/useUser'

const Home: NextPage = () => {
  const { user } = useUser()

  let children = <>
    <FileExplorer />
    <CodeEditor />
    <ExecShellCommandForm />
  </>

  const providers: FC<{ children: ReactNode }>[] = [
    Provider
  ]
  providers.forEach(Provider => children = <Provider>{children}</Provider>)

  if (!user) return <></>

  return (
    <>
      <Head>
        <title>Kozmik IDE</title>
      </Head>

      {user.isLoggedIn
        ? <>
          {(user.loginPasswordIsExist ?? false) &&
            <LogoutButton />
          }

          <Container fixed>
            <Stack spacing={2}>
              {children}
            </Stack>
          </Container>
        </>
        : <LoginForm />
      }
    </>
  )
}

export default Home
