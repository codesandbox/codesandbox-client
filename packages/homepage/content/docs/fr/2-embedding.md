---
title: Embedding
authors: ['CompuIves']
description: Il est possible d'intégrer une sandbox sur Medium et d'autres sites web.
---

## A propos de la version embarquée

CodeSandbox possède une version embarquée. Elle est conçu pour fournir une version allégée de l'application. Si vous remplacez `s` dans l'URL d'une sandbox par `embed`, vous obtenez sa version embarquée. Par exemple: https://codesandbox.io/s/new => https://codesandbox.io/embed/new. Notez que la version embarquée ne propose pas toutes les fonctionnalités d'un éditeur complet.

## Générer une URL

Vous pouvez générer une URL en cliquant sur 'Share' dans l'entête et sélectionner les options que vous souhaitez activer.

![Share Button](./images/share-button.png)

## Intégration sur Medium

Vous pouvez facilement intégrer la version embarquée sur Medium en faisant un copier-coller de l'URL de la sandbox (comme https://codesandbox.io/s/new) dans un article Medium. L'URL devrait alors être automatiquement remplacée par la sandbox après avoir appuyé sur entrée.

## Options d'intégration

Les options affichées dans la modale intégrée ne sont pas les seules disponibles. Nous avons besoin d'une nouvelle UI pour afficher ces options. Cependant, vous pouvez les trouver ici.

| Option           | Description                                                                                                    | Valeur                               | Par défaut                              |
| ---------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ------------------------------------ |
| `autoresize`     | Adapter automatiquement la taille de la sandbox au contenu (ne fonctionne que sur Medium).                                          | `0`/`1`                              | `0`                                  |
| `codemirror`     | Utiliser l'éditeur CodeMirror au lieu de Monaco (diminue significativement le poids de la sandbox).                                  | `0`/`1`                              | `0`                                  |
| `editorsize`     | Taille de l'éditeur en pourcentage.                                                                                  | nombre                               | `50`                                 |
| `eslint`         | Utiliser eslint (augmente significativement le poids de la sandbox).                                                               | `0`/`1`                              | `0`                                  |
| `expanddevtools` | Démarrer avec devtools (console) ouvert.                                                                        | `0`/`1`                              | `0`                                  |
| `hidedevtools`   | Masquer la barre DevTools dans l'aperçu.                                                                          | `0`/`1`                              | `0`                                  |
| `fontsize`       | Taille de police de caractères de l'éditeur.                                                                                            | nombre (en px)                       | `14`                                 |
| `forcerefresh`   | Force l'actualisation complète de la frame après chaque modifications.                                                                | `0`/`1`                              | `0`                                  |
| `hidenavigation` | Masquer la barre de navigation dans l'aperçu.                                                                        | `0`/`1`                              | `0`                                  |
| `highlights`     | Quelles lignes mettre en évidence (ne fonctionne que dans CodeMirror).                                                            | liste de numéros de ligne séparés par une virgule |                                      |
| `initialpath`    | L'URL initiale à charger dans la barre d'adresse.                                                                     | chaîne de caractères                               | `/`                                  |
| `module`         | Quel module ouvrir par défaut. Les chemins de fichiers multiples séparés par une virgule sont autorisés, dans ce cas nous les affichons dans des onglets. | chemin du module (commençant par `/`)   | chemin d'entrée                           |
| `moduleview`     | Examine le fichier qui est ouvert dans l'éditeur.                                                                  | `0`/`1`                              | `0`                                  |
| `previewwindow`  | Quelle fenêtre d'aperçu ouvrir par défaut.                                                                        | `console`/`tests`/`browser`          | `browser`                            |
| `runonclick`     | N'ouvrir l'aperçu que si l'utilisateur le demande.                                                                   | `0`/`1`                              | `0`                                  |
| `verticallayout` | Afficher l'éditeur et l'aperçu verticalement.                                                             | `0`/`1`                              | `0`                                  |
| `view`           | Quelle vue ouvrir par défaut                                                                                  | `editor`/`split`/`preview`           | `split`, `preview` pour les petits écrans |
| `theme`          | Quel thème afficher pour la sandbox intégrée.                                                                              | `dark`/`light`                       | `dark`                               |

## Exemple d'intégration

Voici quelques exemples d'intégration d'une sandbox, basé sur ses propriétés.

### La sandox embarquée la plus légère possible

Cette sandbox prétend à être la plus légère possible:

`https://codesandbox.io/embed/new?codemirror=1`

Utilisez ce code pour l'intégrer:

```html
<iframe
  src="https://codesandbox.io/embed/new?codemirror=1"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>
```

Ce qui donne comme résultat:

<iframe src="https://codesandbox.io/embed/new?codemirror=1" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

### Présentation de code en version intégrée

Vous pouvez aussi utiliser CodeSandbox pour afficher des exemples de code, avec des lignes mises en évidence. Actuellement, cette fonctionnalité n'est supportée que par l'éditeur CodeMirror:

`https://codesandbox.io/embed/new?codemirror=1&highlights=11,12,13,14`

Utilisez ce code pour l'intégrer:

```html
<iframe
  src="https://codesandbox.io/embed/new?codemirror=1&highlights=11,12,13,14"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>
```

Ce qui donne comme résultat:

<iframe src="https://codesandbox.io/embed/new?codemirror=1&highlights=11,12,13,14" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>