import { optionsActionType } from './types'

export const ActionEnum = {
  Create: {
    Action: 'create',
    Color: 'text-success',
  },
  Update: {
    Action: 'update',
    Color: 'text-warning',
  },
  Delete: {
    Action: 'delete',
    Color: 'text-danger',
  },
  Default: {
    Color: 'text-black',
  },
}

export const pageSizeOptions: number[] = [10, 25, 50, 100, 250]
export const optionsAction: optionsActionType[] = [
  {
    label: 'All',
    value: '',
  },
  {
    label: 'Create',
    value: 'create',
  },
  {
    label: 'Update',
    value: 'update',
  },
  {
    label: 'Delete',
    value: 'delete',
  },
]
