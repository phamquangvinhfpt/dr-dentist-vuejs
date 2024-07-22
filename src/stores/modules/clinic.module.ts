import { Clinic, DentalFilterResponse } from '@/pages/home/clinic/types'
import ClinicService from '@services/clinic.service'
import { defineStore } from 'pinia'

export const clinicProfileStore = defineStore('clinicProfile', {
  state: () => ({
    clinics: [] as Clinic[],
    selectedClinic: null as Clinic | null,
    isLoading: false as boolean,
  }),
  actions: {
    async getAllClinics(): Promise<any> {
      this.isLoading = true
      try {
        const response: DentalFilterResponse = await ClinicService.getAllClinics()
        this.clinics = response.data
      } finally {
        this.isLoading = false
      }
    },
    async addClinic(newClinic: Clinic): Promise<any> {
      const response: Clinic = await ClinicService.addClinic(newClinic)
      this.clinics.push(response)
    },
    async updateClinic(updatedClinic: Clinic): Promise<any> {
      const response: Clinic = await ClinicService.updateClinic(updatedClinic)
      const index = this.clinics.findIndex((c) => c.ownerID === updatedClinic.ownerID)
      if (index !== -1) {
        this.clinics[index] = response
      }
    },
    async deleteClinic(clinicId: string): Promise<any> {
      await ClinicService.deleteClinic(clinicId)
      this.clinics = this.clinics.filter((c) => c.ownerID !== clinicId)
    },
    selectClinic(clinic: Clinic) {
      this.selectedClinic = clinic
    },
    clearSelectedClinic() {
      this.selectedClinic = null
    },
  },
})
