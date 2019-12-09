import { spawn } from 'child_process'

export default function exec(exec_path: string, args: string[], input: string): Promise<string> {
  const fmt = spawn(exec_path, args)

  const chunks = []

  fmt.stdout.on('data', (data) => {
    chunks.push(data.toString())
  });

  const err_chunks = []

  fmt.stderr.on('data', (data) => {
    err_chunks.push(data.toString())
  });


  fmt.stdin.setDefaultEncoding('utf-8');
  fmt.stdin.write(input);
  fmt.stdin.end();

  return new Promise((resolve, reject) => {
    fmt.on('exit', (code) => {
      if(code === 0 && err_chunks.length === 0) {
        resolve(chunks.join(""))
      } else {
        reject(err_chunks.join(''));
      }
    })
  })
}