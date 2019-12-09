import exec from './exec'

export default async function format(exec_path: string, ident_width: number, text: string): Promise<string> {
  try {
    return await exec(exec_path, ['-s', ident_width.toString()], text)
  } catch(errors) {
    console.warn('prisma-fmt error\'d during formatting. This was likely due to a syntax error. Please see linter output.');
    return text;
  }
}