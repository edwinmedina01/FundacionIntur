const bcrypt = require('bcryptjs');

const password = 'tu_contraseña';
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);

console.log(hash);
