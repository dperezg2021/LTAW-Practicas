//-- Ejemplo de arrays literales

//-- Crear una lista (array) de 4 elementos
const a = [1,3,5,7];
const b = [10,20,30,40];

//-- Mostrar el elemento 2
console.log("Elemento 2: " + a[2]);

//-- Recorrer todos los elementos
for (let i in a) {
    console.log(`a[${i}] = ${a[i]}`);
}
for (let i in a){
    console.log(`b [${i}] = ${b[i]}`);
}

//-- Imprimir el numero total de elementosno
console.log("Cantidad de elementos: " + a.length);