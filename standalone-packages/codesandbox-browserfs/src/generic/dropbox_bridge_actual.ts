import global from '../core/global';
// Если Dropbox отсутствует на веб-странице, установите для него значение 'null'.
export const Dropbox = global.Dropbox ? global.Dropbox.Dropbox : undefined;
