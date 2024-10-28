import bcrypt from 'bcrypt'


export const cryptPassword = async (password) => {
    const hash = await bcrypt.hash(password, 10);
    return hash;
}

export const matchPassword = async (plainPassword, encryptPassword) => {
    const validPassword = await bcrypt.compare(plainPassword, encryptPassword);
    return validPassword;
}
