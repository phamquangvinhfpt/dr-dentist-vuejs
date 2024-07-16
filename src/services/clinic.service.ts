import apiService from '@services/api.service'

class ClinicService {
  async getAllClinics(): Promise<any> {
    return apiService
      .get(`/Clinics/Clinics`)
      .then((response) => {
        console.log('service', response.data)
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}
export default new ClinicService()
