import styled from 'styled-components';
import delayEffect from 'common/utils/animation/delay-effect';

export const HeaderTitle = styled.th`
  font-weight: 400;
  text-align: left;
  padding: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
`;

export const Table = styled.table`
  ${delayEffect(0.2)};
  width: 100%;
  border-spacing: 0;
  margin-bottom: 2rem;
  background: ${props => props.theme.background2};
`;

export const StatTitle = styled(HeaderTitle)`
  width: 2rem;
  text-align: center;
`;

export const StatBody = styled.td`
  width: 2rem;
  text-align: center;
  padding: 0.55rem 0.5rem;
  cursor: pointer;
`;

export const Body = styled.tbody`
  margin-top: 3rem;
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.5);
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
  background: ${props => props.theme.background2};

  td {
    border: none;
    padding: 1rem 0.5rem;
    margin: 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  }
`;

export const SandboxRow = styled.tr`
  transition: 0.3s ease all;
  ${props => delayEffect(0.25 + props.index * 0.05, false)};
  border: none;
  margin: 0;

  &:hover {
    background-color: ${props => props.theme.primary.clearer(0.9)};
    color: rgba(255, 255, 255, 0.9);
  }
`;

export const TR = styled.tr`
  height: 3rem;
`;
