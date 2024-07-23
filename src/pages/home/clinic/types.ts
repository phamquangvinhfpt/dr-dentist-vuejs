export interface Clinic {
  id: string
  ownerID: string
  name: string
  address: string | null
  verified: boolean
  owner: AppUser
  createdAt: Date
  updatedAt: Date
  clinicDetails: ClinicDetail[]
}
export interface AppUser {
  status: UserStatus
  birthDate: Date | null
  gender: Gender
  address: string | null
  imageUrl: string | null
}
export enum Gender {
  Female,
  Male,
}
export enum UserStatus {
  Active,
  Pending,
  Inactive,
}
export interface ClinicDetail {
  clinicID: string
  dayOfTheWeek: string
  openingTime: string
  closingTime: string
  slotDuration: number
  maxPatientsPerSlot: number
}
export interface DentalFilterResponse {
  pageNumber: number
  pageSize: number
  firstPage: string
  lastPage: string
  totalPages: number
  totalRecords: number
  nextPage: string | null
  previousPage: string | null
  data: Clinic[]
  succeeded: boolean
  errors: string | null
  message: string | null
}
