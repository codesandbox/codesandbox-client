import styled, { component } from 'app/styled-components';
import fadeIn from 'common/utils/animation/fade-in';

export const Inputs = styled.div`
  margin-bottom: 1rem;
  padding: 0 0.25rem;
  input {
    margin: 0;
    text-align: center;
    box-sizing: border-box;
    height: 100%;
    width: 100%;
  }
`;

export const Dot = styled.div`
  position: absolute;
  color: ${props => props.theme.white};
  right: 0;
  bottom: 0.4rem;
`;

export const ErrorMessage = styled.div`
  margin: 1rem;
  font-size: 0.875rem;
  color: ${props => props.theme.red};
`;

export const Icon = styled.div`
  position: relative;
  display: inline-block;
  transition: 0.3s ease color;
  color: rgba(255, 255, 255, 0.5);
  padding-left: 0.5rem;
  &:hover {
    color: white;
  }
`;

export const IconArea = styled.div`
  position: absolute;
  right: 1rem;
  opacity: 0;
  line-height: 1;
  vertical-align: middle;
  ${fadeIn(0)};
`;

export const WorkspaceInputContainer = styled(component<{
  errorMessage: string
}>())`
  display: inline-block;
  display: flex;
  overflow: visible;
  font-size: 0.875rem;
  margin: 0.5rem 0.75rem;
  input,
  textarea {
    transition: 0.3s ease background-color, 0.3s ease border-color;
    font-family: inherit;
    margin: 0 0.25rem;
    padding: 0.25rem;
    width: 100%;
    outline: none;
    border: none;
    border-radius: 2px;
    background-color: ${props =>
      props.errorMessage
        ? props.theme.redBackground.clearer(0.5)
        : 'rgba(0, 0, 0, 0.2)'};
    color: ${props =>
      props.errorMessage ? props.theme.red : props.theme.white};

    border: 1px solid transparent;
    &:focus {
      border-color: ${props => props.theme.secondary.clearer(0.5)};
    }
  }

  input::-webkit-input-placeholder {
    color: ${props => props.theme.background2.lighten(2.9)};
  }
`;
