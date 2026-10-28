import type { TUser } from '@/apis/auth/login/login.type'

export type TRegisterRequest = {
  name: string
  email: string
  password: string
}

export type TRegisterResponse = {
  success: boolean
  message: string
  data: {
    access_token: string
    user: TUser
  }
}
