export type TLoginRequest = {
  email: string
  password: string
}

export type TUser = {
  id: string
  email: string
  name: string
}

export type TLoginResponse = {
  success: boolean
  message: string
  data: {
    access_token: string
    user: TUser
  }
}
