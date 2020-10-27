## suf-cli

<span id="BADGE_GENERATION_MARKER_0"></span>
[![npmV](https://img.shields.io/npm/v/suf-cli)](https://www.npmjs.com/package/suf-cli) [![min](https://img.shields.io/bundlephobia/min/suf-cli)](https://bundlephobia.com/result?p=suf-cli) [![install](https://badgen.net/packagephobia/install/suf-cli)](https://packagephobia.now.sh/result?p=suf-cli) [![githubLastCommit](https://img.shields.io/github/last-commit/TheRealSyler/suf-cli)](https://github.com/TheRealSyler/suf-cli)
<span id="BADGE_GENERATION_MARKER_1"></span>

suf-cli is a utility cli for automating readme stuff, like adding a license, most of the stuff below and above has been generated with this cli.

## Usage

```bash
suf
```

this cli works by reading the `suf.config.json` file, every cli module has its section in the config file, if you call the cli without any arguments it will ask you to create a config or it executes all modules present in the config, to add a module just execute the command for that module.

> INFO: All arguments can start with - or --, but i would recommend to just use letters.

| Command                         |                           |
| ------------------------------- | ------------------------- |
| `a` \| `all`                    | Calls all modules.        |
| `b` \| `badges`                 | Calls the badges module.  |
| `t` \| `ts` \| `d.ts` \| `docs` | Calls the tsDoc module.   |
| `l` \| `licence`                | Calls the license module. |
| `h` \| `help`                   | Displays this Message.    |

<span id="DOC_GENERATION_MARKER_0"></span>

# Docs

- **[Modules](#modules)**

  - [BadgesModuleConfig](#badgesmoduleconfig)
  - [TsDocModuleConfig](#tsdocmoduleconfig)
  - [LicenseModuleConfig](#licensemoduleconfig)
  - [ConfigFile](#configfile)

- **[badgeTypes](#badgetypes)**

  - [Badges](#badges)
  - [Links](#links)

### Modules

##### BadgesModuleConfig

```typescript
interface BadgesModuleConfig {
    /**package name */
    name: string;
    /**github username */
    github: string;
    /**vscode publisher.packageName */
    vscode?: string;
    /**github repo name */
    repo: string;
    /**path to readme or other target file */
    out: string;
    /**Array of badges */
    badges: string[];
    /**link to external config,(not sure if this still works) */
    externalConfig?: string;
}
```

##### TsDocModuleConfig

```typescript
interface TsDocModuleConfig {
    /**title displayed at the top of the generated text */
    title: string;
    /**path to the d.ts files */
    dir: string;
    /**path to readme or other target file */
    out: string;
    /**include all files in array, include and exclude cannot be used at the same time */
    include?: string[];
    /**exclude all files in array, include and exclude cannot be used at the same time */
    exclude?: string[];
}
```

##### LicenseModuleConfig

```typescript
interface LicenseModuleConfig {
    /**license type */
    type: string;
    /**license year */
    year: string;
    /**full name of the copyright holder */
    name: string;
    /**path to readme or other target file */
    out: string;
    /**path/name of the LICENSE file */
    file: string;
}
```

##### ConfigFile

```typescript
interface ConfigFile {
    badges?: BadgesModuleConfig;
    tsDoc?: TsDocModuleConfig;
    license?: LicenseModuleConfig;
}
```

### badgeTypes

##### Badges

```typescript
interface Badges {
    /** circleCi build. */
    circleci: '/circleci/build/github/<GITHUB>/<REPO>';
    /** Vscode Extension Version. */
    vscV: '/visual-studio-marketplace/v/<VSCODE>';
    /** Vscode Extension downloads. */
    vscD: '/visual-studio-marketplace/d/<VSCODE>';
    /** Vscode Extension installs. */
    vscI: '/visual-studio-marketplace/i/<VSCODE>';
    /** Vscode Extension ratings. */
    vscR: '/visual-studio-marketplace/r/<VSCODE>';
    /** Bundlephobia Min. */
    min: '/bundlephobia/min/<NAME>';
    /** Bundlephobia Minzip. */
    minzip: '/bundlephobia/minzip/<NAME>';
    /** Packagephobia Install. */
    install: '/packagephobia/install/<NAME>';
    /** Packagephobia Publish. */
    publish: '/packagephobia/publish/<NAME>';
    /** Npm Version. */
    npmV: '/npm/v/<NAME>';
    /** Npm Weekly Downloads. */
    npmDW: '/npm/dw/<NAME>';
    /** Npm Monthly Downloads. */
    npmDM: '/npm/dm/<NAME>';
    /** Npm Yearly Downloads. */
    npmDY: '/npm/dy/<NAME>';
    /** Npm Total Downloads. */
    npmDT: '/npm/dt/<NAME>';
    /** Npm Types. */
    npmTypes: '/npm/types/<NAME>';
    /** Npm License. */
    npmLicense: '/npm/license/<NAME>';
    /** Npm Node. */
    npmNode: '/npm/node/<NAME>';
    /** Npm Dependents. */
    npmDep: '/npm/dependents/<NAME>';
    /** GitHub Followers. */
    githubFollowers: '/github/followers/<GITHUB>';
    /** GitHub Forks. */
    githubForks: '/github/forks/<GITHUB>/<REPO>';
    /** GitHub Starts. */
    githubStars: '/github/stars/<GITHUB>/<REPO>';
    /** GitHub Issues. */
    githubIssues: '/github/issues/<GITHUB>/<REPO>';
    /** GitHub Last Commit. */
    githubLastCommit: '/github/last-commit/<GITHUB>/<REPO>';
    /** Custom, usage example: badge=https://img.shields.io/badge/custom%2C-Badge-brightgreen. */
    badge: '<CUSTOM>';
}
```

##### Links

```typescript
interface Links {
    /** Npm package. */
    npm: 'https://www.npmjs.com/package/<NAME>';
    /** Github Repo. */
    github: 'https://github.com/<GITHUB>/<REPO>';
    /** circleCi Repo Pipelines. */
    circleci: 'https://app.circleci.com/github/<GITHUB>/<REPO>/pipelines';
    /** Visual Studio marketplace. */
    vscode: 'https://marketplace.visualstudio.com/items?itemName=<VSCODE>';
    /** Bundlephobia Link. */
    bundle: 'https://bundlephobia.com/result?p=<NAME>';
    /** Packagephobia Link. */
    package: 'https://packagephobia.now.sh/result?p=<NAME>';
    /** Custom, usage example: link=https://example.com. */
    link: '<CUSTOM>';
}
```

_Generated with_ **[suf-cli](https://www.npmjs.com/package/suf-cli)**
<span id="DOC_GENERATION_MARKER_1"></span>

<span id="LICENSE_GENERATION_MARKER_0"></span>
Copyright (c) 2019 Leonard Grosoli Licensed under the MIT license.
<span id="LICENSE_GENERATION_MARKER_1"></span>
