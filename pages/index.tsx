import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import CodeEditor from '../components/CodeEditor'
import ExecShellCommandForm from '../components/ExecShellCommandForm'
import FileExplorer from '../components/FileExplorer'
import LoginForm from '../components/LoginForm'
import LogoutButton from '../components/LogoutButton'
import useUser from '../lib/useUser'

export const codeEditorPathContext = createContext("")
export const setCodeEditorPathContext = createContext<Dispatch<SetStateAction<string>>>(() => undefined)

const CodeEditorPathProvider = ({ children }: { children: ReactNode }) => {
  const [codeEditorPath, setCodeEditorPath] = useState("");

  return (
    <codeEditorPathContext.Provider value={codeEditorPath}>
      <setCodeEditorPathContext.Provider value={setCodeEditorPath}>
        {children}
      </setCodeEditorPathContext.Provider>
    </codeEditorPathContext.Provider>
  );
};

const Home: NextPage = () => {
  const { user } = useUser()

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
              <CodeEditorPathProvider>
                <FileExplorer />
                <CodeEditor />
                <ExecShellCommandForm />
              </CodeEditorPathProvider>
            </Stack>
          </Container>
        </>
        : <LoginForm />
      }
    </>
  )
}

export default Home
