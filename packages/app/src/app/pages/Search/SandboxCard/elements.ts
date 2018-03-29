import styled, { component } from 'app/styled-components';
import { Link } from 'react-router-dom';
import getTemplateDefinition from 'common/templates';

export const Container = styled(
    component<{
        template: string;
    }>()
)`
    transition: 0.3s ease all;

    position: relative;
    background-color: ${(props) => props.theme.background};
    padding: 1em;
    padding-bottom: 0.9em; /* strange styling issue, need to compensate */
    width: 100%;
    margin-bottom: 1rem;
    box-shadow: 0 2px 14px 0 rgba(0, 0, 0, 0.24);
    border-radius: 2px;
    box-sizing: border-box;

    border-left: 2px solid ${(props) => getTemplateDefinition(props.template).color.clearer(0.3)};

    cursor: pointer;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 14px 0 rgba(0, 0, 0, 0.24);
        background-color: ${(props) => props.theme.background.lighten(0.1)};
    }
`;

export const StyledLink = styled(Link)`
  text-transform: none;
  text-decoration: none;
  color: inherit;
`;

export const Title = styled.h2`
    font-weight: 400;
    font-size: 1.25em;
    margin: 0;
    margin-bottom: 1rem;
    width: 70%;
    color: white;
`;

export const Description = styled.p`
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 1.5rem;
`;

export const TagContainer = styled.div`
    font-size: 0.75rem;
    width: 30%;
`;
