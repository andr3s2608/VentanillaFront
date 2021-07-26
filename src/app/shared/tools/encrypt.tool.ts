/**
 * Encriptar la inforamción.
 * @param payload Información a guardar.
 * @return Información encrypt.
 */
const encryptTool = (payload: any): string => {
  const payloadString = JSON.stringify(payload);
  const payloadEncrypt = btoa(payloadString);
  return payloadEncrypt;
};

/**
 * Obtener el payload de la información encrypt.
 * @param encrypt String a desencriptar.
 * @return Información desencrypt.
 */
const desencryptTool = (encrypt: string): any => {
  if (encrypt === '' || encrypt.trim() === '') {
    return false;
  }
  try {
    const payloadJSON = JSON.parse(atob(encrypt));
    return payloadJSON;
  } catch (err) {
    return false;
  }
};

export { encryptTool, desencryptTool };
