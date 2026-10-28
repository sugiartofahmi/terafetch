import { Link } from '@tanstack/react-router'
import { useRegister } from '@/apis/auth/register/register.hook'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const RegisterForm = () => {
  const { register, errors, onSubmit, isPending, error } = useRegister()

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name')} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
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
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          {error && <p className="text-sm text-destructive">{error.message}</p>}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Creating account...' : 'Register'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/auth/login" className="underline">
              Log in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
