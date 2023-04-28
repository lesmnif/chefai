import { useState, useEffect } from 'react'
import LandingPageTailwind from '../components/LandingPageTailwind'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import LoaderPage from '../components/LoaderPage'
import Home from '../components/HomeComponent'

export default function Landing() {
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
        ) : !session? (
          <LandingPageTailwind supabaseClient={supabase} session={session} />
        ) : (
          <Home supabaseClient={supabase} session={session} />
        )}
      </div>
    </div>
  )
}
