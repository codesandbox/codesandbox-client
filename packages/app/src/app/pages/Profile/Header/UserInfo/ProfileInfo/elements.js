import styled from 'styled-components';
import GithubIcon from 'react-icons/lib/go/mark-github';
import delayEffect from 'common/lib/utils/animation/delay-effect';

export const ProfileImage = styled.img`
  border-radius: 2px;
  margin-right: 1.5rem;

  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.5);
  background-color: ${props => props.theme.background2};

  ${delayEffect(0.05)};
`;

export const Name = styled.div`
  ${delayEffect(0.1)};
  display: flex;
  align-items: center;
  font-size: 2rem;
  font-weight: 300;
  margin-bottom: 0.25rem;
`;

export const Username = styled.div`
  ${delayEffect(0.15)};
  display: flex;
  align-items: center;
  font-size: ${props => (props.main ? 1.5 : 1.25)}rem;
  font-weight: 200;
  color: ${props => (props.main ? 'white' : 'rgba(255, 255, 255, 0.6)')};
  margin-bottom: 1rem;
`;

export const IconWrapper = styled(GithubIcon)`
  margin-left: 0.75rem;
  font-size: 1.1rem;
  color: white;
`;
