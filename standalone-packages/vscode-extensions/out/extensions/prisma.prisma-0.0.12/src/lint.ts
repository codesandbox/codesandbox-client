import exec from './exec'

export interface LinterError {
  start: number,
  end: number,
  text: string
}

export default async function lint(exec_path: string, text: string): Promise<LinterError[]> {
  try {
    const result = await exec(exec_path, ['--lint'], text)
    return JSON.parse(result)
  } catch(errors) {
    console.error('prisma-fmt error\'d during linting.');
    console.error(errors)
    return []
  }
}