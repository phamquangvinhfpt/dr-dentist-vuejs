import { Dentist } from '@/pages/dentist/types'
import dentistService from '@services/dentist.service'
import { defineStore } from 'pinia'
export const useDentistStore = defineStore('dentistProfile', {
  state: () => ({}),
  actions: {
    async getDentists(): Promise<any> {
      return dentistService
        .getAllDentists()
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async getDentistById(id: string): Promise<Dentist> {
      return dentistService
        .getDentistById(id)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async createDentist(dentist: Dentist): Promise<any> {
      return dentistService
        .createDentist(dentist)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async updateDentist(id: string, dentist: Dentist): Promise<any> {
      return dentistService
        .updateDentist(id, dentist)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async deleteDentist(id: string): Promise<any> {
      return dentistService
        .deleteDentist(id)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
  },
})
