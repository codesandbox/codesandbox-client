import styled, { css } from 'app/styled-components';
import RecordIcon from 'react-icons/lib/md/fiber-manual-record';

const styles = css`
    display: flex;
    align-items: center;
    justify-content: center;

    outline: none;
    border: none;
    padding: 0.5rem;

    background-color: #fd2439b8;

    width: 100%;
    color: white;
    border-radius: 4px;
    font-weight: 800;

    border: 2px solid #fd2439b8;
`;

export const Button = styled.button`
    transition: 0.3s ease all;
    ${styles};
    cursor: pointer;

    svg {
        margin-right: 0.25rem;
    }

    &:hover {
        background-color: #fd2439fa;
    }
`;

export const LoadingDiv = styled.div`${styles};`;

export const AnimatedRecordIcon = styled(RecordIcon)`
  transition: 0.3s ease opacity;
`;
