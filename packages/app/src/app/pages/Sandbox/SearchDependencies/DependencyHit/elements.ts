import styled, { component } from 'app/styled-components';
import Select from 'common/components/Select';
import UserWithAvatar, { Props as UserWithAvatarProps} from 'app/components/UserWithAvatar';

export const Container = styled(component<{
  highlighted?: boolean
  onClick: () => void
}>())`
  display: flex;
  background: ${props =>
    props.highlighted
      ? props.theme.background2.darken(0.3)
      : props.theme.background2};
  color: ${props => props.theme.white};
  cursor: pointer;
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.background3};
  }

  &:hover {
    background-color: ${props => props.theme.background2.darken(0.2)};
  }
`;

export const Left = styled.div`
  flex: 1;
`;

export const Right = styled.div`
  display: flex;
  align-items: center;
`;

export const Row = styled.div`
  margin: 10px;
  & > * {
    margin-right: 10px;
  }
`;

export const Description = Row.extend`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
`;

export const Downloads = styled.span`
  color: ${props => props.theme.gray};
  font-weight: 500;
  font-size: 12px;
`;

export const License = styled.span`
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 3px;
  padding: 1px 3px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
`;

export const IconLink = styled.a`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
`;

export const StyledSelect = Select.extend`
  font-size: 0.875rem;
`;

export const StyledUserWithAvatar = styled(component<{}, UserWithAvatarProps>(UserWithAvatar))`
  font-size: 0.75rem;
  font-weight: 500;
`;
