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
    async createDentist(dentist: DentistDetails): Promise<void> {
      this.isLoading = true
      this.error = null
      try {
        const response = await DentistService.createDentist(dentist)
        console.log('--->', response)

        this.dentists.push(response)
      } catch (error) {
        this.error = 'Failed to create dentist.'
        console.error('Error creating dentist:', error)
      } finally {
        this.isLoading = false
      }
    },
    async getDentistById(id: string): Promise<DentistDetails> {
      this.isLoading = true
      this.error = null
      try {
        const dentist = await DentistService.getDentistById(id)
        return dentist
      } catch (error) {
        this.error = 'Failed to load dentist.'
        console.error('Error loading dentist:', error)
        throw error // Ensure the error is re-thrown to be caught by the caller
      } finally {
        this.isLoading = false
      }
    },
    async updateDentist(dentist: DentistDetails): Promise<void> {
      this.isLoading = true
      this.error = null
      try {
        await DentistService.updateDentist(dentist.dentistId, dentist)
      } catch (error) {
        this.error = 'Failed to update dentist.'
        console.error('Error updating dentist:', error)
      } finally {
        this.isLoading = false
      }
    },
    async deleteDentist(dentistId: string): Promise<void> {
      this.isLoading = true
      this.error = null
      try {
        await DentistService.deleteDentist(dentistId)
        this.dentists = this.dentists.filter((dentist) => dentist.dentistId !== dentistId)
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
