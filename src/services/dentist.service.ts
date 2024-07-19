import { DentistDetails } from '@/pages/dentist/types'
import apiService from '@services/api.service'
import { AxiosError } from 'axios'

class DentistService {
  // Fetch all dentists with pagination
  async getAllDentists(): Promise<DentistDetails[]> {
    try {
      const response = await apiService.get('/Dentist')
      console.log('Fetched all dentists:', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching all dentists:', this.formatError(error))
      throw error
    }
  }

  // Fetch a single dentist by ID
  async getDentistById(id: string): Promise<DentistDetails> {
    try {
      const response = await apiService.get(`/Dentist/${id}`)
      console.log(`Fetched dentist with ID ${id}:`, response.data)
      return response.data
    } catch (error) {
      console.error(`Error fetching dentist with ID ${id}:`, this.formatError(error))
      throw error
    }
  }

  // Create a new dentist
  async createDentist(request: DentistDetails): Promise<DentistDetails> {
    try {
      const response = await apiService.post('/Dentist', request)
      console.log('Created new dentist:', response.data)
      return response.data
    } catch (error) {
      console.error('Error creating dentist:', this.formatError(error))
      throw error
    }
  }

  // Update an existing dentist
  async updateDentist(id: string, request: DentistDetails): Promise<DentistDetails> {
    try {
      const response = await apiService.put(`/Dentist/${id}`, request)
      console.log(`Updated dentist with ID ${id}:`, response.data)
      return response.data
    } catch (error) {
      console.error(`Error updating dentist with ID ${id}:`, this.formatError(error))
      throw error
    }
  }

  // Delete a dentist by ID
  async deleteDentist(id: string): Promise<void> {
    try {
      await apiService.delete(`/Dentist/${id}`)
      console.log(`Deleted dentist with ID ${id}`)
    } catch (error) {
      console.error(`Error deleting dentist with ID ${id}:`, this.formatError(error))
      throw error
    }
  }

  // Utility function to format error messages
  private formatError(error: any): string {
    if (error instanceof AxiosError) {
      return error.response?.data?.message || error.message
    }
    return error.message || 'An unexpected error occurred'
  }
}

export default new DentistService()
