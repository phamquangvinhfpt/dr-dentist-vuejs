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
  ] as INavigationRoute[],
}
