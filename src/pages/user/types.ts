// export type UserDetail = {
//   id: string
//   userName: string
//   firstName: string
//   lastName: string
//   email: string
//   isActive: boolean
//   emailConfirmed: boolean
//   phoneNumberConfirmed: boolean
//   phoneNumber: string
//   imageUrl: string | null
//   birthDate: string | null
//   gender: boolean
// }

export interface UserDetail {
  id: string
  userName: string
  fullName: string
  gender: Gender
  birthDate: string
  email: string
  status: UserStatus
  emailConfirmed: boolean
  phoneNumber: string
  phoneNumberConfirmed: boolean
  imageUrl: string
}

export enum Gender {
  Female,
  Male,
}

export enum UserStatus {
  Active,
  Pending,
  Inactive
}

export type SettingProfile = {
  id: string
  name: string
  icon: string
}

export type UserDetailFormData = {
  fullName: string
  email: string
  dob: string | null
  gender: Gender | null
  phoneNumber: string
  imageUrl: string | null
}

export type PasswordDetailFormData = {
  password: string
  confirmNewPassword: string
  newPassword: string
}

export type UserDetailsUpdate = {
  fullName: string
  gender: Gender | null
  birthDate: string | null
}

export type ChangeEmailFormData = {
  password: string
  email: string
}

export type ChangePhoneNumberFormData = {
  password: string
  phoneNumber: string
}

export type ImageAvatar = {
  name: string
  extension: string
  data: any
}

export type Avatar = {
  image: ImageAvatar
}

export type RemoveAvatar = {
  deleteCurrentImage: boolean
}
