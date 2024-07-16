import { DentalFilterResponse } from './../../pages/home/Clinic/types'
import ClinicService from '@services/clinic.service'
import { defineStore } from 'pinia'

export const clinicProfileStore = defineStore('clinicProfile', {
  state: () => ({
    clinic: {} as DentalFilterResponse,
    isLoading: false as boolean,
  }),
  actions: {
    async getClinicProfile(): Promise<DentalFilterResponse> {
      try {
        this.isLoading = true
        const response = await ClinicService.getAllClinics()
        console.log('module', response)
        this.isLoading = false
        this.clinic = response

        return await Promise.resolve(response)
      } catch (error) {
        this.isLoading = false
        return await Promise.reject(error)
      }
    },
  },
})
