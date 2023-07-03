import styled from '../theme'

/**
 * Object root
 */
export const Root = styled('div')({
  display: 'inline-block',
  wordBreak: 'break-all',
  '&::after': {
    content: `' '`,
    display: 'inline-block',
  },
  '& > li, & > ol, & > details': {
    backgroundColor: 'transparent !important',
    display: 'inline-block',
  },
  '& ol:empty': {
    paddingLeft: '0 !important',
  },
})

/**
 * Table
 */
export const Table = styled('span')({
  '& > li': {
    display: 'inline-block',
    marginTop: 5,
  },
})

/**
 * HTML
 */
export const HTML = styled('span')({
  display: 'inline-block',
  '& div:hover': {
    backgroundColor: 'rgba(255, 220, 158, .05) !important',
    borderRadius: '2px',
  },
})

/**
 * Object constructor
 */
export const Constructor = styled('span')({
  '& > span > span:nth-child(1)': {
    opacity: 0.6,
  },
})
