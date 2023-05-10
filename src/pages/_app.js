import '../styles/globals.css'
import toast, { Toaster } from 'react-hot-toast'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { init } from '@amplitude/analytics-node'
import 'regenerator-runtime/runtime'

export default function App({ Component, pageProps }) {
  const [supabase] = useState(() => createBrowserSupabaseClient())

  init(process.env.AMPLITUDE_KEY)

  return (
    <div className="bg-white min-h-screen">
      <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
        <Toaster />
        <Component {...pageProps} />
      </SessionContextProvider>
    </div>
  )
}
