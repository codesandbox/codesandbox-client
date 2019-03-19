const host = process.env.CODESANDBOX_HOST;

export async function getAbsoluteDependencies(dependencies: Object) {
  const nonAbsoluteDependencies = Object.keys(dependencies).filter(dep => {
    const version = dependencies[dep];

    const isAbsolute = /^\d+\.\d+\.\d+$/.test(version);

    return !isAbsolute && !/\//.test(version);
  });

  const newDependencies = { ...dependencies };

  await Promise.all(
    nonAbsoluteDependencies.map(async dep => {
      try {
        const data = await window
          .fetch(
            `${host}/api/v1/dependencies/${dep}@${encodeURIComponent(
              dependencies[dep]
            )}`
          )
          .then(x => x.json())
          .then(x => x.data);

        newDependencies[dep] = data.version;
      } catch (e) {
        /* ignore */
      }
    })
  );

  return newDependencies;
}
