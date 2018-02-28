![logo](https://github.com/okulys/okulys.github.io/blob/master/images/ic-logo.png)
### Proyecto colaborativo y opensource para crear una aplicación web que ayude a los creativos a diseñar de manera inclusiva usando combinaciones de colores aprobadas por y para daltónicos

Web del proyecto:  
https://okulys.github.io

Grupo de Telegram de los desarrolladores:  
https://t.me/okulys_dev

Contacto:  
www.okulys.com  
hello@okulys.com  
https://twitter.com/OkulysApp 

## Información sobre el código
En Okulys estamos desarrollando utilizando NodeJS. Este repositorio está estructurado en dos carpetas:

* En **v1** encontramos un primer intento para automatizar las pruebas de combinación de colores.
* En **v2** tenemos distintas partes:
  * La primera se encuentra en **index.js** donde probamos a utilizar una red neural para estimar como un daltónico ve los  colores.
  * La segunda parte se encuentra en **Matrix.js** es el enfoque principal de Okulys donde a partir de los datos proporcionados por los daltónicos se busca crear una tabla donde a partir de la combinación de 200 colores se pueda estimar cualquier otra combinación calculando la distancia euclidea podamos obtener resultados fiables.


