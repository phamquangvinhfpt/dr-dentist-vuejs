export interface DentalRecord extends BaseEntity {
  appointmentID: string
  appointment: Appointment
  prescriptions: Prescription[]
  medicalRecord: MedicalRecord
  followUpAppointments: FollowUpAppointment[]
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
  data: Dentals[]
  succeeded: boolean
  errors: string | null
  message: string | null
}
export interface Dentals extends BaseEntity {
  dentist: string
  patient: string
  appointmentID: string
  date: Date
  timeSlot: string
  duration: number
  status: number
  type: number
}
// types.d.ts
export interface PrescriptionRequest {
  medicineName: string
  dosage: string
  instructions: string
}
export interface GetAppointmentForCreateDental {
  timeSlot: string
  type: number
  duration: number
  status: number
  date: string
  patient: string
  dentist: string
  clinic: string
}
export interface MedicalRecordRequest {
  symptoms: string
  diagnosis: string
  treatment: string
}

export interface FollowUpAppointmentRequest {
  scheduledDate: string
  reason: string
}

export interface CreateDentalRequest {
  appointmentID: string
  prescriptionRequests: PrescriptionRequest[]
  medicalRecordRequest: MedicalRecordRequest
  followUpAppointmentRequest: FollowUpAppointmentRequest
}
export interface FollowUpAppointment extends BaseEntity {
  dentalRecordId: string
  scheduledDate: string
  reason: string
  isSuccess: boolean
}

export interface MedicalRecord extends BaseEntity {
  appointmentId: string
  dentalRecordId: string
  symptoms: string
  diagnosis: string
  treatment: string
}

export interface Prescription extends BaseEntity {
  dentalRecordId: string
  medicineName: string
  dosage: string
  instructions: string
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
export type SettingShowDetail = {
  id: string
  name: string
  icon: string
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
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}
