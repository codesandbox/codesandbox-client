---
title: Importer des Sandbox
authors: ['CompuIves']
description:
  Il existe différents moyens de créer une sandbox sur CodeSandbox, que ce soit en ligne de commandes ou à l'aide d'une UI.
---

## Assistant de création

Le moyen le plus utilisé pour créer une sandbox est l'assistant de création.

![Create Wizard](./images/create-wizard.png)

L'assistant de création liste tous les templates public actuellement disponibles, et vous dirige vers la sandbox correspondant au template sélectionné. Vous pouvez modifier la sandbox et créer une branche vers celle-ci pour continuer avec le template.

## Importer depuis GitHub

Vous pouvez importer un dépôt GitHub dans CodeSandbox en exécutant l'[assistant de création](https://codesandbox.io/s/github) et en indiquant l'URL du dépôt. Pour information, nous extrayons la dernière partie de l'URL (après github.com) et l'ajoutons à codesandbox.io/s/github/. Nous prenons en charge les branches personnalisées ainsi que les sous-répertoires. Voici un exemple d'URL:
[https://codesandbox.io/s/github/reactjs/redux/tree/master/examples/todomvc](https://codesandbox.io/s/github/reactjs/redux/tree/master/examples/todomvc).

Le dépôt importé restera synchronisé avec vos derniers commits. Ce qui signifie que chaque changement sur le dépôt se reflète immédiatement dans la sandbox.

### Données de configuration

Les données de configuration d'une sandbox se trouvent dans plusieurs fichiers du dépôt.

| Paramètres de la sandbox | Récupérés depuis                                                                                                                                         |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Titre           | `name` dans `package.json`                                                                                                                        |
| Description     | `description` dans `package.json`                                                                                                                 |
| Tags            | `keywords` dans `package.json`                                                                                                                    |
| Template        | Basé sur [cette logique](https://github.com/codesandbox-app/codesandbox-importers/blob/master/packages/import-utils/src/create-sandbox/templates.ts#L63) |

Vous pouvez optionnellement ajouter une propriété `template` dans le fichier
`./sandbox.config.json` pour remplacer le template actuel.

```json
{
  "template": "node"
}
```

### Sources

Vous pouvez trouver les sources de notre extracteur git
[ici](https://github.com/codesandbox-app/git-extractor).

## Exporter avec CLI

Vous pouvez exporter un projet local vers CodeSandbox en utilisant notre
[CLI](https://github.com/codesandbox-app/codesandbox-importers/tree/master/packages/cli).

Vous pouvez installer notre CLI en exécutant `npm install -g codesandbox`. Vous pouvez ensuite exporter un projet avec `codesandbox {directory}`.

### Exemple d'utilisation

```
$ npm install -g codesandbox
$ codesandbox ./
```

## Utiliser l'API

Nous fournissons une API autorisant l'instanciation d'une sandbox. Cette fonctionnalité est très utile pour la documentation: les exemples de code peuvent générer une sandbox à la volée. Vous pouvez appeler le point d'entrée `https://codesandbox.io/api/v1/sandboxes/define` avec une requête `GET` ou `POST`.

### Paramètres pris en charge

Trois paramètres optionnels sont actuellement pris en charge. La requête accepte les mêmes options de configuration qu'une [sandbox intégrée](https://codesandbox.io/docs/embedding/#embed-options).

| Paramètre de requête | Description                                                                          | Exemple d'entrée               |
| --------------- | ------------------------------------------------------------------------------------ | --------------------------- |
| `parameters`    | Paramètres utilisés pour initialiser une sandbox.                         | Exemple ci-dessous               |
| `query`         | La requête utilisée dans l'URL de redirection.                                     | `view=preview&runonclick=1` |
| `embed`         | Rediriger vers la version intégrée au lieu de l'éditeur.                       | `1`                         |
| `json`          | Au lieu de rediriger nous envoyons une réponse en JSON avec `{"sandbox_id": sandboxId}`. | `1`                         |

### Fonctionnement

L'API n'a besoin que d'un seul argument: `files`. Cet argument contient les fichiers qui seront dans la sandbox, un exemple d'implémentation serait:

```json
{
  "files": {
    "index.js": {
      "content": "console.log('hello!')",
      "isBinary": false
    },
    "package.json": {
      "content": {
        "dependencies": {}
      }
    }
  }
}
```

Chaque requête **nécessite** un `package.json`. Ce fichier peut aussi bien être une chaîne de caractères qu'un objet. Nous définissons l'ensemble des informations de la sandbox à partir des fichiers, comme pour les importations GitHub.

### Requête GET

Il est très difficile d'envoyer les paramètres JSON avec une requête GET, le risque d'erreur de syntaxe, comme un caractère non echapé, est grand. De plus, la limite en nombre de caractères de l'URL (~2000 caractères) est vite atteinte. C'est la raison pour laquelle nous commençons par compresser les fichiers dans `lz-string`. Nous fournissons une fonctionnalité permettant la compression dans la dépendance de `codesandbox`. L'implémentation ressemble à ceci:

```js
import { getParameters } from 'codesandbox/lib/api/define';

const parameters = getParameters({
  files: {
    'index.js': {
      content: "console.log('hello')",
    },
    'package.json': {
      content: { dependencies: {} },
    },
  },
});

const url = `https://codesandbox.io/api/v1/sandboxes/define?parameters=${parameters}`;
```

#### Example Sandbox

<iframe src="https://codesandbox.io/embed/6yznjvl7nw?editorsize=50&fontsize=14&hidenavigation=1&runonclick=1" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

### Formulaire POST

Vous pouvez effectuer les mêmes opérations en utilisant des requêtes POST, en récupérant les données via un formulaire plutôt qu'en modifiant une URL. Une requête POST permet de créer des sandbox plus volumineuses.

#### Example de Sandbox

<iframe src="https://codesandbox.io/embed/qzlp7nw34q?editorsize=70&fontsize=14&hidenavigation=1&runonclick=1" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

### Instancier sans UI

Si vous souhaitez instancier une nouvelle sandbox sans rendu graphique, vous pouvez ajouter `?json=1` à la requête. Par exemple `https://codesandbox.io/api/v1/sandboxes/define?json=1`. Au lieu d'afficher la sandbox, des données json sont retournées avec le `sandbox_id` de la nouvelle sandbox.

C'est utile par exemple pour créer une sandbox en ligne de commande, afin de l'intégrer sur votre site (voir Intégration dans la documentation)

Les requêtes `get` et `post` sont toutes deux prises en charge.

### Requête XHR

Vous pouvez aussi créer une sandbox à l'aide d'une requête XHR, comme `fetch`. Voici un exemple de sandbox:

<iframe src="https://codesandbox.io/embed/9loovqj5oy?editorsize=70&fontsize=14&hidenavigation=1&runonclick=1" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Instancier une sandbox avec un unique composant

Vous pouvez exporter un composant local vers CodeSandbox en utilisant notre autre [CLI](https://github.com/codesandbox/codesandboxer/tree/master/packages/codesandboxer-fs).

Vous pouvez installer notre CLI en exécutant `npm install -g codesandboxer-fs`. Vous pouvez ensuite exporter avec `codesandboxer {filePath}`.

```
$ npm install -g codesandboxer-fs
$ codesandboxer docs/examples/my-single-component.js
```

Ceci affichera l'id d'une sandbox qui ne fait rien d'autre qu'afficher le composant cible, en indiquant un lien vers cette sandbox. Les données nécessaires au composant sont aussi extraite des fichiers locaux.

## Importer avec React-Codesasndboxer

Importer à partir d'un unique fichier depuis un dépôt git, ainsi que les fichiers et dépendances nécessaires. Cette méthode fournit un moyen simple d'uploader un exemple plutôt qu'un dépôt git entier.

### Fonctionnement

De manière invisible, react-codesandboxer parcourt les fichiers nécessaires depuis github ou bitbucket, en utilisant un simple fichier affiché comme 'example' en tant que point d'entrée, puis utilise l'API d'instanciation pour uploader les fichiers nécessaires dans une nouvelle sandbox `create-react-app`.

Visitez la [documentation react-codesandboxer](https://github.com/noviny/react-codesandboxer) pour plus d'informations sur l'implémentation.

```jsx harmony
import React, { Component } from 'react';
import CodeSandboxer from 'react-codesandboxer';

export default () => (
  <CodeSandboxer
    examplePath="examples/file.js"
    gitInfo={{
      account: 'noviny',
      repository: 'react-codesandboxer',
      host: 'github',
    }}
  >
    {() => <button type="submit">Upload to CodeSandbox</button>}
  </CodeSandboxer>
);
```
