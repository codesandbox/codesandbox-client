import semver from 'semver';
import { getAbsoluteDependencies } from '@codesandbox/common/lib/utils/dependencies';
import Manager from 'sandbox/eval/manager';

export async function isMinimalReactVersion(
  dependencies: object = {},
  devDependencies: object = {},
  minimalVersion: string
) {
  const allDependencies = { ...dependencies, ...devDependencies };

  if (allDependencies['react-dom']) {
    const absoluteDependencies = await getAbsoluteDependencies({
      'react-dom': allDependencies['react-dom'],
    });

    return (
      absoluteDependencies['react-dom'].startsWith('0.0.0') ||
      semver.gte(absoluteDependencies['react-dom'], minimalVersion)
    );
  }

  return false;
}

export async function hasRefresh(
  dependencies: object = {},
  devDependencies: object = {}
) {
  const allDependencies = { ...dependencies, ...devDependencies };

  if (allDependencies['react-refresh']) {
    return isMinimalReactVersion(dependencies, devDependencies, '16.9.0');
  }

  return false;
}

/**
 * We unmount the component tree to ensure that `componentWillUnmount` et all are called
 */
export function cleanUsingUnmount(manager: Manager) {
  try {
    const { children } = document.body;
    // Do unmounting for react
    if (
      manager.manifest &&
      manager.manifest.dependencies.find(n => n.name === 'react-dom')
    ) {
      const reactDOMModule = manager.resolveModule('react-dom', '');
      const reactDOM = manager.evaluateModule(reactDOMModule);

      reactDOM.unmountComponentAtNode(document.body);

      for (let i = 0; i < children.length; i += 1) {
        if (children[i].tagName === 'DIV') {
          reactDOM.unmountComponentAtNode(children[i]);
        }
      }
    }
  } catch (e) {
    /* don't do anything with this error */

    if (process.env.NODE_ENV === 'development') {
      console.error('Problem while cleaning up');
      console.error(e);
    }
  }
}

export const aliases = {
  // Directly match react-native to react-native-web.
  // Attempt to use react-native internals shouldn't work on web.
  'react-native$': 'react-native-web',
  // Alias core react-native internals to react-native-web equivalents
  'react-native/Libraries/EventEmitter/RCTDeviceEventEmitter$':
    'react-native-web/dist/vendor/react-native/NativeEventEmitter/RCTDeviceEventEmitter',
  'react-native/Libraries/vendor/emitter/EventEmitter$':
    'react-native-web/dist/vendor/react-native/emitter/EventEmitter',
  'react-native/Libraries/vendor/emitter/EventSubscriptionVendor$':
    'react-native-web/dist/vendor/react-native/emitter/EventSubscriptionVendor',
  'react-native/Libraries/EventEmitter/NativeEventEmitter$':
    'react-native-web/dist/vendor/react-native/NativeEventEmitter',
  // Alias core react-native asset management internals to unimodule equivalents.
  'react-native/Libraries/Image/AssetSourceResolver$':
    'expo-asset/build/AssetSourceResolver',
  'react-native/Libraries/Image/assetPathUtils$':
    'expo-asset/build/Image/assetPathUtils',
  'react-native/Libraries/Image/resolveAssetSource$':
    'expo-asset/build/resolveAssetSource',
};
