import {
  ChangeEmailFormData,
  ChangePhoneNumberFormData,
  FilterUser,
  PasswordDetailFormData,
  Roles,
  UserDetail,
  UserDetailsUpdate,
} from '@/pages/user/types'
import { defineStore } from 'pinia'
import userService from '@services/user.service'
import { useAuthStore } from './auth.module'

export const useUserProfileStore = defineStore('userProfile', {
  state: () => ({
    userDetails: {} as UserDetail,
    isLoading: false as boolean,
  }),
  actions: {
    async getUserProfile(): Promise<any> {
      try {
        this.isLoading = true
        const response = await userService.getUserProfile()
        this.isLoading = false
        this.userDetails = { ...response?.data }
        useAuthStore().setUserDetails({ ...response?.data })
        return await Promise.resolve(response)
      } catch (error) {
        this.isLoading = false
        return await Promise.reject(error)
      }
    },
    async getUserById(userId: string): Promise<any> {
      try {
        this.isLoading = true
        const response = await userService.getUserById(userId)
        this.isLoading = false
        this.userDetails = { ...response.data }
        console.log('check', response.data)
        return await Promise.resolve(response.data)
      } catch (error) {
        this.isLoading = false
        return await Promise.reject(error)
      }
    },
    async updateProfile(data: UserDetailsUpdate): Promise<any> {
      try {
        this.isLoading = true
        const response = await userService.updateProfile(data)
        this.isLoading = false
        return await Promise.resolve(response)
      } catch (error) {
        this.isLoading = false
        return await Promise.reject(error)
      }
    },
    async changePassword(data: PasswordDetailFormData): Promise<any> {
      try {
        this.isLoading = true
        const response = await userService.changePassword(data)
        this.isLoading = false
        return await Promise.resolve(response)
      } catch (error) {
        this.isLoading = false
        return await Promise.reject(error)
      }
    },
    async sendPhoneOTPCode(): Promise<any> {
      try {
        this.isLoading = true
        const response = await userService.sendPhoneOTPCode()
        this.isLoading = false
        return await Promise.resolve(response)
      } catch (error) {
        this.isLoading = false
        return await Promise.reject(error)
      }
    },
    async changeEmail(data: ChangeEmailFormData): Promise<any> {
      try {
        this.isLoading = true
        const response = await userService.changeEmail(data)
        this.isLoading = false
        return await Promise.resolve(response)
      } catch (error) {
        this.isLoading = false
        return await Promise.reject(error)
      }
    },
    async changePhone(data: ChangePhoneNumberFormData): Promise<any> {
      try {
        this.isLoading = true
        const response = await userService.changePhone(data)
        this.isLoading = false
        return await Promise.resolve(response)
      } catch (error) {
        this.isLoading = false
        return await Promise.reject(error)
      }
    },
    async uploadAvatar(data: FormData): Promise<any> {
      try {
        this.isLoading = true
        const response = await userService.uploadAvatar(data)
        this.isLoading = false
        return await Promise.resolve(response)
      } catch (error) {
        this.isLoading = false
        return await Promise.reject(error)
      }
    },
    async removeAvatar(data: FormData): Promise<any> {
      try {
        this.isLoading = true
        const response = await userService.removeAvatar(data)
        this.isLoading = false
        return await Promise.resolve(response)
      } catch (error) {
        this.isLoading = false
        return await Promise.reject(error)
      }
    },
    async getOTPConfirmation(data: string): Promise<any> {
      try {
        this.isLoading = true
        const response = await userService.getOTPConfirmation(data)
        this.isLoading = false
        return await Promise.resolve(response)
      } catch (error) {
        this.isLoading = false
        return await Promise.reject(error)
      }
    },
    async sendVerifyEmail(): Promise<any> {
      try {
        this.isLoading = true
        const response = await userService.sendVerifyEmail()
        this.isLoading = false
        return await Promise.resolve(response)
      } catch (error) {
        this.isLoading = false
        return await Promise.reject(error)
      }
    },
  },
})

export const useUserStore = defineStore('users', {
  state: () => ({
    id: '' as string,
    userDetails: [] as UserDetail[],
    isLoading: false as boolean,
  }),
  actions: {
    async getUsers(filter: FilterUser): Promise<any> {
      try {
        this.isLoading = true
        const response = await userService.getAllUsers(filter)
        this.isLoading = false
        this.userDetails = response?.data
        return await Promise.resolve(response)
      } catch (error) {
        this.isLoading = false
        return await Promise.reject(error)
      }
    },
    async updateUserRole(userId: string, roleType: Roles): Promise<any> {
      try {
        this.isLoading = true
        const response = await userService.updateUserRole(userId, roleType)
        this.isLoading = false
        await this.getUsers({} as FilterUser)
        return await Promise.resolve(response)
      } catch (error) {
        this.isLoading = false
        return await Promise.reject(error)
      }
    },

    async lockUserAccount(userId: string): Promise<any> {
      try {
        this.isLoading = true
        const response = await userService.lockUserAccount(userId)
        this.isLoading = false
        await this.getUsers({} as FilterUser)
        return await Promise.resolve(response)
      } catch (error) {
        this.isLoading = false
        return await Promise.reject(error)
      }
    },

    async unlockUserAccount(userId: string): Promise<any> {
      try {
        this.isLoading = true
        const response = await userService.unlockUserAccount(userId)
        this.isLoading = false
        await this.getUsers({} as FilterUser)
        return await Promise.resolve(response)
      } catch (error) {
        this.isLoading = false
        return await Promise.reject(error)
      }
    },

    async deleteUserAccount(userId: string): Promise<any> {
      try {
        this.isLoading = true
        const response = await userService.deleteUserAccount(userId)
        this.isLoading = false
        await this.getUsers({} as FilterUser)
        return await Promise.resolve(response)
      } catch (error) {
        this.isLoading = false
        return await Promise.reject(error)
      }
    },
  },
})
