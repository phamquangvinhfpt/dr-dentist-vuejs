import { GetAppointmentForCreateDental } from './../../pages/dental/types'
import { defineStore } from 'pinia'
import dentalService from '@services/dental.service'
import {
  DentalRecord,
  DentalFilterResponse,
  CreateDentalRequest,
  GetAppointmentForCreateDental,
} from '@/pages/dental/types'

export const useDentalStore = defineStore('groupDental', {
  state: () => {
    return {
      dentals: {} as DentalFilterResponse,
      dental: null as DentalRecord | null,
      isLoading: true as boolean,
      id: '' as string,
    }
  },
  actions: {
    async GetDentalRecords(pageNum: number): Promise<DentalFilterResponse> {
      try {
        const res = await dentalService.GetAll(pageNum)
        console.log('dental.module', res)
        this.isLoading = false
        if (res[0] && typeof res[0] === 'object') {
          this.dentals = res[0] as DentalFilterResponse
        }
        console.log('dental.module.dentals', this.dentals)
        return Promise.resolve(this.dentals)
      } catch (error) {
        this.dentals = {} as DentalFilterResponse
        return Promise.reject(error)
      }
    },
    async GetDentalRecordByID(id: string): Promise<DentalRecord> {
      try {
        const res = await dentalService.GetDentalByID(id)
        this.isLoading = false
        this.dental = res
        return Promise.resolve(res)
      } catch (error) {
        this.dental = null
        return Promise.reject(error)
      }
    },
    async CreateDental(request: CreateDentalRequest): Promise<DentalRecord> {
      try {
        const res = await dentalService.CreateDental(request)
        this.isLoading = false
        return Promise.resolve(res)
      } catch (error) {
        this.dental = null
        return Promise.reject(error)
      }
    },
    async GetAppointmentForCreateDental(request: string): Promise<GetAppointmentForCreateDental> {
      try {
        const res = await dentalService.GetAppointmentForCreateDental(request)
        this.isLoading = false
        return Promise.resolve(res)
      } catch (error) {
        this.dental = null
        return Promise.reject(error)
      }
    },
  },
})
