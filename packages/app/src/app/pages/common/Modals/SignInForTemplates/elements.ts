import styled from 'styled-components';
import CloseIcon from 'react-icons/lib/md/close';

export const Close = styled(CloseIcon)`
  position: absolute;
  right: 20px;
  width: 24px;
  height: 24px;
  color: white;
  cursor: pointer;
`;

export const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;
