import styled, { css } from 'styled-components';
import { Tab as BaseTab, TabList, TabPanel } from 'reakit/Tab';
import { DropPlaceholder } from './DropPlaceholder';

export const Content = styled.div`
  ${({ theme }) => css`
    display: grid;
    grid-template-areas:
      'userinfo'
      'tabcontent';
    grid-template-columns: 1fr;
    grid-row-gap: 1.75rem;

    ${theme.media.greaterThan(theme.sizes.medium)} {
      grid-template-areas: 'userinfo tabcontent';
      grid-template-columns: 272px 1fr;
      grid-row-gap: 0;
      grid-column-gap: 1.75rem;
    }
    width: 100%;
    max-width: 1280px;
  `}
`;

export const Tabs = styled(TabList)`
  grid-area: tabs;
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
`;

export const Tab = styled(BaseTab)`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
  border: none;
  background: transparent;
  color: white;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  cursor: pointer;

  &[aria-selected='true'],
  :hover {
    background: #151515;
  }

  svg {
    margin-right: 0.5rem;
  }
`;

export const TabContent = styled(TabPanel)`
  grid-area: tabcontent;
  display: grid;
  grid-template-areas:
    'featured'
    'search'
    'pinned'
    'title'
    'sandboxes'
    'pagination';
  width: 100%;
`;

const row = css`
  display: flex;
  width: 100%;
  margin-bottom: 1.75rem;
`;

export const SearchRow = styled.div`
  ${row}
  grid-area: search;
  display: flex;
  justify-content: space-between;
  width: 100%;

  > *:last-child {
    flex: 0 1 308px;
  }
`;

export const FeaturedPlaceholder = styled(DropPlaceholder)`
  ${row}
  grid-area: featured;
`;

export const PinnedPlaceholder = styled(DropPlaceholder)`
  ${row}
  grid-area: pinned;
`;

export const SandboxCount = styled.div`
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  min-width: 100px;
  color: #757575;
  font-family: Inter;
  font-size: 15px;

  em {
    padding-right: 0.5rem;
    color: #fff;
    font-style: normal;
  }
`;

const results = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(305px, 1fr));
  grid-gap: 1.75rem;
  justify-content: space-between;
  width: 100%;
`;

export const PinnedGrid = styled.div`
  ${row}
  ${results}
  grid-area: pinned;
`;

export const TitleRow = styled.div`
  ${row}
  grid-area: title;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  padding: 0;
  font-family: Inter;
  font-size: 29px;
  font-weight: 700;
`;

export const SandboxGrid = styled.div`
  ${row}
  ${results}
  grid-area: sandboxes;
`;

export const PageNav = styled.div`
  grid-area: pagination;
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 1.75rem;
  margin-bottom: 1.75rem;
`;
