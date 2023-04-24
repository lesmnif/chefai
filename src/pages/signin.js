import Home from "../components/HomeComponent"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react"
import { useState, useEffect } from "react"
import LoaderPage from "../components/LoaderPage"
import SignIn from "../components/SignIn"
import Account from "../components/Account"

export default function SignInPage() {
  const [dataLoaded, setDataLoaded] = useState(false)
  const [sessionChecked, setSessionChecked] = useState(false)
  const session = useSession()
  const supabase = useSupabaseClient()

  useEffect(() => {
    if (session || sessionChecked) {
      setDataLoaded(true)
    } else {
      setSessionChecked(true)
    }
  }, [session, sessionChecked])

  return (
    <div>
      {!dataLoaded ? (
        <LoaderPage />
      ) : (
        <div>
          {!session ? (
            <SignIn supabaseClient={supabase} />
          ) : (
            <Home supabaseClient={supabase} />
            )}
        </div>
      )}
    </div>
  )
}
