import { json } from 'overmind';
import { inject as mobxInject, observer as mobxObserver } from 'mobx-react';
import { observer as mobxHooksObserver } from 'mobx-react-lite';
import { connect } from './overmind';

const isOvermind = true;

export const inject: any = isOvermind
  ? () => component => component
  : (...injects) => mobxInject('reaction', ...injects);

export const observer: any = isOvermind ? connect : mobxObserver;

export const hooksObserver: any = isOvermind ? connect : mobxHooksObserver;

export const Observer = isOvermind
  ? connect(({ store, signals, reaction, children }: any) =>
      children({ store, signals, reaction })
    )
  : inject('store', 'signals')(
      observer(({ store, signals, reaction, children }: any) =>
        children({ store, signals, reaction })
      )
    );

export const clone = isOvermind
  ? json
  : obj => {
      if (obj.toJSON) {
        return obj.toJSON();
      }

      if (obj.toJS) {
        return obj.toJS();
      }

      return obj;
    };
