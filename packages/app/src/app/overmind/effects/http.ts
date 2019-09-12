import axios, { AxiosResponse } from 'axios';

export default {
  get: axios.get,
  post: axios.post,
  path: axios.patch,
  delete: axios.delete,
  put: axios.put,
  request: axios.request,
  async getJson<T>(url: string): Promise<AxiosResponse<T>> {
    const response = await axios.get(url);

    return {
      ...response,
      data: JSON.parse(response.data),
    };
  },
};
