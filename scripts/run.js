process.on('unhandledRejection', e => { console.error('[unhandledRejection]', e); process.exit(1); });
process.on('uncaughtException', e => { console.error('[uncaughtException]', e); process.exit(1); });
export async function solve({define, plan, execute, validate}) {
  const ctx = { startedAt: new Date().toISOString() };
  const spec = await define(); if (!spec?.goal || !spec?.constraints) throw new Error('Invalid spec');
  const steps = await plan(spec); if (!Array.isArray(steps) || !steps.length) throw new Error('Empty plan');
  const result = await execute(steps, spec);
  const verdict = await validate(result, spec); if (verdict !== true) throw new Error('Validation failed');
  return { result, audit: { spec, steps, endedAt: new Date().toISOString() } };
}
