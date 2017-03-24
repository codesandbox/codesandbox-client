export default class NoDomChangeError extends Error {
  constructor(react, name) {
    super();

    this.payload = {
      react,
      name,
    };
  }

  type = 'no-dom-change';
  severity = 'warning';
}
