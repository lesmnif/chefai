import Pricing from '../../components/Pricing'
import * as React from 'react'
import { useRouter } from 'next/router'

export default function PricingPage() {
  const router = useRouter()
  const { language } = router.query

  console.log('what is my lang :)', language)

  return <Pricing language={language} />
}
