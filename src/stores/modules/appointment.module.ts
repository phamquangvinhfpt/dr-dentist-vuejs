import { Appointment } from './../../pages/dental/types'
import { defineStore } from 'pinia'
import AppointmentService from '@services/appointment.service'
import { AppointmentRequest } from '@/pages/appointment/types'
import { AppointmentType } from '@/pages/appointment/types'

interface AppointmentState {
  appointments: Appointment[]
  appointment: Appointment | null
  isLoading: boolean
  error: string | null
}

export const useAppointmentStore = defineStore('appointment', {
  state: (): AppointmentState => ({
    appointments: [],
    appointment: null,
    isLoading: false,
    error: null,
  }),
  actions: {
    async fetchAllAppointments() {
      this.isLoading = true
      this.error = null
      try {
        const response = await AppointmentService.GetAll()
        this.appointments = response
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async fetchAppointmentById(id: string) {
      this.isLoading = true
      this.error = null
      try {
        const response = await AppointmentService.GetById(id)
        this.appointment = response
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async createAppointment(appointmentRequest: AppointmentRequest) {
      this.isLoading = true
      this.error = null
      try {
        appointmentRequest.type = AppointmentType.Examination
        const response = await AppointmentService.Create(appointmentRequest)
        this.appointments.push(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async updateAppointment(id: string, appointmentRequest: AppointmentRequest) {
      this.isLoading = true
      this.error = null
      try {
        const response = await AppointmentService.Update(id, appointmentRequest)
        const index = this.appointments.findIndex((a) => a.id === id)
        if (index !== -1) {
          this.appointments[index] = response
        }
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async deleteAppointment(id: string) {
      this.isLoading = true
      this.error = null
      try {
        await AppointmentService.Delete(id)
        this.appointments = this.appointments.filter((a) => a.id !== id)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async createPeriodicAppointment(appointmentRequest: AppointmentRequest) {
      this.isLoading = true
      this.error = null
      try {
        const response = await AppointmentService.CreateAppointmentForPeriodic(appointmentRequest)
        this.appointments.push(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },
  },
})
