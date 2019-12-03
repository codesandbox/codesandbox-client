import styled, { css } from "styled-components"
import { DropPlaceholder } from "./DropPlaceholder"

export const Content = styled.div`
  ${({ theme }) => css`
    display: grid;
    grid-template-areas:
      "userinfo"
      "featured"
      "search"
      "pinned"
      "title"
      "showcase"
      "pagination";
    grid-template-columns: 1fr;

    ${theme.media.greaterThan(theme.sizes.medium)} {
      grid-template-areas:
        "userinfo featured"
        "userinfo search"
        "userinfo pinned"
        "userinfo title"
        "userinfo showcase"
        "userinfo pagination";
      grid-template-columns: 272px 1fr;
    }
    grid-gap: 1.75rem;
    width: 100%;
    max-width: 1280px;
    margin-bottom: 1.5rem;
  `}
`

const row = css`
  display: flex;
  width: 100%;
`

export const SearchRow = styled.div`
  ${row}
  grid-area: search;
`

export const FeaturedPlaceholder = styled(DropPlaceholder)`
  grid-area: featured;
`

export const PinnedPlaceholder = styled(DropPlaceholder)`
  grid-area: pinned;
`

export const SandboxCount = styled.div`
  flex: 0 0 auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  min-width: 100px;
  margin-left: 1rem;
  color: #757575;
  font-family: Inter;
  font-size: 15px;

  em {
    padding-right: 0.5rem;
    color: #fff;
    font-style: normal;
  }
`

const results = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(305px, 1fr));
  grid-gap: 1.75rem;
  justify-content: space-between;
  width: 100%;
`

export const PinnedGrid = styled.div`
  ${results}
  grid-area: pinned;
`

export const TitleRow = styled.div`
  ${row}
  grid-area: title;
`

export const SectionTitle = styled.h2`
  margin: 0;
  padding: 0;
  font-family: Inter;
  font-size: 29px;
  font-weight: 700;
`

export const ShowcaseGrid = styled.div`
  ${results}
  grid-area: showcase;
`

export const PageNav = styled.div`
  grid-area: pagination;
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 1.75rem;
  margin-bottom: 1.75rem;
`
