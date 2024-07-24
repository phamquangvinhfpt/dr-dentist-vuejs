import apiService from '@services/api.service'

class PermissionService {
  async GetAll(): Promise<any> {
    return apiService
      .get(`permissions`)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async GetPermissionByUserID(id: string): Promise<any> {
    return apiService
      .get(`/permissions/user?UserId=${id}`)
      .then((response) => {
        console.log('user - permission - service', response.data)
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async AddPermissionByUserID(id: string, action: string, resource: string): Promise<any> {
    return apiService
      .post(`/add-permission?UserId=${id}&Action=${action}&Resource=${resource}`, '')
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async DeletePermissionByUserID(id: string, action: string, resouce: string): Promise<any> {
    return apiService
      .delete(`/remove-permission?UserId=${id}&Action=${action}&Resource=${resouce}`)
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}
export default new PermissionService()
