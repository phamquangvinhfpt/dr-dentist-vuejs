export interface INavigationRoute {
  name: string
  displayName: string
  meta: {
    icon: string
    permission?: string
  }
  children?: INavigationRoute[]
}

export default {
  root: {
    name: '/',
    displayName: 'navigationRoutes.home',
  },
  routes: [
    {
      name: 'dashboard',
      displayName: 'menu.dashboard',
      meta: {
        icon: 'vuestic-iconset-dashboard',
      },
    },
    {
      name: 'users-management',
      displayName: 'menu.usersManagement',
      meta: {
        icon: 'vuestic-iconset-user',
        permission: 'Users.View',
      },
    },
    {
      name: 'record',
      displayName: 'menu.record',
      meta: {
        icon: 'vuestic-iconset-exam',
        permission: 'DentalRecords.View',
      },
      children: [
        {
          name: 'record-list',
          displayName: 'menu.record-list',
          meta: {
            icon: 'vuestic-iconset-exam',
            permission: 'DentalRecords.View',
          },
        },
      ],
    },
    {
      name: 'audit logs',
      displayName: 'menu.audit-logs',
      meta: {
        icon: 'list_alt',
        permission: 'AuditLogs.View',
      },
    },
    {
      name: 'appointment',
      displayName: 'menu.appointment',
      meta: {
        icon: 'vuestic-iconset-calendar',
        permission: 'Appointments.View',
      },
      children: [
        {
          name: 'appointment-list',
          displayName: 'menu.appointment-list',
          meta: {
            icon: 'vuestic-iconset-calendar',
            permission: 'Appointments.View',
          },
        },
        {
          name: 'appointment-schedule',
          displayName: 'menu.appointment-schedule',
          meta: {
            icon: 'vuestic-iconset-calendar',
            permission: 'Appointments.Create',
          },
        },
      ],
    },
    {
      name: 'dentist',
      displayName: 'menu.dentist',
      meta: {
        icon: 'vuestic-iconset-dentist',
      },
      children: [
        {
          name: 'dentist-list',
          displayName: 'menu.dentist-list',
          meta: {
            icon: 'vuestic-iconset-exam',
          },
        },
        {
          name: 'create-dentist',
          displayName: 'menu.create-dentist',
          meta: {
            icon: 'vuestic-iconset-plus',
          },
        },
        // {
        //   name: 'update-dentist',
        //   displayName: 'menu.update-dentist',
        //   meta: {
        //     icon: 'vuestic-iconset-edit',
        //   },
        // },
        {
          name: 'delete-dentist',
          displayName: 'menu.delete-dentist',
          meta: {
            icon: 'vuestic-iconset-delete',
          },
        },
      ],
    },
  ] as INavigationRoute[],
}
