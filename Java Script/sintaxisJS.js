/**
 * INTRODUCCIÓN A LA SINTAXIS DE JAVASCRIPT (ES6+)
*/

// Comentarios una línea 

/* 
Comentarios multilínea
*/


/*
Variables y constantes
- let: para variables que pueden reasignarse.
- const: para valores que NO cambian (constantes).
- var: no recomendado en código moderno (no se permite en el curso).
 */

/* Forma incorrecta (por usar 'var' y por el alcance)
var nombreGato = "Stella";   
*/

let nombrePerro = "Mia";

let nombreCabra;
nombreCabra = "Amber";       // Primera asignación
nombreCabra = "Amatista";    // Reasignación (cambia el valor)
console.log("Nombre de la cabra:", nombreCabra);   // Imprime "Amatista"

// --- Ejemplo con const (valores inmutables) ---
const PI = 3.14;
console.log("Valor de PI:", PI);
// PI = 3.1416;   // Error: no se puede reasignar una constante

const MAXIMO_USUARIOS = 1000;   // Convención: mayúsculas para constantes fijas
console.log("Máximo de usuarios:", MAXIMO_USUARIOS);

// Nota: 'const' no hace inmutable el objeto, solo la referencia.

// Tipos de datos 

let texto = "Hola mundo";            // String (cadena)
let numero = 42;                     // Number (entero o flotante)
let booleano = true;                // Boolean (true/false)
let indefinido;                     // undefined (no asignado)
let nulo = null;                    // null (valor nulo intencional)
let simbolo = Symbol("único");      // Symbol (ES6)
let bigInt = 9007199254740991n;     // BigInt (números muy grandes)

console.log("String:", texto);
console.log("Number:", numero);
console.log("Boolean:", booleano);
console.log("Undefined:", indefinido);
console.log("Null:", nulo);
console.log("Symbol:", simbolo);
console.log("BigInt:", bigInt);

// Para conocer el tipo de una variable se usa typeof
console.log("Tipo de texto:", typeof texto);   // "string"
console.log("Tipo de numero:", typeof numero); // "number"

// Operadores 

// Aritméticos
let a = 10;
let b = 3;
console.log("Suma:", a + b);          // 13
console.log("Resta:", a - b);         // 7
console.log("Multiplicación:", ab); // 30
console.log("División:", a / b);      // 3.333...
console.log("Módulo (resto):", a % b); // 1
console.log("Potencia:", a ** b);     // 10^3 = 1000

// Incremento / decremento
let contador = 5;
contador++;   // suma 1 (ahora 6)
contador--;   // resta 1 (vuelve a 5)
console.log("Contador final:", contador);

// Asignación compuesta
let x = 10;
x += 5;   // x = x + 5  -> 15
x *= 2;   // x = x2  -> 30
console.log("x después de operaciones:", x);

// Comparación 
console.log("10 > 3:", 10 > 3);      // true
console.log("10 == '10':", 10 == "10"); // true (igualdad débil, convierte tipos)
console.log("10 === '10':", 10 === "10"); // false (igualdad estricta, mismo tipo)
console.log("10 != '10':", 10 != "10");   // false (desigualdad débil)
console.log("10 !== '10':", 10 !== "10"); // true (desigualdad estricta)

// Lógicos: && (AND), || (OR), ! (NOT)
let esMayor = true;
let esMenor = false;
console.log("AND:", esMayor && esMenor);  // false
console.log("OR:", esMayor || esMenor);   // true
console.log("NOT:", !esMayor);            // false


// --- Condicional if / else if / else ---
let edad = 20;
if (edad >= 18) {
    console.log("Eres mayor de edad.");
} else if (edad >= 13) {
    console.log("Eres adolescente.");
} else {
    console.log("Eres niño o niña.");
}

// --- Switch ---
let dia = 3;  // 1=lunes, 2=martes, ...
switch (dia) {
    case 1:
        console.log("Lunes");
        break;
    case 2:
        console.log("Martes");
        break;
    case 3:
        console.log("Miércoles");
        break;
    default:
        console.log("Otro día");
}

// --- Bucle for ---
console.log("Bucle for (0 a 4):");
for (let i = 0; i < 5; i++) {
    console.log(i);
}

// --- Bucle while ---
let j = 0;
console.log("Bucle while (0 a 2):");
while (j < 3) {
    console.log(j);
    j++;
}

// --- Bucle do-while (se ejecuta al menos una vez) ---
let k = 5;
console.log("Bucle do-while (solo una vez):");
do {
    console.log("k =", k);
    k++;
} while (k < 3);  // condición falsa, pero ya se ejecutó una vez

// --- for...of (iterar sobre valores de arrays u objetos iterables) ---
const frutas = ["manzana", "pera", "uva"];
console.log("for...of sobre array:");
for (let fruta of frutas) {
    console.log(fruta);
}

// --- for...in (iterar sobre propiedades de un objeto) ---
const persona = { nombre: "Ana", edad: 30, ciudad: "Madrid" };
console.log("for...in sobre objeto:");
for (let propiedad in persona) {
    console.log(propiedad + ":", persona[propiedad]);
}

// Funciones 

// --- Declaración de función (function declaration) ---
function sumar(a, b) {
    return a + b;
}
console.log("Sumar 3 + 4 =", sumar(3, 4));

