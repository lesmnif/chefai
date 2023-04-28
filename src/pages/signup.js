import Home from '../components/HomeComponent'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useState, useEffect } from 'react'
import LoaderPage from '../components/LoaderPage'
import SignUp from '../components/SignUp'
import Account from '../components/Account'
import Loader from '../components/Loader'


export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(true)

  const [session, setSession] = useState(null)
  const supabase = useSupabaseClient()
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setIsLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setIsLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <div>
      <div>
        {isLoading ? (
          <LoaderPage />
        ) : !session ? (
          <SignUp supabaseClient={supabase} />
        ) : (
          <Home supabaseClient={supabase} session={session} />
        )}
      </div>
    </div>
  )
}
