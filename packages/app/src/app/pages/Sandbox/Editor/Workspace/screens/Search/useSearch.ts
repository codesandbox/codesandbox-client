// import { useEffect, useState } from 'react';
//
//
// import { useOvermind } from 'app/overmind';

// export const useSearch = (term: string) => {
//   const [results, setResults] = useState<
//     (Module & { matches: number[] }[]) | undefined[]
//   >([]);
//   const [searchWorker, { status: workerStatus, kill: killWorker }] = useWorker(
//     search
//   );

//   useEffect(
//     () => () => {
//       killWorker(); // [UN-MOUNT] Since autoTerminate: false we need to kill the worker manually (recommended)
//     },
//     [killWorker]
//   );

//   useEffect(() => {
//     if (!term || !currentSandbox.modules.length) {
//       return setResults([]);
//     }
//     console.log(workerStatus, results);

//     debounce(
//       () =>

//       200
//     );
//   }, [term]);

//   return results;
// };
