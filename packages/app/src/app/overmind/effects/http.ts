import axios from 'axios';

export default {
  get: axios.get,
  post: axios.post,
  path: axios.patch,
  delete: axios.delete,
  put: axios.put,
  request: axios.request,
  blobToBase64: (url: string): Promise<string> =>
    fetch(url)
      .then(response => response.blob())
      .then(
        blob =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            // eslint-disable-next-line func-names
            reader.onload = function () {
              // Github interprets base64 differently, so this fixes it, insane right?
              // https://stackoverflow.com/questions/39234218/github-api-upload-an-image-to-repo-from-base64-array?rq=1
              // Further note of explanation: readAsDataURL returns "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAA..."
              // Github only wants everything after "base64,"
              resolve(
                window.btoa(
                  window.atob((reader.result as string).replace(/^(.+,)/, ''))
                )
              );
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      ),
};
