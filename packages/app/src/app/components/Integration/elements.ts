import styled, { css, component} from 'app/styled-components';

export const Container = styled(component<{
  small: boolean
  loading: boolean
}>())`
  display: inline-flex;
  border-radius: 4px;
  overflow: hidden;
  width: 100%;

  color: rgba(255, 255, 255, 0.8);

  ${props =>
    props.small &&
    css`
      flex-direction: column;
      font-size: 0.875rem;
    `};

  ${props =>
    props.loading &&
    css`
      opacity: 0.5;
    `};
`;

export const IntegrationBlock = styled(component<{
  bgColor: string
  small: boolean
}>())`
  display: inline-flex;
  align-items: center;
  background-color: ${props => props.bgColor};
  flex: 1;
  color: white;
  font-size: 1.25em;
  padding: 1em 1.5em;

  ${props =>
    props.small &&
    css`
      padding: 0.75em 0.75em;
      font-size: 1em;
    `};
`;

export const Name = styled.span`
  margin-left: 0.75em;
  font-size: 1.375em;
`;
