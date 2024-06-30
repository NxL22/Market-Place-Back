
export function validateEmail(email) {
    // Elimina espacios al principio y al final
    email = email.trim();
    // Elimina espacios dentro del correo
    email = email.replace(/\s+/g, '');

    // Expresión regular para validar el formato del correo electrónico
    const validate = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return validate.test(String(email).toLowerCase());
}


// function esDominioValido(correo) {
//     // Obtener el dominio del correo
//     const dominio = correo.split('@')[1];
//     // Lista de dominios válidos
//     const dominiosValidos = ["com", "org", "net", "edu", "gov", "mil", "int"];
//     // Obtener la extensión del dominio
//     const extension = dominio.split('.').pop();
//     // Verificar si la extensión está en la lista de dominios válidos
//     return dominiosValidos.includes(extension);
// }


