import type { TRegisterRequest, TRegisterResponse } from './register.type'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const postRegister = async (
  payload: TRegisterRequest,
): Promise<TRegisterResponse> => {
  await delay(500)
  // TODO real call: const { data } = await api.post<TRegisterResponse>('/auth/register', payload); return data
  return {
    success: true,
    message: 'Registration successful',
    data: {
      access_token: 'mock-access-token',
      user: { id: '1', email: payload.email, name: payload.name },
    },
  }
}
