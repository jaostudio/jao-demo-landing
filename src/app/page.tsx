import { industryList } from '../industry'
import { HomePageClient } from '../components/home/HomePageClient'

export default function LandingPageHome() {
  return (
    <HomePageClient
      profiles={industryList}
    />
  )
}
