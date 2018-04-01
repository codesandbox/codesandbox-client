import styled from 'app/styled-components';
import delay from 'common/utils/animation/delay-effect';

export const Status = styled.div`
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.6);
`;

export const UserContainer = styled<
    {
        isCurrentUser: boolean;
    },
    'div'
>('div')`
    ${delay()};
    display: flex;
    align-items: center;
    margin: 0.5rem 0;
    color: rgba(255, 255, 255, 0.8);
    ${(props) =>
        props.isCurrentUser &&
        `
    color: white;
  `};

    &:first-child {
        margin-top: 0;
    }
`;

export const ProfileImage = styled<
    {
        borderColor: string;
    },
    'img'
>('img')`
    width: 26px;
    height: 26px;
    border-radius: 2px;
    border-left: 2px solid ${({ borderColor }) => borderColor};

    margin-right: 0.5rem;
`;

export const UserName = styled.div`
    font-weight: 600;
    font-size: 0.875rem;
`;

export const IconContainer = styled.div`
    transition: 0.3s ease color;
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;

    &:hover {
        color: white;
    }
`;
