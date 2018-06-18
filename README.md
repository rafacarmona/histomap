# histomap
Proyecto curso 2017-2018 realizado con @admateo. histomap es una aplicación móvil que, en formato de juego, y mediante el uso de la geolocalización, proporciona un aprendizaje a lo largo de toda la historia.

Este proyecto ha sido realizado en 2 meses. Tanto la documentación como el proyecto se han desarrollado en equipo con mi compañero @admateo. enlace a su githubhttps://github.com/admateo
La plataforma que hemos utilizado para el sistema de versiones no ha sido github, ha sido el que nos proporciona visual studio.
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
## Descripción

Nuestra aplicación se basa en un juego de preguntas y respuestas con cualquier tema aunque en principio es de historia,
y ademas tiene como añadido poder ver una puntuación de los jugadores y personalización de tu perfil de usuario.

La tecnología usada para el desarrollo es Ionic 3 ya que permite realizar aplicaciones multiplaforma para moviles en 
poco tiempo y posée una gran cantidad de plugin que permite hacer cualquier cosa. 

Del lado del servidor se usa Firebase tanto para la base de datos, en este caso firestore, como para usar su almacenamiento 
y la posibilidad de hacer un login usando la teconologia de google.

## Plugin usados

Para el login con google:

- [Ionic native - Google Plus](https://ionicframework.com/docs/native/google-plus/)
- [Repositorio en Github](https://github.com/EddyVerbruggen/cordova-plugin-googleplus)

Uso de la camara:

- [Ionic native - Camera](https://ionicframework.com/docs/native/camera/)
- [Repositorio en Github](https://github.com/apache/cordova-plugin-camera)

Para reproducir musica:

- [Ionic native - Native Audio](https://ionicframework.com/docs/native/native-audio/)
- [Repositorio en Github](https://github.com/floatinghotpot/cordova-plugin-nativeaudio)

Para comprobar el tipo de conexión:

- [Ionic native - Network](https://ionicframework.com/docs/native/network/)
- [Repositorio en Github](https://github.com/apache/cordova-plugin-network-information)
