import { transform } from 'babel-standalone';

self.addEventListener('message', (event) => {
  const { code, moduleName = '' } = event.data;
  try {
    const newCode = transform(code, {
      presets: ['es2015', 'react', 'stage-0'],
      retainLines: true,
    }).code;

    self.postMessage(newCode);
  } catch (e) {
    e.message = e.message.split('\n')[0].replace('unknown', moduleName);
    throw new Error(e);
  }
});
