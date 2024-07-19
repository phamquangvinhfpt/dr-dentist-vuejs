import apiService from '@services/api.service'
import { AppointmentRequest } from '@/pages/appointment/types'

class AppointmentService {
  async GetAll(): Promise<any> {
    return apiService
      .get('/Appoinment/GetAll')
      .then((response) => {
        console.log('appointment.service', response)
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async GetById(id: string): Promise<any> {
    return apiService
      .get(`/Appoinment/GetById?id=${id}`)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async Create(appointment: AppointmentRequest): Promise<any> {
    return apiService
      .post('/Appoinment/Create', appointment)
      .then((response) => {
        console.log('appointment.create', response)
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async Update(id: string, appointment: AppointmentRequest): Promise<any> {
    return apiService
      .put(`/Appoinment/Update?id=${id}`, appointment)
      .then((response) => {
        console.log('appointment.update', response)
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async Delete(id: string): Promise<any> {
    return apiService
      .delete(`/Appoinment/Delete?id=${id}`)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async CreateAppointmentForPeriodic(appointment: AppointmentRequest): Promise<any> {
    return apiService
      .post('/Appoinment/CreateAppointmentForPeriodic', appointment)
      .then((response) => {
        console.log('appointment.periodic.create', response)
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}

export default new AppointmentService()
