import { DentistDetails } from '@/pages/dentist/types'
import apiService from '@services/api.service'
import { AxiosError } from 'axios'

class DentistService {
  // Fetch all dentists with pagination
  async getAllDentists(): Promise<DentistDetails[]> {
    try {
      const response = await apiService.get('/Dentist')
      console.log(response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching all dentists:', error)
      throw error
    }
  }

  // Fetch a single dentist by ID
  async getDentistById(id: string): Promise<DentistDetails> {
    try {
      const response = await apiService.get(`/Dentist/${id}`)
      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(`Error fetching dentist with ID ${id}:`, error.response?.data || error.message)
      } else {
        console.error(`Unexpected error fetching dentist with ID ${id}:`, error)
      }
      throw error
    }
  }

  // Create a new dentist
  async createDentist(request: DentistDetails): Promise<DentistDetails> {
    try {
      const response = await apiService.post('/Dentist', request)
      return response.data
    } catch (error) {
      console.error('Error creating dentist:', error)
      throw error
    }
  }

  // Update an existing dentist
  async updateDentist(id: string, request: DentistDetails): Promise<DentistDetails> {
    try {
      const response = await apiService.put(`/Dentist/${id}`, request)
      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(`Error updating dentist with ID ${id}:`, error.response?.data || error.message)
      } else {
        console.error(`Unexpected error updating dentist with ID ${id}:`, error)
      }
      throw error
    }
  }

  // Delete a dentist by ID
  async deleteDentist(id: string): Promise<void> {
    try {
      await apiService.delete(`/Dentist/${id}`)
    } catch (error) {
      console.error(`Error deleting dentist with ID ${id}:`, error)
      throw error
    }
  }
}

export default new DentistService()
