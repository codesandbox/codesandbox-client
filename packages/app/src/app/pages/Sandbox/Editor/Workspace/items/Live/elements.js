import styled from 'styled-components';
import Input from 'common/components/Input';
import delay from 'common/utils/animation/delay-effect';

export const Invite = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

export const Container = styled.div`
  ${delay()};
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
  box-sizing: border-box;
`;

export const Title = styled.div`
  color: #fd2439fa;
  font-weight: 800;
  display: flex;
  align-items: center;
  vertical-align: middle;

  padding: 0.5rem 1rem;
  padding-top: 0;

  svg {
    margin-right: 0.25rem;
  }
`;

export const StyledInput = styled(Input)`
  width: calc(100% - 1.5rem);
  margin: 0 0.75rem;
  font-size: 0.875rem;
`;

export const SubTitle = styled.div`
  text-transform: uppercase;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);

  padding-left: 1rem;
  font-size: 0.875rem;
`;

export const Users = styled.div`
  padding: 0.25rem 1rem;
  padding-top: 0;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
`;

export const ModeSelect = styled.div`
  position: relative;
  margin: 0.5rem 1rem;
`;

export const Mode = styled.button`
  display: block;
  text-align: left;
  transition: 0.3s ease opacity;
  padding: 0.5rem 1rem;
  color: white;
  border-radius: 4px;
  width: 100%;

  font-weight: 600;
  border: none;
  outline: none;
  background-color: transparent;
  cursor: ${props => (props.onClick ? 'pointer' : 'inherit')};
  color: white;
  opacity: ${props => (props.selected ? 1 : 0.6)};
  margin: 0.25rem 0;

  z-index: 3;

  ${props =>
    props.onClick &&
    `
  &:hover {
    opacity: 1;
  }`};
`;

export const ModeDetails = styled.div`
  font-size: 0.75rem;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
  margin-top: 0.25rem;
`;

export const ModeSelector = styled.div`
  transition: 0.3s ease transform;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 48px;

  border: 2px solid rgba(253, 36, 57, 0.6);
  background-color: rgba(253, 36, 57, 0.6);
  border-radius: 4px;
  z-index: -1;

  transform: translateY(${props => props.i * 55}px);
`;

export const PreferencesContainer = styled.div`
  margin: 1rem;
  display: flex;
`;

export const Preference = styled.div`
  flex: 1;
  font-weight: 400;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
`;

export const IconContainer = styled.div`
  transition: 0.3s ease color;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
  cursor: pointer;

  &:hover {
    color: white;
  }
`;

export const Reconnecting = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;
