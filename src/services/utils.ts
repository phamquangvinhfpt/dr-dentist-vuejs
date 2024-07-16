import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'
import 'dayjs/locale/en'

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)
import i18n from './../i18n'
const { t } = i18n.global
const local = i18n.global.locale.value === 'vi' ? 'vi' : 'en'

dayjs.locale(local)

const currentTimezone = dayjs.tz.guess()
export const sleep = (ms = 0) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Validation */
export const validators = {
  required: (v: any) => !!v || t('validateUtils.required'),
  required2: (fieldName: string) => (v: string) => !!v || t('validateUtils.required2', { fieldName }),

  minLength: (length: number) => (v: string) => (v && v.length >= length) || t('validateUtils.minLength', { length }),
  maxLength: (length: number) => (v: string | null) =>
    v === null || v.length <= length || t('validateUtils.maxLength', { length }),

  minValue: (min: number) => (v: string) => (v && parseFloat(v) >= min) || t('validateUtils.minValue', { min }),
  maxValue: (max: number) => (v: string) => (v && parseFloat(v) <= max) || t('validateUtils.maxValue', { max }),

  isCharacter: (fieldName: string) => (v: string) =>
    /^[\p{L} ]+$/u.test(v) || t('validateUtils.isCharacter', { fieldName }),
  isDecimalNumber: (fieldName: string) => (v: string) =>
    /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(v) || t('validateUtils.isDecimalNumber', { fieldName }),
  isNumber: (fieldName: string) => (v: string) => /^\d+$/.test(v) || t('validateUtils.isNumber', { fieldName }),
  email: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || t('validateUtils.email'),
  phone: (v: string) =>
    /(?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})/.test(v) ||
    t('validateUtils.phone'),
}

export const format = {
  formatDate: (date: Date) => {
    return dayjs(date).tz(currentTimezone).format('DD/MM/YYYY - HH:mm')
  },
  formatDateStr: (date: string) => {
    return dayjs(date).tz(currentTimezone).format('DD/MM/YYYY - HH:mm')
  },
  formatDateFromNow: (date: Date) => {
    return dayjs(date).tz(currentTimezone).fromNow()
  },
  formatTimeToX: (date1: Date, date2: Date) => {
    const start = dayjs(date1).tz(currentTimezone)
    const end = dayjs(date2).tz(currentTimezone)
    return end.from(start, true)
  },
  getTimeString: (date: string) => {
    const dateTime = dayjs(date).tz(currentTimezone)
    const now = dayjs().tz(currentTimezone)
    if (now.diff(dateTime, 'day') >= 365) {
      return dateTime.format('DD/MM/YYYY - HH:mm')
    } else {
      return dateTime.fromNow()
    }
  },
}

export const notifications = {
  updatedSuccessfully: (message: string) => {
    return t('validateUtils.updatedSuccessfully', { message }) + '\n'
  },
  createSuccessfully: (message: string) => {
    return t('validateUtils.createSuccessfully', { message }) + '\n'
  },
  deleteSuccessfully: (message: string) => {
    return t('validateUtils.deleteSuccessfully', { message }) + '\n'
  },
  getFailed: (message: string) => {
    return t('validateUtils.getFailed', { message }) + '\n'
  },
  updateFailed: (message: string) => {
    return t('validateUtils.updateFailed', { message }) + '\n'
  },
  createFailed: (message: string) => {
    return t('validateUtils.createFailed', { message }) + '\n'
  },
  deleteFailed: (message: string) => {
    return t('validateUtils.deleteFailed', { message }) + '\n'
  },
  unsavedChanges: t('validateUtils.unsavedChanges'),
  confirmDelete: (message: string) => {
    return t('validateUtils.confirmDelete', { message }) + '\n'
  },
}

export const getErrorMessage = (error: any): string => {
  if (error.response && error.response.data) {
    const { data } = error.response

    if (typeof data.isSuccess === 'boolean' && data.message) {
      return data.message
    }

    if (data.errors && typeof data.errors === 'object') {
      const errorMessages = Object.values(data.errors)
        .flat()
        .filter((msg) => typeof msg === 'string')
      if (errorMessages.length > 0) {
        return errorMessages.join(', ')
      }
    }

    if (data.title) {
      return data.title
    }

    return error.response.data
  }

  return error.message || 'An unknown error occurred'
}
