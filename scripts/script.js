// Objeto que tiene todos los datos base necesarios para operar
let datosBase = {
    unidadInicial : "grams",
    unidadInicialEs: "gramos",
    unidadDestino : "cups",
    unidadDestinoEs : "tazas",
    cantidadInicial : 0,
    cantidadDestino : 0,
    ingrediente : "flour",
    ingredienteEs: "harina"
}

//Constante con las credenciales para la API
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'Key Enviada en el Comentario de la entrega', // Pegar aquí la Key enviada en los comentarios
		'X-RapidAPI-Host': 'food-unit-of-measurement-converter.p.rapidapi.com'
	}
}

//Funcion que llama a la API pasando como parámetros los valores que se necesitan para los parámetros de la query y la unidad de destino para poder usarla después
function convertir(unidadInicial, ingredientes, cantidadInicial) {
    return fetch(`https://food-unit-of-measurement-converter.p.rapidapi.com/convert?unit=${unidadInicial}&ingredient=${ingredientes}&value=${cantidadInicial}`, options)
	.then(response => response.json())
	.then((responseData) => responseData)
	.catch(err => console.error(err)) 
}

//Creo un constructor para el objeto que se envía al LocalStorage
function storeResultado(id,cantinicial,uninicial,resultop,undestino,horaFecha, ingrediente) {
    this.id = id,
    this.cantInicial = cantinicial,
    this.unInicial = uninicial,
    this.resultOp = resultop,
    this.unDestino = undestino,
    this.fechayhora = horaFecha,
    this.ingredient = ingrediente 
} 

//Variable para poder guardar todos los resultados en el Local Storage como objetos diferentes en la misma clave
let idResultado
//Variable para almacenar el array del Storage
let resultadoStorage
//Constante para manejar la libreria Luxon para imprimir la fecha y hora
const DateTime = luxon.DateTime
// Variable temporal para guardar la unidad que se acaba de cambiar
let unidadActual

// Elementos del DOM

// Selects de unidades
let obtenerUnidadInicial = document.getElementById("unidadInicial")
let obtenerUnidadDestino = document.getElementById("unidadFinal")

// Div contenedor de botones de ingredientes y array de botones
const ingredientes = document.getElementById("ingredientes")
const btnsIngredientes = ingredientes.getElementsByClassName("ingredient")

// Input de Cantidades y su contenedor padre
let obtenerCantUno = document.getElementById("cantidadInicial")
let obtenerCantDos = document.getElementById("cantidadFinal")
let obtenerCantidades = document.getElementsByClassName("inputCant")
let firstContainer = document.getElementById("first-container")
let secondContainer = document.getElementById("second-container")

// Array de Selects de unidades
let selectorUnidades = document.getElementsByClassName("form-select")

// Botones de guardar y borrar historial
let borrarHistorial = document.getElementById("borrarHistorial")
let guardar = document.getElementById("save")


//Evalúo antes de empezar si ya hay algo en el storage o no y almaceno en las variables los datos previos si los hubiera
// Además imprimo en el "Historial" los datos que esten almacenados en el Storage 
if (localStorage.getItem("resultados") == null) {
    
    // Si el Storage está vacío inicializo las variables para poder completarlo
    idResultado = 0
    resultadoStorage = []

} else {
    // Si existen resultados en el Storage los guardo en las variables para poder sumarle los nuevos más tarde
    idResultado = JSON.parse(localStorage.getItem("resultados")).length
    resultadoStorage = JSON.parse(localStorage.getItem("resultados"))

    // Elimino el mensaje de "Aquí veras el historial"
    let mensaje = document.getElementById("mensaje")
    mensaje.remove()

    // Agrego todos los resultados que estén en el Storage
     for (let i = 0; i < idResultado; i++) {
        //Creo una etiqueta P para imprimir el resultado, y voy a buscar el div en donde lo quiero imprimir
        let result = document.createElement("p")
        let resultadoFinal = document.getElementById("historial")

        //Le agrego el texto al p
        result.innerText = `${resultadoStorage[i].fechayhora} - ${resultadoStorage[i].cantInicial} ${resultadoStorage[i].unInicial} de ${resultadoStorage[i].ingredient} equivalen a ${resultadoStorage[i].resultOp} ${resultadoStorage[i].unDestino} de ${resultadoStorage[i].ingredient}`
        
        //Imprimo el p en el div
        resultadoFinal = resultadoFinal.append(result)
    } 
}

