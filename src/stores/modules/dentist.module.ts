import { DentistDetails } from '@/pages/dentist/types' // Ensure this path is correct
import DentistService from '@services/dentist.service' // Ensure this path is correct
import { defineStore } from 'pinia'

export const useDentistStore = defineStore('dentistProfile', {
  state: () => ({
    dentists: [] as DentistDetails[], // Use an array to hold multiple dentists
    isLoading: false as boolean,
    error: null as string | null,
  }),
  actions: {
    async getDentists(): Promise<void> {
      this.isLoading = true
      this.error = null
      try {
        const response = await DentistService.getAllDentists() // Fetch list of dentists
        console.log('Fetched dentists:', response)
        this.dentists = response // Set the fetched dentists
      } catch (error) {
        this.error = 'Failed to fetch dentists.'
        console.error('Error fetching dentists:', error)
      } finally {
        this.isLoading = false
      }
    },
    setError(message: string) {
      this.error = message
    },
  },
})
