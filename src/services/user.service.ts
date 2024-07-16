import {
  ChangeEmailFormData,
  ChangePhoneNumberFormData,
  FilterUser,
  PasswordDetailFormData,
  Roles,
  UserDetailsUpdate,
} from '@/pages/user/types'
import apiService from '@services/api.service'
import JwtService from '@services/jwt.service'

class UserService {
  async getUserProfile(): Promise<any> {
    return apiService
      .get(`/personal/profile`)
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async updateProfile(data: UserDetailsUpdate): Promise<any> {
    return apiService
      .put(`/personal/profile`, data)
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async changePassword(data: PasswordDetailFormData): Promise<any> {
    return apiService
      .put(`/personal/update-password`, data)
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async changeEmail(data: ChangeEmailFormData): Promise<any> {
    return apiService
      .put(`/personal/update-email`, data)
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async changePhone(data: ChangePhoneNumberFormData): Promise<any> {
    return apiService
      .put(`/personal/update-phone`, data)
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async sendPhoneOTPCode(): Promise<any> {
    return apiService
      .get(`/users/resend-phone-number-code`)
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async uploadAvatar(data: FormData): Promise<any> {
    const axiosInstance = apiService.getAxiosInstance()
    return axiosInstance
      .put(`/personal/update-avatar`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: JwtService.getAuthHeader(),
        },
      })
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async removeAvatar(data: FormData): Promise<any> {
    const axiosInstance = apiService.getAxiosInstance()
    return axiosInstance
      .put(`/personal/update-avatar`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: JwtService.getAuthHeader(),
        },
      })
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async getOTPConfirmation(data: string): Promise<any> {
    return apiService
      .get(`/users/confirm-phone-number?code=${data}`)
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async sendVerifyEmail(): Promise<any> {
    return apiService
      .get(`/personal/resend-email-confirm`)
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async getAllUsers(filter: FilterUser): Promise<any> {
    return apiService
      .post(`/users/get-all-users`, filter)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async updateUserRole(userId: string, roleType: Roles): Promise<any> {
    return apiService
      .put(`/update-user-role/${roleType}?userId=${userId}`, {})
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async lockUserAccount(userId: string): Promise<any> {
    return apiService
      .put(`/lock-user-account?userId=${userId}`, {})
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async unlockUserAccount(userId: string): Promise<any> {
    return apiService
      .put(`/unlock-user-account?userId=${userId}`, {})
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async deleteUserAccount(userId: string): Promise<any> {
    return apiService
      .delete(`/users/delete-user-account?userId=${userId}`)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}
export default new UserService()
