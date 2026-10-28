import { FlowIllustration } from './components/flow-illustration'
import { Hero } from './components/hero'
import { LinkForm } from './components/link-form'
import { SupportedLinks } from './components/supported-links'

export const HomeTemplate = () => {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center py-6 sm:py-10">
      <Hero />
      <LinkForm />
      <SupportedLinks />
      <FlowIllustration />
    </main>
  )
}
