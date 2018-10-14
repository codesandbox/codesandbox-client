// CodeSandbox Logo
const SVG = `
  <svg x="0px" y="0px" width="18px" height="18px" viewBox="0 0 1024 1024"><g id="Layer_1"><polyline fill="#FFFFFF" points="719.001,851 719.001,639.848 902,533.802 902,745.267 719.001,851"></polyline><polyline fill="#FFFFFF" points="302.082,643.438 122.167,539.135 122.167,747.741 302.082,852.573 302.082,643.438"></polyline><polyline fill="#FFFFFF" points="511.982,275.795 694.939,169.633 512.06,63 328.436,169.987 511.982,275.795"></polyline></g><g id="Layer_2"><polyline fill="none" stroke="#FFFFFF" stroke-width="80" stroke-miterlimit="10" points="899,287.833 509,513 509,963"></polyline><line fill="none" stroke="#FFFFFF" stroke-width="80" stroke-miterlimit="10" x1="122.167" y1="289" x2="511.5" y2="513"></line><polygon fill="none" stroke="#FFFFFF" stroke-width="80" stroke-miterlimit="10" points="121,739.083 510.917,963.042 901,738.333 901,288 511,62 121,289"></polygon></g></svg>
`;

const addButton = () => {
  const files = Array.from(
    document.querySelectorAll('.files .content .js-navigation-open')
  ).map(n => n.innerHTML);

  // No package.json === stop
  if (!files.includes('package.json')) {
    return null;
  }

  // .Get the toolbar
  const toolbar = document.querySelector(
    '.file-navigation.in-mid-page.d-flex.flex-items-start'
  );
  // Get everything after https://github.com/
  const URL = window.location.pathname;

  // Create the button
  const button = document.createElement('a');
  button.setAttribute('href', `https://codesandbox.io/s/github${URL}`);
  button.setAttribute('target', '_blank');
  button.setAttribute('rel', 'noopener noreferrer');

  button.classList.add(
    'btn',
    'btn-sm',
    'btn-primary',
    'open-codesanbox-chrome-extension'
  );
  button.innerHTML = `
  ${SVG}
  Open in CodeSandbox
`;

  // Add it to the DOM
  return toolbar.append(button);
};
addButton();
