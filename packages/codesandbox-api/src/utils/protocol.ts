// import * as uuid from 'uuid';

// export default class Protocol {
//   id = uuid.v4();
//   messageId = 0;
//   worker: Worker;

//   constructor(worker: Worker, listenObject /* listen object with funcs on handling */) {
//     this.worker = worker;

//     window.addEventListener('message', () => {});
//   }

//   send(name, message: any): Promise<any> {
//     return new Promise((resolve, reject) => {
//       const messageId: string = this.id + this.messageId++;

//       const listenerFunction: any = (m: MessageEvent) => {
//         const { data } = m;
//         if (data.ev !== 'protocol') {
//           return;
//         }

//         if (data.messageId === messageId) {
//           if (data.error) {
//             const err = new Error(data.error.title);
//             err.message = data.error.message;
//             reject(err);
//           } else {
//             resolve(data.data);
//           }

//           this.worker.removeEventListener('message', listenerFunction);
//         }
//       };

//       this.worker.addEventListener('message', listenerFunction);

//       const messageToSend = {
//         ev: 'protocol',
//         data: message,
//         messageId,
//       };
//       this.worker.postMessage(messageToSend);
//     });
//   }
// }
