import { CreateDentalRequest } from '@/pages/dental/types'
import apiService from '@services/api.service'
class DentalService {
  async GetAll(pageNum: number): Promise<any> {
    return apiService
      .get(`/DentalRecord/getRecords?pageNumber=${pageNum}`)
      .then((response) => {
        return Promise.resolve(response.data.message)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async GetDentalByID(id: string): Promise<any> {
    return apiService
      .post('/DentalRecord/getRecord', { id: id })
      .then((response) => {
        return Promise.resolve(response.data.object)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async CreateDental(request: CreateDentalRequest): Promise<any> {
    return apiService
      .post('/DentalRecord/createDentalRecord', { request })
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async GetAppointmentForCreateDental(id: string): Promise<any> {
    return apiService
      .post('/DentalRecord/getAppointmentForCreate', { id: id })
      .then((response) => {
        return Promise.resolve(response.data.object)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}
export default new DentalService()
