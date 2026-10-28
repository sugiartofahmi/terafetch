import type { TLoginRequest, TLoginResponse } from './login.type'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const postLogin = async (
  payload: TLoginRequest,
): Promise<TLoginResponse> => {
  await delay(500)
  // TODO real call: const { data } = await api.post<TLoginResponse>('/auth/login', payload); return data
  return {
    success: true,
    message: 'Login successful',
    data: {
      access_token: 'mock-access-token',
      user: { id: '1', email: payload.email, name: 'Mock User' },
    },
  }
}
