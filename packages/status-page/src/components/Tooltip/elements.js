import styled from 'styled-components';

export const Circle = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  top: 2px;
  background: #30d158;
  margin-right: 0.25rem;
`;

export const Tooltip = styled.div`
  transition: all 200ms ease;
  transition-delay: 0.1s;
  position: absolute;
  background: ${props => props.theme.white};
  border-radius: 0.25rem;
  box-shadow: 0px 0.25rem 0.25rem rgba(0, 0, 0, 0.25),
    0px 0.25rem 0.25rem rgba(0, 0, 0, 0.25);
  padding: 0.5rem;
  opacity: 0;
  color: #000;
  transform: translateY(100%) translateX(-50%);
  bottom: -10px;
  min-width: 120px;
  margin-left: 4px;

  :after {
    bottom: 100%;
    left: 50%;
    border: solid transparent;
    content: ' ';
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(255, 255, 255, 0);
    border-bottom-color: ${props => props.theme.white};
    border-width: 8px;
    margin-left: -8px;
  }
`;

export const Info = styled.span`
  font-size: 12px;
  color: #000000;
  display: block;
  font-weight: ${props => (props.bold ? 500 : 400)};

  &:last-of-type {
    margin-top: 0.25rem;
  }
`;
