export const routes = {
  api: {
    auth: '/api/auth',
    image: '/api/image',
    user: '/api/user',
    chip: '/api/chip',
    folder: '/api/folder',
    bookmark: '/api/bookmark',
  },
  auth: {
    register: '/register',
    login: '/login',
  },
  image: {
    root: '/',
    byId: '/:id',
  },
  user: {
    root: '/',
    byId: '/:id',
  },
  chip: {
    root: '/',
    byId: '/:id',
  },
  folder: {
    root: '/',
    sort: '/sort',
    byId: '/:id',
  },
  bookmark: {
    root: '/',
    recent: '/recent',
    recentById: '/recent/:id',
    recentSort: '/recent/sort',
    recentFilter: '/recent/filter',
    recentSearch: '/recent/search',
    search: '/search',
    sort: '/sort',
    byFolderId: '/:folder_id',
    byId: '/:id',
  },
} as const;
