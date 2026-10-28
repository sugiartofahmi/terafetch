import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { postLogin } from './login.api'
import { loginSchema } from './login.schema'
import type { LoginFormData } from './login.schema'
import type { TLoginRequest, TLoginResponse } from './login.type'
import { cookies } from '@/libs/cookies'
import { sessionActions } from '@/integrations/tanstack-store/session.store'
import { permissionActions } from '@/integrations/tanstack-store/permission.store'
import { PERMISSION_CODES } from '@/apis/rbac/type.rbac'

export const useLogin = () => {
  const navigate = useNavigate()

  const loginMutation = useMutation<TLoginResponse, Error, TLoginRequest>({
    mutationFn: postLogin,
    onSuccess: (response) => {
      cookies.setAccessToken(response.data.access_token)
      sessionActions.setUser(response.data.user)
      permissionActions.setPermissions(
        [PERMISSION_CODES.DASHBOARD_VIEW],
        'member',
        false,
      )
    },
  })

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = form.handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: () => navigate({ to: '/dashboard' }),
    })
  })

  return {
    register: form.register,
    errors: form.formState.errors,
    onSubmit,
    isPending: loginMutation.isPending,
    error: loginMutation.error,
  }
}
