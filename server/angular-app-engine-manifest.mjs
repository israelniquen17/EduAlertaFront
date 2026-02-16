
export default {
  basePath: 'https://israelniquen17.github.io/EduALerta',
  supportedLocales: {
  "en-US": ""
},
  entryPoints: {
    '': () => import('./main.server.mjs')
  },
};
