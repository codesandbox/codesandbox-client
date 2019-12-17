import axios from 'axios';
import store from 'store/dist/store.modern';
import { fileDownload } from './fileDownload';

const getFile = async (id: string) => {
  const jwt =
    store.get('jwt') || (document.cookie.match(/[; ]?jwt=([^\s;]*)/) || [])[1];
  const file = await axios.get(`http://localhost:8000/${id}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  return file.data;
};

export default {
  create({ id }, { id: string }) {
    return getFile(id);
  },
  async download({ title, id }: { title: string; id: string }) {
    const file = await getFile(id);
    fileDownload(file.data, title || id);
  },
};
