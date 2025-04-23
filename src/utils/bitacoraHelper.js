import BitacoraAccion from '../../models/BitacoraAccion';

export const registrarBitacora = async ({
  Id_Usuario,
  Modulo,
  Tipo_Accion,
  Data_Antes = null,
  Data_Despues = null,
  Detalle = "",
  IP_Usuario = "",
  Navegador = ""
}) => {
  try {
    await BitacoraAccion.create({
      Id_Usuario,
      Modulo,
      Tipo_Accion,
      Data_Antes: JSON.stringify(Data_Antes),
      Data_Despues: JSON.stringify(Data_Despues),
      Detalle,
      IP_Usuario,
      Navegador,
      Fecha: new Date()
    });
  } catch (error) {
    console.error("❌ Error registrando bitácora:", error);
  }
};
