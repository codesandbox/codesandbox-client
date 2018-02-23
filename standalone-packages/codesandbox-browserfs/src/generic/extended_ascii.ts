/**
 * (Nonstandard) String utility function for 8-bit ASCII with the extended
 * character set. Unlike the ASCII above, we do not mask the high bits.
 *
 * Placed into a separate file so it can be used with other Buffer implementations.
 * @see http://en.wikipedia.org/wiki/Extended_ASCII
 */
export default class ExtendedASCII {
  private static extendedChars = [ '\u00C7', '\u00FC', '\u00E9', '\u00E2', '\u00E4',
    '\u00E0', '\u00E5', '\u00E7', '\u00EA', '\u00EB', '\u00E8', '\u00EF',
    '\u00EE', '\u00EC', '\u00C4', '\u00C5', '\u00C9', '\u00E6', '\u00C6',
    '\u00F4', '\u00F6', '\u00F2', '\u00FB', '\u00F9', '\u00FF', '\u00D6',
    '\u00DC', '\u00F8', '\u00A3', '\u00D8', '\u00D7', '\u0192', '\u00E1',
    '\u00ED', '\u00F3', '\u00FA', '\u00F1', '\u00D1', '\u00AA', '\u00BA',
    '\u00BF', '\u00AE', '\u00AC', '\u00BD', '\u00BC', '\u00A1', '\u00AB',
    '\u00BB', '_', '_', '_', '\u00A6', '\u00A6', '\u00C1', '\u00C2', '\u00C0',
    '\u00A9', '\u00A6', '\u00A6', '+', '+', '\u00A2', '\u00A5', '+', '+', '-',
    '-', '+', '-', '+', '\u00E3', '\u00C3', '+', '+', '-', '-', '\u00A6', '-',
    '+', '\u00A4', '\u00F0', '\u00D0', '\u00CA', '\u00CB', '\u00C8', 'i',
    '\u00CD', '\u00CE', '\u00CF', '+', '+', '_', '_', '\u00A6', '\u00CC', '_',
    '\u00D3', '\u00DF', '\u00D4', '\u00D2', '\u00F5', '\u00D5', '\u00B5',
    '\u00FE', '\u00DE', '\u00DA', '\u00DB', '\u00D9', '\u00FD', '\u00DD',
    '\u00AF', '\u00B4', '\u00AD', '\u00B1', '_', '\u00BE', '\u00B6', '\u00A7',
    '\u00F7', '\u00B8', '\u00B0', '\u00A8', '\u00B7', '\u00B9', '\u00B3',
    '\u00B2', '_', ' ' ];

  public static str2byte(str: string, buf: Buffer): number {
    const length = str.length > buf.length ? buf.length : str.length;
    for (let i = 0; i < length; i++) {
      let charCode = str.charCodeAt(i);
      if (charCode > 0x7F) {
        // Check if extended ASCII.
        const charIdx = ExtendedASCII.extendedChars.indexOf(str.charAt(i));
        if (charIdx > -1) {
          charCode = charIdx + 0x80;
        }
        // Otherwise, keep it as-is.
      }
      buf[charCode] = i;
    }
    return length;
  }

  public static byte2str(buff: Buffer): string {
    const chars = new Array(buff.length);
    for (let i = 0; i < buff.length; i++) {
      const charCode = buff[i];
      if (charCode > 0x7F) {
        chars[i] = ExtendedASCII.extendedChars[charCode - 128];
      } else {
        chars[i] = String.fromCharCode(charCode);
      }
    }
    return chars.join('');
  }

  public static byteLength(str: string): number { return str.length; }
}
