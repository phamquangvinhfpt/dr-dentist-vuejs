import { DentistDetails } from '@/pages/dentist/types'
import apiService from '@services/api.service'

class DentistService {
  [x: string]: any

  // Fetch all dentists with pagination
  async getAllDentists(): Promise<any> {
    return apiService
      .get('/Dentist')
      .then((response) => {
        console.log(response.data)
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  // Fetch a single dentist by ID
  async getDentistById(id: string): Promise<any> {
    return apiService
      .get(`/Dentist/${id}`)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  // Create a new dentist
  async createDentist(request: DentistDetails): Promise<any> {
    return apiService
      .post('/Dentist', request)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  // Update an existing dentist
  async updateDentist(id: string, request: DentistDetails): Promise<any> {
    return apiService
      .put(`/Dentist/${id}`, request)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  // Delete a dentist by ID
  async deleteDentist(id: string): Promise<any> {
    return apiService
      .delete(`/Dentist/${id}`)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}

export default new DentistService()
