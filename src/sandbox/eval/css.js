export default module => module.code;


  // const css = module.code;

  // const classNameRegex = /\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g;
  // const classNames = css.match(classNameRegex);

  // const alteredClassNames = classNames.map(t => t.replace('.', '')).reduce((prev, next) => (
  //   { ...prev, [next]: `cs${module.id}-${next}` }
  // ), {});

  // let newCode = module.code;
  // Object.keys(alteredClassNames).forEach((cn) => {
  //   const regex = new RegExp(`\.${cn} `);
  //   newCode = newCode.replace(regex, `.${alteredClassNames[cn]} `);
  // });

  // const styleNode = document.createElement('style');
  // styleNode.type = 'text/css';
  // if (styleNode.styleSheet) {
  //   styleNode.styleSheet.cssText = newCode;
  // } else {
  //   styleNode.appendChild(document.createTextNode(newCode));
  // }

  // document.head.appendChild(styleNode);
  // return alteredClassNames;
