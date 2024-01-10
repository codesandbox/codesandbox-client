import { getParameters } from 'codesandbox-import-utils/lib/api/define';

export default function createOverlay(modules) {
  const normalized = Object.keys(modules).reduce(
    (prev, next) => ({
      ...prev,
      [next.replace('/', '')]: {
        content: modules[next].code,
        isBinary: false,
      },
    }),
    {}
  );

  const parameters = getParameters({ files: normalized });

  return new Promise<void>(resolve => {
    const iframe = document.createElement('iframe');

    iframe.setAttribute(
      'style',
      `transition: 0.3s ease background-color; position: fixed; bottom: 8px; right: 8px; height: 40px; width: 196px; background-color: rgba(0, 0, 0, 0.6); border-radius: 4px; border: 0; outline: 0; z-index: 214748366;`
    );
    iframe.setAttribute(
      'onmouseover',
      "this.style.backgroundColor='rgba(0, 0, 0, 0.7)';"
    );
    iframe.setAttribute(
      'onmouseout',
      "this.style.backgroundColor='rgba(0, 0, 0, 0.6)';"
    );

    iframe.onload = () => {
      iframe.contentDocument.body.innerHTML = `
        <form
          action="https://codesandbox.io/api/v1/sandboxes/define"
          method="POST"
          target="_blank"
          style="cursor:pointer;"
        >
        <input
          type="hidden"
          name="parameters"
          value="${parameters}"
        />
          <div style="display:flex;align-items:center" onclick="javascript:document.forms[0].submit();">
            <svg style="width:24px;height:24px;margin-right:8px;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="1024px"
              height="1024px" viewBox="0 0 1024 1024" enable-background="new 0 0 1024 1024" xml:space="preserve">
              <g id="Layer_1">
                <polyline
                  fill="#FFFFFF"
                  points="719.001,851 719.001,639.848 902,533.802 902,745.267 719.001,851"
                />
                <polyline
                  fill="#FFFFFF"
                  points="302.082,643.438 122.167,539.135 122.167,747.741 302.082,852.573 302.082,643.438"
                />
                <polyline
                  fill="#FFFFFF"
                  points="511.982,275.795 694.939,169.633 512.06,63 328.436,169.987 511.982,275.795"
                />
              </g>
              <g id="Layer_2">
                <polyline
                  fill="none"
                  stroke="#FFFFFF"
                  stroke-width="80"
                  stroke-miterlimit="10"
                  points="899,287.833 509,513 509,963"
                />
                <line
                  fill="none"
                  stroke="#FFFFFF"
                  stroke-width="80"
                  stroke-miterlimit="10"
                  x1="122.167"
                  y1="289"
                  x2="511.5"
                  y2="513"
                />
                <polygon
                  fill="none"
                  stroke="#FFFFFF"
                  stroke-width="80"
                  stroke-miterlimit="10"
                  points="121,739.083 510.917,963.042 901,738.333 901,288 511,62 121,289"
                />
              </g>
          </svg>
          <div style="font-size:.875rem; font-weight: 300; color: white; font-family: sans-serif">Open in CodeSandbox</div>
        </div>
      </form>
      `;

      resolve();
    };

    document.body.appendChild(iframe);
  });
}