// --- Expresión de función (function expression) ---
const restar = function(a, b) {
    return a - b;
};
console.log("Restar 10 - 4 =", restar(10, 4));

// --- Función flecha (arrow function) - más moderna y concisa ---
const multiplicar = (a, b) => ab;
console.log("Multiplicar 56 =", multiplicar(5, 6));

// Con bloque y múltiples instrucciones:
const dividir = (a, b) => {
    if (b === 0) {
        return "No se puede dividir por cero";
    }
    return a / b;
};
console.log("Dividir 10 / 2 =", dividir(10, 2));
console.log("Dividir 10 / 0 =", dividir(10, 0));

// --- Parámetros por defecto ---
function saludar(nombre = "Invitado") {
    return "Hola, " + nombre + "!";
}
console.log(saludar());          // Hola, Invitado!
console.log(saludar("Carlos"));  // Hola, Carlos!

// --- Funciones como argumentos (callbacks) ---
function procesar(valor, callback) {
    return callback(valor);
}
const duplicar = (n) => n2;
console.log("Procesar duplicando 7:", procesar(7, duplicar));



// Objetos: Los objetos son colecciones de pares clave-valor.

// Creación con notación literal (recomendada)
const coche = {
    marca: "Toyota",
    modelo: "Corolla",
    año: 2022,
    // Método (función dentro del objeto)
    descripcion: function() {
        return this.marca + " " + this.modelo + " (" + this.año + ")";
    },
    // Método con sintaxis abreviada (ES6)
    arrancar() {
        console.log("El coche ha arrancado.");
    }
};

console.log("Marca:", coche.marca);
console.log("Modelo:", coche["modelo"]);   // otra forma de acceder
console.log("Descripción:", coche.descripcion());
coche.arrancar();

// Agregar nuevas propiedades dinámicamente
coche.color = "rojo";
console.log("Color añadido:", coche.color);

// Eliminar propiedades
delete coche.año;
console.log("Después de eliminar año:", coche);

// --- Destructuring de objetos (extraer propiedades) ---
const { marca, modelo } = coche;
console.log("Destructuring: marca=", marca, "modelo=", modelo);

// --- Spread operator (...) para clonar o combinar objetos ---
const copiaCoche = { ...coche };
console.log("Copia del coche:", copiaCoche);

// Listas: Los arrays son listas ordenadas de valores (pueden ser de diferentes tipos).

// Creación
const numeros = [1, 2, 3, 4, 5];
const mezclado = [1, "hola", true, null, { nombre: "objeto" }];

// Acceso por índice (empieza en 0)
console.log("Primer número:", numeros[0]);   // 1
console.log("Último número:", numeros[numeros.length - 1]); // 5

// Métodos básicos
numeros.push(6);        // añade al final
numeros.pop();          // elimina el último (devuelve el eliminado)
numeros.unshift(0);     // añade al principio
numeros.shift();        // elimina el primero
console.log("Array después de operaciones:", numeros); // [1,2,3,4,5]

// Recorrer con forEach (función callback)
console.log("forEach:");
numeros.forEach((num, indice) => {
    console.log("Índice", indice, ":", num);
});

// Métodos funcionales: map, filter, reduce
const dobles = numeros.map(n => n2);
console.log("Dobles:", dobles);  // [2,4,6,8,10]

const pares = numeros.filter(n => n % 2 === 0);
console.log("Pares:", pares);    // [2,4]

const sumaTotal = numeros.reduce((acum, actual) => acum + actual, 0);
console.log("Suma total:", sumaTotal); // 15

// Destructuring de arrays
const [primero, segundo, ...resto] = numeros;
console.log("Primero:", primero, "Segundo:", segundo, "Resto:", resto);

// Spread con arrays (copiar o concatenar)
const otros = [6, 7, 8];
const todos = [...numeros, ...otros];
console.log("Concatenados:", todos);

// Templates de cadena (Template Literals): Permiten insertar variables y expresiones dentro de strings
// usando backticks (`) y ${...}

const nombre = "María";
const edad2 = 28;
const mensaje = `Hola, me llamo ${nombre} y tengo ${edad2} años. 
El año que viene tendré ${edad2 + 1}.`;
console.log(mensaje);

// También permiten saltos de línea sin necesidad de \n
const poema = `Roses are red,
Violets are blue,
JavaScript is fun,
And so are you.`;
console.log(poema);

// Excepciones 

try {
    // Código que podría lanzar un error
    let resultado = 10 / 0;  // En JS no lanza error, da Infinity
    if (!isFinite(resultado)) {
        throw new Error("División por cero no permitida");
    }
    console.log("Resultado:", resultado);
} catch (error) {
    console.error("Ocurrió un error:", error.message);
} finally {
    console.log("Esto siempre se ejecuta (finally).");
}

// --- Map: colección de pares clave-valor con claves de cualquier tipo ---
const mapa = new Map();
mapa.set("nombre", "Luis");
mapa.set(42, "respuesta");
mapa.set(true, "verdadero");
console.log("Map:", mapa);
console.log("Valor de 'nombre':", mapa.get("nombre"));
console.log("Tamaño del Map:", mapa.size);

// --- Set: colección de valores únicos ---
const conjunto = new Set([1, 2, 2, 3, 4, 4, 5]);
console.log("Set (sin duplicados):", conjunto);  // {1,2,3,4,5}
conjunto.add(6);
console.log("Set después de añadir 6:", conjunto);