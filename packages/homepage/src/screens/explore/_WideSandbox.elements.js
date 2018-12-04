import styled from 'styled-components';
import Card from 'card-vibes';

import UserWithAvatar from 'app/src/app/components/UserWithAvatar';

export const BG_COLOR = '#1C2022';
export const BG_HOVER = '#212629';

export const Container = styled(Card)`
  transition: 0.3s ease background-color;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  position: relative;
  flex: 1;
  min-width: 400px;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;

  margin-bottom: 2rem;
  margin-right: 1rem;

  background-color: ${BG_COLOR};

  &:hover {
    background-color: ${BG_HOVER};
  }
`;

export const SandboxTitle = styled.h2`
  color: ${props => props.color};
  font-family: 'Poppins';
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 6px;
  margin-top: 0;

  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  max-height: 20px;
`;

export const SandboxDescription = styled.p`
  font-size: 0.8rem;
  color: ${props => props.theme.new.description};
  font-weight: 500;
  line-height: 1.3;
  margin-top: 8px;

  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  max-height: 35px;
`;

export const SandboxImage = styled.img`
  display: block;
  margin-bottom: 0;
  z-index: 0;
  border-bottom: 3.2px solid ${props => props.color};
  height: auto;
  width: 100%;
  background-color: ${BG_HOVER};
  border-image-width: 0;
`;

export const SandboxInfo = styled.div`
  left: -1px;
  right: -1px;
  padding: 0.75rem;
  height: 130px;
  z-index: 1;
`;

export const TemplateIcon = styled.div`
  display: flex;

  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
`;

export const Author = styled(UserWithAvatar)`
  font-size: 0.75rem;
  font-weight: 600;

  position: absolute;
  bottom: 0.75rem;
  left: 0.75rem;
  text-decoration: none;
  color: ${props => props.theme.new.description};
`;
