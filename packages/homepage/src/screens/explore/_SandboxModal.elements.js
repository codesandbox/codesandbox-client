import styled from 'styled-components';
import UserWithAvatar from 'app/src/app/components/UserWithAvatar';

export const Container = styled.div`
  background-color: ${props => props.theme.background2};
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  overflow: hidden;
`;

export const StatsContainer = styled.div`
  font-family: 'Poppins';

  flex: 1;
  padding: 1.5rem;
  margin-top: 3px;
  font-weight: 600;
  color: ${props => props.theme.new.description};
`;

export const StatsHeader = styled.h2`
  font-family: 'Poppins';
  color: ${props => props.theme.new.title};
  font-size: 1.25rem;
  margin-top: 0 !important;
  margin-bottom: 0;
  font-weight: 700;
`;

export const Author = styled(UserWithAvatar)`
  position: absolute;
  left: 1.5rem;
  bottom: 1.5rem;
  color: ${props => props.theme.new.description};
  font-weight: 600;
`;

export const SandboxInfo = styled.div`
  padding: 1.5rem;
  font-family: 'Poppins';
  color: ${props => props.theme.new.title};
  flex: 2;
  min-height: 200px;
`;

export const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
  position: relative;
  padding: 10px 30px;
  padding-bottom: 20px;
`;

export const SandboxTitle = styled.h1`
  font-size: 1.5rem;
  font-family: 'Poppins';
  color: ${props => props.theme.new.title};
  font-weight: 800;
  margin-bottom: 0.5rem;
`;

export const SandboxDescription = styled.p`
  font-family: 'Poppins';
  color: ${props => props.theme.new.title};
  color: ${props => props.theme.new.description};
`;

export const TemplateLogo = styled.section`
  display: flex;
  align-items: center;

  svg {
    margin-right: 10px;
  }
`;
