import { json } from 'overmind';
import { inject as mobxInject, observer as mobxObserver } from 'mobx-react';
import { observer as mobxHooksObserver } from 'mobx-react-lite';
import { connect } from './overmind';

const isOvermind = location.search.includes('overmind=true');

export const inject: any = isOvermind
  ? () => component => component
  : mobxInject;

export const observer: any = isOvermind ? connect : mobxObserver;

export const hooksObserver: any = isOvermind ? connect : mobxHooksObserver;

export const Observer = isOvermind
  ? connect(({ store, signals, reaction, children }: any) =>
      children({ store, signals, reaction })
    )
  : inject('store', 'signals', 'reaction')(
      observer(({ store, signals, reaction, children }: any) =>
        children({ store, signals, reaction })
      )
    );

export const clone = isOvermind ? json : obj => obj.toJS();
