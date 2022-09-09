# Entrega Final - Javascript

La app permite convertir unidades de medida utilizadas en pastelería, ingresando un valor y eligiendo el ingrediente a utilizar y ambas unidades, mostrando luego en pantalla el resultado.

Los valores se calculan llamando a la API https://rapidapi.com/smilebot/api/food-unit-of-measurement-converter, y se llama cada vez que el usuario modifica alguno de los parámetros en pantalla, ya sea cualquiera de las cantidades, las unidades o el ingrediente seleccionado.

Los resultados se pueden guardar en un Historial en pantalla usando el botón de "Guardar Resultado", y a su vez se almacenan en el Local Storage para seguir allí cuando el usuario vuelva a ingresar a la app.

Se usó la librería Luxon para imprimir fecha y hora exacta de la consulta, tanto en pantalla como en el Local Storage.

NOTA: La API lleva una Key que por seguridad envié en los comentarios de la entrega, hay que pegarlas en el script para que funcione