// Recorro con un for todos los botones de Ingredientes
for (let i = 0; i < btnsIngredientes.length; i++) {
    // Le agrego a cada boton un listener del Click que cuando se ejecuta le agrega el class "active" para que en el front se vea como seleccionado
    btnsIngredientes[i].addEventListener("click", function () {
        // Tomo el elemento que tiene el class "active"
        let activo = document.getElementsByClassName("active")
        // Le reemplazo el class por un string vacío, para borrarlo
        activo[0].className = activo[0].className.replace(" active", "")
        // Agrego el class "active" al elemento clickeado
        this.className += " active"

        // Guardo en el objeto base el value y el texto del botón, para usarlos más adelante
        datosBase.ingrediente = this.value
        datosBase.ingredienteEs = this.innerText

        // Llamo a la API para convertir los valores
        convertir(obtenerUnidadInicial.value, datosBase.ingrediente, obtenerCantUno.value)
        .then(response => {
            let respuesta = response

            // Hago un condicional con cada select para mostrar los resultados en los input según el ingrediente para cada unidad
            if (obtenerUnidadInicial.value == "grams") {
                obtenerCantUno.value = respuesta.grams.toFixed(2)
                datosBase.cantidadInicial = obtenerCantUno.value
            }  else if (obtenerUnidadInicial.value == "cups") {
                obtenerCantUno.value = respuesta.cups.toFixed(2)
                datosBase.cantidadInicial = obtenerCantUno.value
            } else if (obtenerUnidadInicial.value == "oz") {
                obtenerCantUno.value = respuesta.oz.toFixed(2)
                datosBase.cantidadInicial = obtenerCantUno.value
            } else if (obtenerUnidadInicial.value == "milliliters") {
                obtenerCantUno.value = respuesta.milliliters.toFixed(2)
                datosBase.cantidadInicial = obtenerCantUno.value
            } 
    
            if (obtenerUnidadDestino.value == "grams") {
                obtenerCantDos.value = respuesta.grams.toFixed(2)
                datosBase.cantidadDestino = obtenerCantDos.value
            }  else if (obtenerUnidadDestino.value == "cups") {
                obtenerCantDos.value = respuesta.cups.toFixed(2)
                datosBase.cantidadDestino = obtenerCantDos.value
            } else if (obtenerUnidadDestino.value == "oz") {
                obtenerCantDos.value = respuesta.oz.toFixed(2)
                datosBase.cantidadDestino = obtenerCantDos.value
            } else if (obtenerUnidadDestino.value == "milliliters") {
                obtenerCantDos.value = respuesta.milliliters.toFixed(2)
                datosBase.cantidadDestino = obtenerCantDos.value
            } 

        })
    }) 
}

