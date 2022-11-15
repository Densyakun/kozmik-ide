import type { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'
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

      {user.isLoggedIn === true && (user.loginPasswordIsExist ?? false) &&
        <LogoutButton />
      }

      <div className="container">
        {!user.isLoggedIn &&
          <LoginForm />
        }
      </div>
    </>
  )
}

export default Home
