import { Link } from '@tanstack/react-router'

const navLinks = ['Work', 'About', 'Contact']

export const Navbar = () => (
  <header className="border-b">
    <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
      <Link to="/" className="text-sm font-semibold tracking-tight">
        MNFS.DEV
      </Link>
      <nav className="flex items-center gap-6">
        {navLinks.map((link) => (
          <a
            key={link}
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {link}
          </a>
        ))}
        <Link
          to="/auth/login"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Sign in
        </Link>
      </nav>
    </div>
  </header>
)
