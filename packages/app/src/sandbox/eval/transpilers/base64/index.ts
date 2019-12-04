import Transpiler, { TranspilerResult } from '..';

class Base64Transpiler extends Transpiler {
  constructor() {
    super('base64-loader');
  }

  doTranspilation(code: string) {
    return new Promise<TranspilerResult>(resolve => {
      const reader = new FileReader();
      // @ts-ignore
      reader.readAsDataURL(code);

      reader.onloadend = function() {
        const base64data = reader.result;
        resolve({
          transpiledCode: `module.exports = "${base64data.toString()}"`,
        });
      };
    });
  }
}

const transpiler = new Base64Transpiler();

export { Base64Transpiler };

export default transpiler;