// Le agrego un listener a cada select que en el change guarde el dato del Value e InnerText seleccionado en el objeto de Datos Base y llame a la API
for (let i = 0; i < selectorUnidades.length; i++) {
    
    selectorUnidades[i].addEventListener("change", (e) => {

        let ingredienteActivo = document.getElementsByClassName("active")
        ingredienteActivo = ingredienteActivo[0].value

        let unidadArriba = obtenerUnidadInicial.value
        let unidadAbajo = obtenerUnidadDestino.value

        let cantidadArriba = obtenerCantUno.value
        let cantidadAbajo = obtenerCantDos.value


        // Hago un condicional entre los dos selects, el superior y el inferior y guardo los datos de la unidad que cambió
        if (selectorUnidades[i].parentElement == firstContainer) {

            datosBase.unidadInicial = e.target.value
            let selectedIndex = e.target.selectedIndex
            datosBase.unidadInicialEs = e.target[selectedIndex].innerText

            // Llamo a la API para convertir los valores
            convertir(datosBase.unidadInicial, ingredienteActivo, cantidadArriba)
            .then(response => {
                let respuesta = response

                // Según la unidad de destino escribo en el otro value el numero q corresponda
                switch (unidadAbajo) {
                    case "grams":
                        obtenerCantDos.value = respuesta.grams.toFixed(2)
                        datosBase.cantidadDestino = obtenerCantDos.value
                        break;
                    case "cups":
                        obtenerCantDos.value = respuesta.cups.toFixed(2)
                        datosBase.cantidadDestino = obtenerCantDos.value
                        break;
                    case "oz":
                        obtenerCantDos.value = respuesta.oz.toFixed(2)
                        datosBase.cantidadDestino = obtenerCantDos.value
                        break;
                    case "milliliters":
                        obtenerCantDos.value = respuesta.milliliters.toFixed(2)
                        datosBase.cantidadDestino = obtenerCantDos.value
                        break;
                    default:
                        obtenerCantDos.value = 0
                        break;
                }
            })

        } else  if (selectorUnidades[i].parentElement == secondContainer){

            datosBase.unidadDestino = e.target.value
            let selectedIndex = e.target.selectedIndex
            datosBase.unidadDestinoEs = e.target[selectedIndex].innerText

            // Llamo a la API
            convertir(unidadAbajo, ingredienteActivo, cantidadAbajo)
            .then(response => {
                let respuesta = response

                // Según la unidad de destino escribo en el otro value el numero q corresponda
                switch (unidadArriba) {
                    case "grams":
                        obtenerCantUno.value = respuesta.grams.toFixed(2)
                        datosBase.cantidadInicial = obtenerCantUno.value
                        break;
                    case "cups":
                        obtenerCantUno.value = respuesta.cups.toFixed(2)
                        datosBase.cantidadInicial = obtenerCantUno.value
                        break;
                    case "oz":
                        obtenerCantUno.value = respuesta.oz.toFixed(2)
                        datosBase.cantidadInicial = obtenerCantUno.value
                        break;
                    case "milliliters":
                        obtenerCantUno.value = respuesta.milliliters.toFixed(2)
                        datosBase.cantidadInicial = obtenerCantUno.value
                        break;
                    default:
                        obtenerCantUno.value = 0
                        break;
                }
            })

        }

        console.log(datosBase)

    })
}

// Agrego un listener a cada Input que escucha cuando se cambia la cantidad y hace el cálculo llamando a la API
for (let i = 0; i < obtenerCantidades.length; i++) {
    obtenerCantidades[i].addEventListener("change", (e) => {

        // Hago un condicional entre los dos inputs, el superior y el inferior
        if (obtenerCantidades[i].parentElement == firstContainer) {

            // Guardo el valor del input como la Cantidad Inicial para enviar a la API
            datosBase.cantidadInicial =  parseFloat(obtenerCantidades[i].value)

            // Guardo el value del select superior como la unidad inicial y el innertext como la unidad en español
            unidadActual = obtenerUnidadInicial.value
            datosBase.unidadInicial = unidadActual
            datosBase.unidadInicialEs = obtenerUnidadInicial[obtenerUnidadInicial.selectedIndex].innerText

            // Guardo el value del select inferior como la unidad de destino y el innertext como la unidad en español
            unidadFinal = obtenerUnidadDestino.value
            datosBase.unidadDestino = unidadFinal
            datosBase.unidadDestinoEs = obtenerUnidadDestino[obtenerUnidadDestino.selectedIndex].innerText

            // Llamo a la API para convertir los valores
            convertir(datosBase.unidadInicial, datosBase.ingrediente, datosBase.cantidadInicial)
            .then(response => {
                let respuesta = response

                // Según la unidad de destino escribo en el otro value el numero q corresponda
                switch (datosBase.unidadDestino) {
                    case "grams":
                        obtenerCantDos.value = respuesta.grams.toFixed(2)
                        datosBase.cantidadDestino = obtenerCantDos.value
                        break;
                    case "cups":
                        obtenerCantDos.value = respuesta.cups.toFixed(2)
                        datosBase.cantidadDestino = obtenerCantDos.value
                        break;
                    case "oz":
                        obtenerCantDos.value = respuesta.oz.toFixed(2)
                        datosBase.cantidadDestino = obtenerCantDos.value
                        break;
                    case "milliliters":
                        obtenerCantDos.value = respuesta.milliliters.toFixed(2)
                        datosBase.cantidadDestino = obtenerCantDos.value
                        break;
                    default:
                        obtenerCantDos.value = 0
                        break;
                }
            })

        } else if (obtenerCantidades[i].parentElement == secondContainer){

            // Guardo el valor del input como la cantidad inicial
            datosBase.cantidadInicial =  parseFloat(obtenerCantidades[i].value)

            // Guardo el value del select inferior como la unidad actual y su inner text como la unidad en español
            unidadActual = obtenerUnidadDestino.value
            datosBase.unidadInicial = unidadActual
            datosBase.unidadInicialEs = obtenerUnidadDestino[obtenerUnidadDestino.selectedIndex].innerText

            // Guardo el value del select superior como la unidad de destino y su inner text como la unidad en español
            unidadFinal = obtenerUnidadInicial.value
            datosBase.unidadDestino = unidadFinal
            datosBase.unidadDestinoEs = obtenerUnidadInicial[obtenerUnidadInicial.selectedIndex].innerText

            // Llamo a la API
            convertir(datosBase.unidadInicial, datosBase.ingrediente, datosBase.cantidadInicial)
            .then(response => {
                let respuesta = response

                // Según la unidad de destino escribo en el otro value el numero q corresponda
                switch (datosBase.unidadDestino) {
                    case "grams":
                        obtenerCantUno.value = respuesta.grams.toFixed(2)
                        datosBase.cantidadDestino = obtenerCantUno.value
                        break;
                    case "cups":
                        obtenerCantUno.value = respuesta.cups.toFixed(2)
                        datosBase.cantidadDestino = obtenerCantUno.value
                        break;
                    case "oz":
                        obtenerCantUno.value = respuesta.oz.toFixed(2)
                        datosBase.cantidadDestino = obtenerCantUno.value
                        break;
                    case "milliliters":
                        obtenerCantUno.value = respuesta.milliliters.toFixed(2)
                        datosBase.cantidadDestino = obtenerCantUno.value
                        break;
                    default:
                        obtenerCantUno.value = 0
                        break;
                }
            })
        }
    })
    
}

