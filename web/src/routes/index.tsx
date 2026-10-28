import { createFileRoute, redirect } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Footer } from './-components/footer'
import { Navbar } from './-components/navbar'
import { cookies } from '@/libs/cookies'
import { match } from '@/libs/pattern'

const LandingPage = () => (
  <div className="flex min-h-screen flex-col">
    <Navbar />

    <main className="mx-auto flex flex-1 w-full max-w-3xl items-center px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="space-y-6"
      >
        <div className="size-16 rounded-full bg-gradient-to-br from-primary to-primary/40" />
        <h1 className="text-3xl font-bold tracking-tight">Hi, I'm MNFS.</h1>
      </motion.div>
    </main>

    <Footer />
  </div>
)

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    match(cookies.isAuthenticated())
      .with(true, () => {
        throw redirect({ to: '/dashboard' })
      })
      .otherwise(() => {})
  },
  component: LandingPage,
})
