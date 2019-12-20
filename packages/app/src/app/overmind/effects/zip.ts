import axios from 'axios';
import store from 'store/dist/store.modern';
import { saveAs } from 'file-saver';

const getFile = async (id: string) => {
  const jwt =
    store.get('jwt') || (document.cookie.match(/[; ]?jwt=([^\s;]*)/) || [])[1];
  const file = await axios.get(`http://localhost:8000/${id}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    responseType: 'arraybuffer',
  });

  const blob = new Blob([file.data], {
    type: 'application/zip',
  });

  return blob;
};

export default {
  create({ id }: { id: string }) {
    return getFile(id);
  },
  async download({ title, id }: { title: string; id: string }) {
    const file = await getFile(id);
    saveAs(file, `${title || id}.zip`);
  },
};
