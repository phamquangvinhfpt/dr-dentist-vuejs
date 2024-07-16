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
    async GetDentalRecords(pageNum: number, pageSize: number): Promise<DentalFilterResponse> {
      try {
        const res = await dentalService.GetAll(pageNum, pageSize)
        this.isLoading = false
        if (res[0] && typeof res[0] === 'object') {
          this.dentals = res[0] as DentalFilterResponse
        }
        return Promise.resolve(this.dentals)
      } catch (error) {
        this.dentals = {} as DentalFilterResponse
        return Promise.reject(error)
      }
    },
    async GetDentalRecordAndSearch(
      pageNum: number,
      pageSize: number,
      searchTerm: string,
    ): Promise<DentalFilterResponse> {
      try {
        const res = await dentalService.GetAllAndSearch(pageNum, pageSize, searchTerm)
        this.isLoading = false
        if (res[0] && typeof res[0] === 'object') {
          this.dentals = res[0] as DentalFilterResponse
        }
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
