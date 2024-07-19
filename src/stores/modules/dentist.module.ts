import { DentistDetails } from '@/pages/dentist/types'
import DentistService from '@services/dentist.service'
import { defineStore } from 'pinia'

export const useDentistStore = defineStore('dentistProfile', {
  state: () => ({
    dentists: [] as DentistDetails[],
    isLoading: false as boolean,
    error: null as string | null,
  }),
  actions: {
    async getDentists(): Promise<void> {
      this.isLoading = true
      this.error = null
      try {
        const response = await DentistService.getAllDentists()
        this.dentists = response
      } catch (error) {
        this.error = 'Failed to fetch dentists.'
        console.error('Error fetching dentists:', error)
      } finally {
        this.isLoading = false
      }
    },
    async getDentistById(id: string): Promise<DentistDetails> {
      this.isLoading = true
      this.error = null
      try {
        const response = await DentistService.getDentistById(id)
        console.log('API Response:', response) // Thêm dòng này
        return response
      } catch (error) {
        this.error = 'Failed to load dentist.'
        console.error('Error loading dentist:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },
    async createDentist(dentist: DentistDetails): Promise<void> {
      this.isLoading = true
      this.error = null
      try {
        const response = await DentistService.createDentist(dentist)
        this.dentists.push(response)
      } catch (error) {
        this.error = 'Failed to create dentist.'
        console.error('Error creating dentist:', error)
      } finally {
        this.isLoading = false
      }
    },
    async updateDentist(dentist: DentistDetails): Promise<void> {
      this.isLoading = true
      this.error = null
      try {
        await DentistService.updateDentist(dentist.dentistId, dentist)
        const index = this.dentists.findIndex((d) => d.dentistId === dentist.dentistId)
        if (index !== -1) {
          this.dentists[index] = dentist
        }
      } catch (error) {
        this.error = 'Failed to update dentist.'
        console.error('Error updating dentist:', error)
      } finally {
        this.isLoading = false
      }
    },
    async deleteDentist(id: string): Promise<void> {
      this.isLoading = true
      this.error = null
      try {
        await DentistService.deleteDentist(id)
        // Re-fetch the dentists to ensure the list is updated
        await this.getDentists()
      } catch (error) {
        this.error = 'Failed to delete dentist.'
        console.error('Error deleting dentist:', error)
      } finally {
        this.isLoading = false
      }
    },
    setError(message: string) {
      this.error = message
    },
  },
})
