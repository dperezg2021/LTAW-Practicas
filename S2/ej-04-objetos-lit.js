//-- Ejemplo de definición y uso de objetos literales

//-- Definiendo un objeto con varias propiedades y valores
const objeto1 = {
    nombre: "Objeto-1",
    valor: 10,
    test: true
};

const objeto2 ={
    nombre: "Objeto-2",
    valor : 15,
    test: false
}

//-- Imprimiendo las propiedades del objeto
console.log("Nombre: " + objeto1.nombre);
console.log("Valor: " + objeto1.valor);
console.log("Test: " + objeto1.test);

//-- También te puedes referir a las propiedades
//-- usando su nombre entre comillas
console.log("");
console.log("Nombre: " + objeto2["nombre"]);
console.log("Valor: " + objeto2["valor"]);
console.log("Test: " + objeto2["test"]);

//-- Comprobar si un objeto tiene una propiedad
if ("test" in objeto1) {
    console.log("\nTiene propidad test");
}

//-- Recorrer todas las propiedades
console.log("");
for (let prop in objeto1) {
    console.log(`Propiedad: ${prop} --> Valor: ${objeto1[prop]}`);
}

//-- Forma abreviada para obtener constantes
//-- con las propiedades del objeto
const { valor, nombre } = objeto1;

console.log("");
console.log("Nombre: " + nombre);
console.log("Valor: " + valor);