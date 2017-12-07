import { injectGlobal } from 'styled-components';
import 'react-tippy/dist/tippy.css';
import { Tooltip, withTooltip } from 'react-tippy';

// eslint-disable-next-line
injectGlobal`
  .tippy-popper {
    position: absolute;
  }
  .tippy-tooltip [x-circle] {
    background-color: rgb(21, 24, 25) !important;
  }
`;

export default Tooltip;
export { withTooltip };
