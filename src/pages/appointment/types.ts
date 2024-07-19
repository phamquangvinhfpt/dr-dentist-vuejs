export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

export interface Appointment extends BaseEntity {
  patientID: string
  dentistID: string
  clinicID: string
  timeSlot: string
  type: AppointmentType
  duration: number
  status: AppointmentStatus
  date: string
  patient: User
  dentist: User
  clinic: Clinic
}

export enum AppointmentType {
  Examination,
  Treatment,
  Reexamination,
  Periodic,
}

export enum AppointmentStatus {
  Scheduled,
  Completed,
  Cancelled,
  Pending,
}

export interface User {
  status: UserStatus
  fullName: string
  birthDate: string | null
  gender: Gender
  address: string | null
  imageUrl: string | null
  id: string
  userName: string
  normalizedUserName: string
  email: string
  normalizedEmail: string
  emailConfirmed: boolean
  passwordHash: string
  securityStamp: string
  concurrencyStamp: string
  phoneNumber: string
  phoneNumberConfirmed: boolean
  twoFactorEnabled: boolean
  lockoutEnd: string | null
  lockoutEnabled: boolean
  accessFailedCount: number
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

export interface Clinic {
  ownerID: string
  name: string
  address: string
  verified: boolean
  owner: string | null
  clinicDetails: any[]
  id: string
  createdAt: string
  updatedAt: string
}

export interface AppointmentRequest {
  patientID: string
  dentistID: string
  clinicID: string
  timeSlot: string
  type: AppointmentType
  duration: number
  status: AppointmentStatus
  date: string
}
