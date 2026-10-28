import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { postRegister } from './register.api'
import { registerSchema } from './register.schema'
import type { RegisterFormData } from './register.schema'
import type { TRegisterRequest, TRegisterResponse } from './register.type'
import { cookies } from '@/libs/cookies'
import { sessionActions } from '@/integrations/tanstack-store/session.store'
import { permissionActions } from '@/integrations/tanstack-store/permission.store'
import { PERMISSION_CODES } from '@/apis/rbac/type.rbac'

export const useRegister = () => {
  const navigate = useNavigate()

  const registerMutation = useMutation<
    TRegisterResponse,
    Error,
    TRegisterRequest
  >({
    mutationFn: postRegister,
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

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = form.handleSubmit((data) => {
    registerMutation.mutate(data, {
      onSuccess: () => navigate({ to: '/dashboard' }),
    })
  })

  return {
    register: form.register,
    errors: form.formState.errors,
    onSubmit,
    isPending: registerMutation.isPending,
    error: registerMutation.error,
  }
}
