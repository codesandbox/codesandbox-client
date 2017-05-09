import styled, { injectGlobal } from 'styled-components';

import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';
injectGlobal`
  .tippy-tooltip [x-circle] {
    background-color: rgb(21, 24, 25) !important;
  }
`;
export default Tooltip;
