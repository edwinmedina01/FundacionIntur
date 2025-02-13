
  import { reglasGenerales } from "../src/utils/reglasGenerales";

  export const reglasValidacion = {
    Objeto: { ...reglasGenerales.NombreUnicoConGuion(5, 45), requerido: true },
    Descripcion: { ...reglasGenerales.TextoLibre(10, 80), requerido: true },
    Tipo_Objeto: { ...reglasGenerales.NombreUnico(5, 45), requerido: true },
    Estado: { tipo: "int", requerido: true, opciones: [0, 1] },
};




