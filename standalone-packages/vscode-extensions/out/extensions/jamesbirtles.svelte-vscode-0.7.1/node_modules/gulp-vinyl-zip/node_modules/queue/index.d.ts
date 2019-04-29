// TypeScript definition for queue
// Provided by Hendrik 'Xendo' Meyer <https://github.com/butterkekstorte>
// Licensed the same as the library itself
/*
Import via

  import {IQueue, IQueueWorker} from 'queue';
  var queue: IQueue = require('queue');

 */

interface IQueue{
    (opts?:IQueueOptions): IQueue
    push(...worker:IQueueWorker[]):number
    start(callback?:(error?:Error) => void):void
    stop():void
    end(error?:Error):void
    unshift(...worker:IQueueWorker[]):number
    splice(index:number, deleteHowMany:number, ...worker:IQueueWorker[]):IQueue
    pop():IQueueWorker|void
    shift():IQueueWorker|void
    slice(begin:number, end?:number):IQueue
    reverse():IQueue
    indexOf(searchElement:IQueueWorker, fromIndex?:number):number
    lastIndexOf(searchElement:IQueueWorker, fromIndex?:number):number
    concurrency:number
    timeout:number
    length:number
    on(event:string, callback:IQueueEventCallback):void
}

interface IQueueOptions {
    concurrency?:number
    timeout?:number
}

interface IQueueWorker {
    (cb?:(err?:Error, data?:Object)  => void):void
}

interface IQueueEventCallback {
    (data?:Object|Error|IQueueWorker, job?:IQueueWorker):void
}

export {IQueue, IQueueEventCallback, IQueueOptions, IQueueWorker};
