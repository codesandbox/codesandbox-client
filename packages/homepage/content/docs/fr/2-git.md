---
title: Commits et PRs avec git
authors: ['CompuIves']
description:
  CodeSandbox vous permet d'exécuter des requêtes d'importation, de commit et de pull sur des dépôts GitHub.
---

## Concept de base

Avec CodeSandbox, vous pouvez importer n'importe quel dépôt GitHub comme une sandbox. Ce concept est décrit plus en détail [ici](/docs/importing#import-from-github). Une sandbox importée restera automatiquement synchronisée avec le dépôt GitHub; si un commit est lancé sur GitHub, le changement est immédiatement visible dans la sandbox.

Pour cette raison, nous avons rendu les sandbox GitHub immuables, ce qui signifie que vous ne pouvez pas effectuer de changements direct dans la sandbox elle-même. Cependant, vous pouvez toujours créer une branche sur la sandbox. Quand vous créez une branche sur une sandbox GitHub, nous conservons une référence vers le dépôt GitHub d'origine. Ceci vous permet de créer des commits et d'exécuter des requêtes pull depuis la branche.

## Créer des commits et lancer des PRs

La branche d'une sandbox GitHub est séparée de son dépôt. Nous conservons une référence à la branche d'origine et observons les changements qui interviennent. Quand vous créez une branche sur une sandbox GitHub, un nouveau panneau de commandes apparaît dans la sidebar, qui ressemble à ceci:

![GitHub Sidebar](./images/github-sidebar.png)

Ce panneau répertorie tous les fichiers qui ont été modifiés par rapport à la sandbox GitHub d'origine. Lorsque vous créez une branche sur une sandbox dont le dépôt GitHub vous appartient, vous pouvez créer des commit ou des requêtes pull; si vous n'êtes pas le propriétaire du dépôt vous ne pouvez que lancer des requêtes pull.

## Créer un dépôt

Si vous possédez une sandbox que vous souhaitez déposer sur GitHub, vous pouvez le faire simplement en cliquant sur l'icône GitHub de la sidebar, puis entrer le nom du dépôt et cliquer sur 'Create Repository'. Nous ouvrons automatiquement la sandbox synchronisée avec son dépôt GitHub.
