export default {
  get<T>(url: string): Promise<T> {
    return window.fetch(url).then(response => response.json());
  },
};
