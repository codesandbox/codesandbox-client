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
  ? inject('store', 'signals')(
      connect(({ store, signals, children }: any) =>
        children({ store, signals })
      )
    )
  : inject('store', 'signals')(
      observer(({ store, signals, children }: any) =>
        children({ store, signals })
      )
    );
