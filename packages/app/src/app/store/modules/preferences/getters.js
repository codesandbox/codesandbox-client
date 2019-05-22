import { KEYBINDINGS } from '@codesandbox/common/lib/utils/keybindings';

export function keybindings() {
  const userBindings = this.settings.keybindings;
  const userBindingsMap = userBindings.reduce(
    (bindings, binding) => ({
      ...bindings,
      [binding.key]: binding.bindings,
    }),
    {}
  );

  return Object.keys(KEYBINDINGS).reduce(
    (currentBindings, key) => ({
      ...currentBindings,
      [key]: {
        ...KEYBINDINGS[key],
        ...(key in userBindingsMap ? { bindings: userBindingsMap[key] } : {}),
      },
    }),
    {}
  );
}
