import { Dentist } from '@/pages/dentist/types'
import apiService from '@services/api.service'

class DentistService {
  async getAllDentists(): Promise<Dentist[]> {
    return apiService
      .get('/Dentist')
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async getDentistById(id: string): Promise<Dentist> {
    return apiService
      .get(`/Dentist/${id}`)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async createDentist(request: Dentist): Promise<Dentist> {
    return apiService
      .post('/Dentist', request)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async updateDentist(id: string, request: Dentist): Promise<Dentist> {
    return apiService
      .put(`/Dentist/${id}`, request)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async deleteDentist(id: string): Promise<any> {
    return apiService
      .delete(`/Dentist/${id}`)
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  // getAllDentistDetailsOfClinic
  async getAllDentistDetailsOfClinic(clinicId: string): Promise<DentistDetails[]> {
    try {
      const response = await apiService.get(`/Dentist/Clinic/${clinicId}`)
      console.log(`Fetched all dentists of clinic with ID ${clinicId}:`, response.data)
      return response.data
    } catch (error) {
      console.error(`Error fetching all dentists of clinic with ID ${clinicId}:`, this.formatError(error))
      throw error
    }
  }
}
export default new DentistService()
