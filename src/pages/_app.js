import "../styles/globals.css"
import toast, { Toaster } from "react-hot-toast"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { SessionContextProvider } from "@supabase/auth-helpers-react"
import { useEffect, useState } from "react"

export default function App({ Component, pageProps }) {
  const [supabase] = useState(() => createBrowserSupabaseClient())

  return (
    <div className="bg-white min-h-screen">
      <SessionContextProvider
        supabaseClient={supabase}
        initialSession={pageProps.initialSession}
      >
        <Toaster />
        <Component {...pageProps} />
      </SessionContextProvider>
    </div>
  )
}