// Funcion para guardar los resultados en el Storage
guardar.addEventListener("click", (e) =>{
    //Sumo 1 a la variable idResultado para cambiar el ID cada vez que agrego uno nuevo
    idResultado += 1

    //Creo una variable que tome la fecha y hora exacta en la que se hizo la operación
    let dt = DateTime.now()
    
    //Voy guardando en el array del Storage un objeto nuevo con los resultados
    resultadoStorage.push(new storeResultado(idResultado,datosBase.cantidadInicial,datosBase.unidadInicialEs,datosBase.cantidadDestino,datosBase.unidadDestinoEs,dt.toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS),datosBase.ingredienteEs))

    //Mando, parseando previamente, el objeto al LocalStorage
    localStorage.setItem("resultados",JSON.stringify(resultadoStorage))

    // Llamo a la función para agregar los datos al HTML
    agregarHTML()
})

//Función para agregar los resultados al HTML
function agregarHTML() {
    // Borro el texto de "Aquí veras los resultados" si existe
    let mensaje = document.getElementById("mensaje")

    if (mensaje != null) {mensaje.remove()} 

    // Creo una variable para buscar el length del array del Storage y le resto 1 para encontrar la última posición
    let ultimoResult = resultadoStorage.length
    ultimoResult -= 1

    // Creo un nuevo P
    let nuevoP = document.createElement("p")

    //Le agrego el texto al p
    nuevoP.innerText = `${resultadoStorage[ultimoResult].fechayhora} - ${resultadoStorage[ultimoResult].cantInicial} ${resultadoStorage[ultimoResult].unInicial} de ${resultadoStorage[ultimoResult].ingredient} equivalen a ${resultadoStorage[ultimoResult].resultOp} ${resultadoStorage[ultimoResult].unDestino} de ${resultadoStorage[ultimoResult].ingredient}`

    // Busco el div donde imprimir el p
    let historial = document.getElementById("historial")

    //Imprimo el p en el div
    historial = historial.append(nuevoP)
}

// Al hacer click en el botón de "Borrar Historial" borro el Local Storage y por ende el contenido del html
borrarHistorial.onclick = (e) => {
    localStorage.clear()
    location.reload()
}