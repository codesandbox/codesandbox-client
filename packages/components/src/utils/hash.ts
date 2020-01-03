import sha1 from 'sha1';

export default (text: string): string => sha1(text);
