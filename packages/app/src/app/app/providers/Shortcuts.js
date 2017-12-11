import { Provider } from 'cerebral';
import Mousetrap from 'mousetrap';

export default Provider({
  bindGlobal(bindings) {
    Mousetrap.reset();
    Object.keys(bindings).forEach(binding => {
      Mousetrap.bindGlobal(binding, () => {
        this.context.controller.getSignal(bindings[binding])();
        return false;
      });
    });
  },
  pause() {
    Mousetrap.pause();
  },
  unpause() {
    Mousetrap.unpause();
  },
  reset() {
    Mousetrap.unpause();
  },
});
