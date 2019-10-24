import { createOverlay } from './overlay-manager';
import { requestPreviewSecretFromApp } from '../preview-secret';

const HTML = `
<style>
body {
  font-family: "Roboto", sans-serif;
  background-color: #1d2022;
  width: 100vw;
  height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  font-smooth: always;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  min-height: 100%;
  -webkit-text-size-adjust: 100%;
  line-height: 1.4;
  overflow: hidden;
}

.container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-direction: column;
  flex-direction: column;
  margin: 0 auto;
  max-width: 530px;
  height: 100%;
}

.title {
  color: #efefef;
  font-size: 3rem;
  width: 100%;
  font-weight: 600;
  text-align: center;
  margin-bottom: 1rem;
}
.description {
  color: #eeeeee;
  font-size: 1.5rem;
  width: 100%;
  font-weight: 300;
  text-align: center;
  margin-top: 0;
}

button {
  text-decoration: none;
  color: #40a9f3;
  outline: none;
  border: none;
  background: transparent;
  padding: 0;
  margin: 0;
  cursor: pointer;
  font-size: 1em;
}
</style>

<div class="container">
<h1 class="title">404</h1>
<p class="description">
  We could not find the sandbox you’re looking for, did you try
  <button id="sign-in-button">signing in</button>?
</p>
</div>
`;

export async function show404(sandboxId) {
  const windowRef = await createOverlay(HTML);

  windowRef.contentDocument.getElementById('sign-in-button').onclick = () => {
    requestPreviewSecretFromApp(sandboxId);
  };
}
