export function restartSandbox({ executor }) {
  executor.emit('sandbox:restart');
}

export function restartContainer({ executor }) {
  executor.emit('sandbox:restart-container');
}
