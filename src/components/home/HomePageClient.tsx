import type { IndustryProfile } from "@jaostudio/engine/types";
import { HomeHero } from "./HomeHero";
import { SelectedWorkHeader } from "./SelectedWorkHeader";
import { VerticalShowcase } from "./VerticalShowcase";
import { AboutSection } from "./AboutSection";
import { TrustBar } from "./TrustBar";
import { TestimonialQuote } from "./TestimonialQuote";
import { ContactSection } from "./ContactSection";
import { FooterAdapter } from "@/components/sections/footer/FooterAdapter";

type Props = {
  profiles: IndustryProfile[];
};

function bySlug(profiles: IndustryProfile[], slug: string) {
  return profiles.find((p) => p.slug === slug);
}

export function HomePageClient({ profiles }: Props) {
  const construction = bySlug(profiles, "summit-ridge");
  const dental = bySlug(profiles, "brightsmile");
  const legal = bySlug(profiles, "harrison-cole");

  return (
    <main>
      <HomeHero />
      <SelectedWorkHeader />
      {construction && <VerticalShowcase profile={construction} tone="default" />}
      {dental && <VerticalShowcase profile={dental} tone="elevated" />}
      {legal && <VerticalShowcase profile={legal} tone="default" />}
      <AboutSection />
      <TrustBar />
      <TestimonialQuote />
      <ContactSection />
      <FooterAdapter
        name="JAO Studio"
        email="hello@jaostudio.com"
        phone="+1 (555) 123-4567"
      />
    </main>
  );
}
