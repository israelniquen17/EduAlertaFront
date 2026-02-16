
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: 'https://israelniquen17.github.io/EduALerta/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/EduALerta"
  },
  {
    "renderMode": 2,
    "route": "/EduALerta/dashboard"
  },
  {
    "renderMode": 2,
    "route": "/EduALerta/alumnos"
  },
  {
    "renderMode": 2,
    "route": "/EduALerta/crear-alumno"
  },
  {
    "renderMode": 2,
    "route": "/EduALerta/lector-qr"
  },
  {
    "renderMode": 2,
    "route": "/EduALerta/alumno-qr"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 910, hash: '54cf511bfcfc2e92fe3a1b72cfcfad0616900d4e633838aa205ee106f2f5b57e', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1423, hash: 'c1353e499aa82593f2fde45d57f8bde852d074594dd69b6ba7a6cd7c453de6ed', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 282, hash: '85cea37c53a405c7636ad7db7f11c8294c8243ff125abdf275cc22d1cde34f68', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'alumnos/index.html': {size: 8515, hash: '3733654a78ad1e679822e9cc1a9247741c006837b23b7a35d9ec2d6b700d577c', text: () => import('./assets-chunks/alumnos_index_html.mjs').then(m => m.default)},
    'lector-qr/index.html': {size: 4930, hash: 'a484809947bdfd410dacad0a2b8aea598e583dd19bffb4c393b00c839412cf4e', text: () => import('./assets-chunks/lector-qr_index_html.mjs').then(m => m.default)},
    'crear-alumno/index.html': {size: 6223, hash: 'f525d2ef989e91b8d916fac1cf54df5168830ec863e6cb352afc3aea192cf3d7', text: () => import('./assets-chunks/crear-alumno_index_html.mjs').then(m => m.default)},
    'alumno-qr/index.html': {size: 4579, hash: '519f238c3d09f24be8bbeba5805d0e5e6a2f32d22fdd1356638364fa8fe3cebf', text: () => import('./assets-chunks/alumno-qr_index_html.mjs').then(m => m.default)},
    'dashboard/index.html': {size: 8936, hash: 'abf4afca5e48ee9a8f63c3fd48929618f5a07bc33239fd8dc69bd3d8bb558e95', text: () => import('./assets-chunks/dashboard_index_html.mjs').then(m => m.default)},
    'styles-5INURTSO.css': {size: 0, hash: 'menYUTfbRu8', text: () => import('./assets-chunks/styles-5INURTSO_css.mjs').then(m => m.default)}
  },
};
