import { Clinic, ClinicRequest, DentalFilterResponse } from '@/pages/home/clinic/types'
import apiService from '@services/api.service'

class ClinicService {
  async getAllClinics(): Promise<DentalFilterResponse> {
    return apiService.get('/Clinics/Clinics').then((response) => response.data)
  }

  async addClinic(newClinic: ClinicRequest): Promise<Clinic> {
    return apiService.post('/Clinics/AddClinics', newClinic).then((response) => response.data)
  }

  async updateClinic(updatedClinic: Clinic): Promise<Clinic> {
    console.log('Check update123', updatedClinic)
    const clinicID = updatedClinic.id
    return apiService.put(`/Clinics/UpdateClinics/${clinicID}`, updatedClinic).then((response) => response.data)
  }

  async deleteClinic(clinicId: string): Promise<any> {
    return apiService.delete(`/Clinics/DeleteClinics/${clinicId}`).then(() => undefined)
  }
}

export default new ClinicService()
