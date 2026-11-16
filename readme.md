Proyecto Final del Taller Especializado de Node.js

El proyecto consta de una solución a la problematica:
El departamento de recursos humanos de la empresa Taller de Node.js S.A. de
C.V. actualmente almacena en un documento de Excel los datos de sus
empleados. De cada empleado almacenan: nombre, apellidos, teléfono, correo
electrónico y dirección. Recientemente, debido a una brecha de seguridad, perdieron varios
registros por lo que buscan un sistema que les permita realizar la administración
de los empleados (altas, bajas, consultas y cambios) únicamente a ciertos
usuarios dados de alta en el sistema.

Esta solución hace uso del framework Express.js, para poder ejecutarlo seguir los siguientes pasos:
1. Encender Apache y MySQL si tiene XAMPP, en caso de tener otro software realizar lo señalado para poder acceder a la base de datos
2. Importar la Base de Datos, si usa XAMPP acceda a http://localhost/phpmyadmin, cree una nueva base de datos llamada "recursos_humanos", posteriormente seleccione la opción importar seguido del archivo .sql
3. Encender el servidor: acceda a la carpeta mediante una terminal y ejecute "npm install" para descargar los recursos seguido de "npm start"
4. En el buscador de su elección colocar en el buscador: localhost:3000/index.html
5. Inciar sesión con el usuario administrador:
Correo: "admin@gmail.com"
Contraseña: "123456"