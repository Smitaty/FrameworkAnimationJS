# FrameworkAnimationJS

## Présentation

Nous proposons un framework d’animation codé en Javascript basé sur p5.js.

A l'origine codé en Java, ce framework permet une intégration facile d'animations au sein d'une page web.

Pour plus d'informations, consulter le fichier `VersionJS/index.html`.


## Utilisation du framework Java

L'intégration des applet Java étant dépréciée par les navigateurs internet depuis la [version 9 de Java](https://www.java.com/fr/download/faq/jdk9_plugin.xml), les animations peuvent être visualisées avec les commandes suivantes (une commande correspond à une animation, listées dans le fichier `VersionJava/build.xml`) :

    ant run
    ant run_cpu_anim1
    ant run_cpu_mono_core
    ant run_cpu_dual_core
    ant run_cpu_pipeline1

Il faut avoir au préalable compilé le framework avec la commande suivante :

    ant


## Utilisation du framework JS

Le framework est contenu dans le dossier `VersionJS/js/AnimationFramework`. Pour l'utiliser, copier ce dossier dans un projet et créer un fichier js qui sera appelé par une page HTML contenant une animation :

```html
<script type="module" src="path vers le fichier js"</script>
```

Dans ce fichier js il faut import le fichier `VersionJS/js/AnimationFramework/animation_controller.js`.
Ensuite, les autres fichiers du framework doivent être inclus avec le path du dossier `VersionJS/js/AnimationFramework` depuis le fichier HTML :

```javascript
import * as Animation from 'VersionJS/js/AnimationFramework/animation_controller.js';
Animation.include_animation_files('VersionJS/js/AnimationFramework/');
```
    
Enfin, pour charger une animation contenue dans un fichier XML, spécifier l'emplacement de ce fichier, l'id de la balise servant de canevas, et les dimensions de ce dernier :

```javascript
Animation.load_animation("benchmark.xml", "animation", 1400, 1000);
```

## Développeurs

[Dylan BUNEL](https://github.com/DylanBunel/)

[Pierre GRANIER--RICHARD](https://github.com/PierreGranier/)

[Thibaut ROPERCH](https://github.com/ThibautRoperch/)

[Pierre-Yves DELEPINE](https://github.com/pdelepine)

[Florian FERNANDES](https://github.com/FlorianFernandes)

[Simon MITATY](https://github.com/Smitaty)
