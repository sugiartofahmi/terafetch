import { Link } from '@tanstack/react-router'
import { useLogin } from '@/apis/auth/login/login.hook'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const LoginForm = () => {
  const { register, errors, onSubmit, isPending, error } = useLogin()

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Log in</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
          {error && <p className="text-sm text-destructive">{error.message}</p>}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Logging in...' : 'Log in'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            No account?{' '}
            <Link to="/auth/register" className="underline">
              Register
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
