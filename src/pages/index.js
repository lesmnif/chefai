import { useState, useEffect } from "react"
import LandingPageTailwind from "../components/LandingPageTailwind"
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react"
import LoaderPage from "../components/LoaderPage"
import Home from "../components/HomeComponent"
import GetTimers from "../functions/GetTimers"

export default function Landing() {
  const [isLoading, setIsLoading] = useState(true)

  const [session, setSession] = useState(null)
  const supabase = useSupabaseClient()
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    setIsLoading(false)
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    GetTimers(`1. Preheat your oven to 375°F.
    2. In a large mixing bowl, toss the diced chicken breast with olive oil, cumin, chili powder, salt and pepper.
    3. Spread the chicken onto a lined baking sheet.
    4. In the same mixing bowl, toss the red and green bell peppers and sliced onions with olive oil, salt, and pepper.
    5. Spread the vegetables onto a separate lined baking sheet.
    6. Roast both the chicken and vegetables in the preheated oven for 20-25 minutes, or until the chicken is cooked through and the vegetables are tender.
    7. In a separate pot, cook the brown rice according to the package instructions.
    8. In a small saucepan, heat the black beans on medium heat until warmed through.
    9. Assemble each burrito bowl by dividing the cooked brown rice, roasted chicken, roasted vegetables, and black beans evenly among four meal prep containers.
    10. Seal the containers and store in the fridge for up to 5 days.
    Enjoy your Meal Prep Chicken Burrito Bowls throughout the week!`)
  }, [])

  return (
    <div>
      <div>
        {!session ? (
          <LandingPageTailwind supabaseClient={supabase} session={session} />
        ) : (
          <Home supabaseClient={supabase} />
        )}
      </div>
    </div>
  )
}
