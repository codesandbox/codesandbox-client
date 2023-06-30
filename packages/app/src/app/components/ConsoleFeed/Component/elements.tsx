import styled from './theme'

/**
 * Return themed log-method style
 * @param style The style
 * @param type The method
 */
const Themed = (
  style: string,
  method: string,
  styles: { [name: string]: string }
) =>
  styles[`LOG_${method.toUpperCase()}_${style.toUpperCase()}`] ||
  styles[`LOG_${style.toUpperCase()}`]

/**
 * console-feed
 */
export const Root = styled('div')({
  wordBreak: 'break-word',
  width: '100%',
})

/**
 * console-message
 */
export const Message = styled('div')(({ theme: { styles, method } }) => ({
  position: 'relative',
  display: 'flex',
  color: Themed('color', method, styles),
  backgroundColor: Themed('background', method, styles),
  borderTop: `1px solid ${Themed('border', method, styles)}`,
  borderBottom: `1px solid ${Themed('border', method, styles)}`,
  marginTop: -1,
  marginBottom: +/^warn|error$/.test(method),
  paddingLeft: 10,
  boxSizing: 'border-box',
  '& *': {
    verticalAlign: 'top',
    boxSizing: 'border-box',
    fontFamily: styles.BASE_FONT_FAMILY,
    whiteSpace: 'pre-wrap',
    fontSize: styles.BASE_FONT_SIZE,
  },
  '& a': {
    color: styles.LOG_LINK_COLOR,
  },
}))

/**
 * message-icon
 */
export const Icon = styled('div')(({ theme: { styles, method } }) => ({
  width: styles.LOG_ICON_WIDTH,
  height: styles.LOG_ICON_HEIGHT,
  backgroundImage: Themed('icon', method, styles),
  backgroundRepeat: 'no-repeat',
  backgroundSize: styles.LOG_ICON_BACKGROUND_SIZE,
  backgroundPosition: '50% 50%',
}))

/**
 * message-amount
 */
export const AmountIcon = styled('div')(({ theme: { styles, method } }) => ({
  height: '16px',
  margin: '1px 0',
  whiteSpace: 'nowrap',
  fontSize: '10px',
  lineHeight: '17px',
  padding: '0px 3px',
  background: Themed('amount_background', method, styles),
  color: Themed('amount_color', method, styles),
  borderRadius: '8px',
  minWidth: '18px',
  textAlign: 'center',
}))

/**
 * timestamp
 */
 export const Timestamp = styled('div')(({ theme: { styles, method } }) => ({
  padding: '3px 0px 0px 5px',
  width: '110px',
  height: styles.LOG_ICON_HEIGHT,
  color: 'dimgray',
}))

/**
 * console-content
 */
export const Content = styled('div')(({ theme: { styles } }) => ({
  clear: 'right',
  position: 'relative',
  padding: styles.PADDING,
  marginLeft: 15,
  minHeight: 18,
  flex: 'auto',
  width: 'calc(100% - 15px)',
}))
