// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api: 'http://localhost:5000/api/v0/',
  firebase: {
    apiKey: 'AIzaSyA5VeMRuiPFa4KPtyLThM5M-ymJ1RGxPGM',
    authDomain: 'pfe-hayakawer.firebaseapp.com',
    databaseURL: 'https://bezkoder-firebase.firebaseio.com',
    projectId: '795997433696',
    storageBucket: 'pfe-hayakawer.appspot.com',
    measurementId: 'G-4RS71P6E4H',
    appId: '1:795997433696:web:7745ef49d0c7ade0303805'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
