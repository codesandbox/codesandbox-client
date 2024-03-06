import styled from 'styled-components';
import css from '@styled-system/css';

export const Container = styled.div(
  css({
    display: 'flex',
    alignItems: 'center',
    marginBottom: 4,
    marginTop: 2,
  })
);

export const Avatar = styled.img(
  css({
    size: '24px',
    borderRadius: '50%',
    border: '1px solid',
    borderColor: 'grays.400',
  })
);

export const AvatarPlaceholder = styled.div(
  css({
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'medium',
    borderRadius: '50%',
    backgroundColor: 'grays.600',
  })
);

export const PrimaryName = styled.span(
  css({
    display: 'inline-block',
    fontSize: 2,
    marginLeft: 2,
    marginBottom: '1px',
  })
);
