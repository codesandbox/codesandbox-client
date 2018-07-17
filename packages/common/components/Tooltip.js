import { injectGlobal } from 'styled-components';
import 'react-tippy/dist/tippy.css';
import { Tooltip, withTooltip } from 'react-tippy';
import theme from 'common/theme';

// eslint-disable-next-line
injectGlobal`
  .tippy-popper {
    position: absolute;
  }

  .tippy-popper,
  .tippy-popper * {
    pointer-events: none;
  }

  .tippy-tooltip [x-circle] {
    background-color: rgb(21, 24, 25) !important;
  }

  .tippy-tooltip.update-theme {
    .arrow-regular {
      border-bottom: 7px solid ${theme.green()} !important;
    }

    background-color: ${theme.green()};
    border-radius: 2px;
    padding: 0 !important;
  }
`;

export default Tooltip;
export { withTooltip };
