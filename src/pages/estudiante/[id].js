import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import AuthContext from "../../context/AuthContext";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";

const EditarEstudiante = () => {
  const [estudiante, setEstudiante] = useState(null);
  const [institutos, setInstitutos] = useState([]);
    const [activeTab, setActiveTab] = useState(1); // para las pestañas en el mismo formulario
  const [areas, setAreas] = useState([]);
  const [beneficios, setBeneficios] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [sexos, setSexos] = useState([
    { id: 1, descripcion: "Masculino" },
    { id: 0, descripcion: "Femenino" },
  ]);
  const [permisos, setPermisos] = useState([]);
  const { user } = useContext(AuthContext);
  const [personaData, setPersonaData] = useState({
    Primer_Nombre: "",
    Segundo_Nombre: "",
    Primer_Apellido: "",
    Segundo_Apellido: "",
    Sexo: "",
    Fecha_Nacimiento: "",
    Lugar_Nacimiento: "",
    Identidad: "",
    Creado_Por: "",
    Id_Departamento: 0,
    Id_Municipio: 0,
  });

  const [estudianteData, setEstudianteData] = useState({
    Id_Beneficio: "",
    Id_Area: "",
    Id_Instituto: "",
    Creado_Por: "",
  });
  const [tutorData, setTutorData] = useState({
    Identidad: '',
    Nombre_Completo: '',
    Sexo: '',
    Direccion: '',
    Telefono: '',
  });
  
  const [benefactorData, setBenefactorData] = useState({
    Identidad: '',
    Nombre_Completo: '',
    Telefono: '',
    Direccion: '',
  });
  const router = useRouter();
  const { id } = router.query; // Obtener el ID desde la URL

  useEffect(() => {
    if (id) {
      fetchEstudiante(id);
    }
    fetchInstitutos();
    fetchAreas();
    fetchBeneficios();
    fetchDepartamentos();
  }, [id]);
  useEffect(() => {
    if (user && user.rol) {
      fetchPermisos(user.rol);
    }
  }, [user]);

  useEffect(() => {
    if (personaData.Id_Departamento) {
      fetchMunicipios(personaData.Id_Departamento);
    } else {
      setMunicipios([]); // Reinicia municipios si no hay departamento seleccionado
    }
  }, [personaData.Id_Departamento]);

  const fetchEstudiante = async (id) => {
    try {
      const response = await axios.get(`/api/estudiantes/${id}`);
      setEstudiante(response.data);
      setPersonaData(response.data.Persona);
      setEstudianteData({
        Id_Beneficio: response.data.Id_Beneficio,
        Id_Area: response.data.Id_Area,
        Id_Instituto: response.data.Id_Instituto,
        Creado_Por: response.data.Creado_Por,
      });
    } catch (error) {
      console.error("Error al obtener el estudiante", error);
    }
  };

  const fetchInstitutos = async () => {
    try {
      const response = await axios.get("/api/institutos");
      setInstitutos(response.data);
    } catch (error) {
      console.error("Error al obtener institutos", error);
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await axios.get("/api/areas");
      setAreas(response.data);
    } catch (error) {
      console.error("Error al obtener áreas", error);
    }
  };

  const fetchBeneficios = async () => {
    try {
      const response = await axios.get("/api/beneficios");
      setBeneficios(response.data);
    } catch (error) {
      console.error("Error al obtener beneficios", error);
    }
  };

  const fetchDepartamentos = async () => {
    try {
      const response = await axios.get("/api/departamentos");
      setDepartamentos(response.data);
    } catch (error) {
      console.error("Error al obtener departamentos", error);
    }
  };
  const fetchPermisos = async (rolId) => {
    try {
      const response = await axios.get(`/api/permisos?rolId=${rolId}`);
      // Convierte la lista de permisos en un objeto de permisos
      const permisosMap = response.data.reduce((acc, permiso) => {
        acc[permiso.Id_Objeto] = {
          insertar: permiso.Permiso_Insertar === "1",
          actualizar: permiso.Permiso_Actualizar === "1",
          eliminar: permiso.Permiso_Eliminar === "1",
          consultar: permiso.Permiso_Consultar === "1",
        };
        return acc;
      }, {});
      setPermisos(permisosMap);
    } catch (error) {
      console.error("Error al obtener permisos", error);
    }
  };
  const fetchMunicipios = async (departamentoId) => {
    try {
      const response = await axios.get(
        `/api/municipios?Id_Departamento=${departamentoId}`
      );
      setMunicipios(response.data);
    } catch (error) {
      console.error("Error al obtener municipios", error);
    }
  };

  const handlePersonaInputChange = (e) => {
    if (e.target.name === "Id_Departamento") {
      fetchMunicipios(e.target.value);
    }
    setPersonaData({ ...personaData, [e.target.name]: e.target.value });
  };

  const handleEstudianteInputChange = (e) => {
    setEstudianteData({ ...estudianteData, [e.target.name]: e.target.value });
  };
// Ejemplo para handleTutorInputChange
const handleTutorInputChange = (event) => {
  const { name, value } = event.target;
  setTutorData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};

// Ejemplo para handleBenefactorInputChange
const handleBenefactorInputChange = (event) => {
  const { name, value } = event.target;
  setBenefactorData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/estudiantes/${id}`, {
        personaData,
        estudianteData,
      });
      router.push("/estudiante/reporte"); // Redirigir a la lista de estudiantes
    } catch (error) {
      console.error("Error al actualizar estudiante y persona", error);
    }
  };

  const handleCancel = () => {
    router.push("/estudiante/reporte"); // Cancelar y redirigir
  };

  if (!estudiante) return <div>Loading...</div>;

  return (
    <Layout>
      {permisos[1]?.actualizar ? (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
          <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">
            Editar Registro
          </h1>

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg mb-10">
  {/* Pestañas */}
  <div className="flex border-b-2">
    <button
      type="button"
      onClick={() => setActiveTab(1)}
      className={`p-4 ${
        activeTab === 1 ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-700"
      } transition duration-300 ease-in-out`}
    >
      Estudiante
    </button>
    <button
      type="button"
      onClick={() => setActiveTab(2)}
      className={`p-4 ${
        activeTab === 2 ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-700"
      } transition duration-300 ease-in-out`}
    >
      Tutor/Padre
    </button>
    <button
      type="button"
      onClick={() => setActiveTab(3)}
      className={`p-4 ${
        activeTab === 3 ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-700"
      } transition duration-300 ease-in-out`}
    >
      Benefactor
    </button>
  </div>

  {/* Sección Estudiante */}
  {activeTab === 1 && (
    <div className="space-y-6">
  {/* Datos Personales */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4">
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Datos del Estudiante</h2>

      {/* Primer Nombre */}
      <div className="flex flex-col">
        <label htmlFor="Primer_Nombre" className="text-gray-700">Primer Nombre</label>
        <input
          id="Primer_Nombre"
          type="text"
          name="Primer_Nombre"
          placeholder="Primer Nombre"
          value={personaData.Primer_Nombre}
          onChange={handlePersonaInputChange}
          required
          className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 mt-2"
        />
      </div>

      {/* Segundo Nombre */}
      <div className="flex flex-col">
        <label htmlFor="Segundo_Nombre" className="text-gray-700">Segundo Nombre</label>
        <input
          id="Segundo_Nombre"
          type="text"
          name="Segundo_Nombre"
          placeholder="Segundo Nombre"
          value={personaData.Segundo_Nombre}
          onChange={handlePersonaInputChange}
          className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 mt-2"
        />
      </div>

      {/* Fecha de Nacimiento */}
      <div className="flex flex-col">
        <label htmlFor="Fecha_Nacimiento" className="text-gray-700">Fecha de Nacimiento</label>
        <input
          id="Fecha_Nacimiento"
          type="date"
          name="Fecha_Nacimiento"
          placeholder="Fecha de Nacimiento"
          value={personaData.Fecha_Nacimiento}
          onChange={handlePersonaInputChange}
          className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 mt-2"
        />
      </div>

      {/* Departamento */}
      <div className="flex flex-col">
        <label htmlFor="Id_Departamento" className="text-gray-700">Departamento</label>
        <select
          id="Id_Departamento"
          name="Id_Departamento"
          value={personaData.Id_Departamento}
          onChange={handlePersonaInputChange}
          className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 mt-2"
          required
        >
          <option value="">Seleccione un Departamento</option>
          {departamentos.map((departamento) => (
            <option key={departamento.Id_Departamento} value={departamento.Id_Departamento}>
              {departamento.Nombre_Departamento}
            </option>
          ))}
        </select>
      </div>

      {/* Municipio */}
      <div className="flex flex-col">
        <label htmlFor="Id_Municipio" className="text-gray-700">Municipio</label>
        <select
          id="Id_Municipio"
          name="Id_Municipio"
          value={personaData.Id_Municipio}
          onChange={handlePersonaInputChange}
          className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 mt-2"
          required
        >
          <option value="">Seleccione un Municipio</option>
          {municipios.map((municipio) => (
            <option key={municipio.Id_Municipio} value={municipio.Id_Municipio}>
              {municipio.Nombre_Municipio}
            </option>
          ))}
        </select>
      </div>

      {/* Número de Identidad */}
      <div className="flex flex-col">
        <label htmlFor="Identidad" className="text-gray-700">Número de Identidad</label>
        <input
          id="Identidad"
          type="text"
          name="Identidad"
          placeholder="Número de Identidad"
          value={personaData.Identidad}
          onChange={handlePersonaInputChange}
          required
          className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 mt-2"
        />
      </div>
    </div>

    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Beneficio, Área e Instituto</h2>
      {/* Primer Apellido */}
      <div className="flex flex-col">
        <label htmlFor="Primer_Apellido" className="text-gray-700">Primer Apellido</label>
        <input
          id="Primer_Apellido"
          type="text"
          name="Primer_Apellido"
          placeholder="Primer Apellido"
          value={personaData.Primer_Apellido}
          onChange={handlePersonaInputChange}
          required
          className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 mt-2"
        />
      </div>

      {/* Segundo Apellido */}
      <div className="flex flex-col">
        <label htmlFor="Segundo_Apellido" className="text-gray-700">Segundo Apellido</label>
        <input
          id="Segundo_Apellido"
          type="text"
          name="Segundo_Apellido"
          placeholder="Segundo Apellido"
          value={personaData.Segundo_Apellido}
          onChange={handlePersonaInputChange}
          className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 mt-2"
        />
      </div>     {/* Sexo */}
      <div className="flex flex-col">
        <label htmlFor="Sexo" className="text-gray-700">Sexo</label>
        <select
          id="Sexo"
          name="Sexo"
          value={personaData.Sexo}
          onChange={handlePersonaInputChange}
          className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 mt-2"
          required
        >
          <option value="">Seleccione un sexo</option>
          {sexos.map((sexo) => (
            <option key={sexo.id} value={sexo.id}>{sexo.descripcion}</option>
          ))}
        </select>
      </div>
      {/* Beneficio */}
      <div className="flex flex-col">
        <label htmlFor="Id_Beneficio" className="text-gray-700">Beneficio</label>
        <select
          id="Id_Beneficio"
          name="Id_Beneficio"
          value={estudianteData.Id_Beneficio}
          onChange={handleEstudianteInputChange}
          className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 mt-2"
          required
        >
          <option value="">Selecciona un Beneficio</option>
          {beneficios.map((beneficio) => (
            <option key={beneficio.Id_Beneficio} value={beneficio.Id_Beneficio}>
              {beneficio.Nombre_Beneficio}
            </option>
          ))}
        </select>
      </div>
              {/* Estado */}
              <div className="flex flex-col">
                <label htmlFor="Estado" className="text-gray-700">
                  Estado
                </label>
                <select
                  id="Estado"
                  name="Estado"
                  value={personaData.Estado}
                  onChange={handlePersonaInputChange}
                  required
                  className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 mt-2"
                >
                  <option value="1">Activo</option>
                  <option value="0">Inactivo</option>
                </select>
              </div>
      {/* Área */}
      <div className="flex flex-col">
        <label htmlFor="Id_Area" className="text-gray-700">Área</label>
        <select
          id="Id_Area"
          name="Id_Area"
          value={estudianteData.Id_Area}
          onChange={handleEstudianteInputChange}
          className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 mt-2"
          required
        >
          <option value="">Selecciona un Área</option>
          {areas.map((area) => (
            <option key={area.Id_Area} value={area.Id_Area}>{area.Nombre_Area}</option>
          ))}
        </select>
      </div>

      {/* Instituto */}
      <div className="flex flex-col">
        <label htmlFor="Id_Instituto" className="text-gray-700">Instituto</label>
        <select
          id="Id_Instituto"
          name="Id_Instituto"
          value={estudianteData.Id_Instituto}
          onChange={handleEstudianteInputChange}
          className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 mt-2"
          required
        >
          <option value="">Selecciona un Instituto</option>
          {institutos.map((instituto) => (
            <option key={instituto.Id_Instituto} value={instituto.Id_Instituto}>
              {instituto.Nombre_Instituto}
            </option>
          ))}
        </select>
      </div>
    </div>
  </div>
</div>
  )}
             {/* Sección Tutor/Padre */}
             {activeTab === 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="Identidad_Tutor"
                    className="text-gray-700 font-medium"
                  >
                    Identidad
                  </label>
                  <input
                    id="Identidad_Tutor"
                    type="text"
                    name="Identidad_Tutor"
                    placeholder="Número de Identidad"
                    value={tutorData.Identidad}
                    onChange={handleTutorInputChange}
                    required
                    className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mt-2 transition duration-300"
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="Nombre_Tutor"
                    className="text-gray-700 font-medium"
                  >
                    Nombre Completo
                  </label>
                  <input
                    id="Nombre_Tutor"
                    type="text"
                    name="Nombre_Tutor"
                    placeholder="Nombre Completo"
                    value={tutorData.Nombre}
                    onChange={handleTutorInputChange}
                    required
                    className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mt-2 transition duration-300"
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="Sexo_Tutor"
                    className="text-gray-700 font-medium"
                  >
                    Sexo
                  </label>
                  <select
                    id="Sexo_Tutor"
                    name="Sexo_Tutor"
                    value={tutorData.Sexo}
                    onChange={handleTutorInputChange}
                    required
                    className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mt-2 transition duration-300"
                  >
                    <option value="">Seleccione Sexo</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="Direccion_Tutor"
                    className="text-gray-700 font-medium"
                  >
                    Dirección
                  </label>
                  <input
                    id="Direccion_Tutor"
                    type="text"
                    name="Direccion_Tutor"
                    placeholder="Dirección del Tutor"
                    value={tutorData.Direccion}
                    onChange={handleTutorInputChange}
                    required
                    className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mt-2 transition duration-300"
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="Telefono_Tutor"
                    className="text-gray-700 font-medium"
                  >
                    Teléfono
                  </label>
                  <input
                    id="Telefono_Tutor"
                    type="text"
                    name="Telefono_Tutor"
                    placeholder="Teléfono del Tutor"
                    value={tutorData.Telefono}
                    onChange={handleTutorInputChange}
                    required
                    className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mt-2 transition duration-300"
                  />
                </div>
              </div>
            )}
                      {/* Sección Benefactor */}
                      {activeTab === 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="Identidad_Benefactor"
                    className="text-gray-700 font-medium"
                  >
                    Identidad
                  </label>
                  <input
                    id="Identidad_Benefactor"
                    type="text"
                    name="Identidad_Benefactor"
                    placeholder="Número de Identidad"
                    value={benefactorData.Identidad}
                    onChange={handleBenefactorInputChange}
                    required
                    className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mt-2 transition duration-300"
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="Nombre_Benefactor"
                    className="text-gray-700 font-medium"
                  >
                    Nombre Completo
                  </label>
                  <input
                    id="Nombre_Benefactor"
                    type="text"
                    name="Nombre_Benefactor"
                    placeholder="Nombre Completo"
                    value={benefactorData.Nombre}
                    onChange={handleBenefactorInputChange}
                    required
                    className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mt-2 transition duration-300"
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="Telefono_Benefactor"
                    className="text-gray-700 font-medium"
                  >
                    Teléfono
                  </label>
                  <input
                    id="Telefono_Benefactor"
                    type="text"
                    name="Telefono_Benefactor"
                    placeholder="Teléfono del Benefactor"
                    value={benefactorData.Telefono}
                    onChange={handleBenefactorInputChange}
                    required
                    className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mt-2 transition duration-300"
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="Direccion_Benefactor"
                    className="text-gray-700 font-medium"
                  >
                    Dirección
                  </label>
                  <input
                    id="Direccion_Benefactor"
                    type="text"
                    name="Direccion_Benefactor"
                    placeholder="Dirección del Benefactor"
                    value={benefactorData.Direccion}
                    onChange={handleBenefactorInputChange}
                    required
                    className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mt-2 transition duration-300"
                  />
                </div>
              </div>
            )}

<br></br>
<div className="flex justify-center">
    <button type="submit" className="bg-blue-500 text-white p-4 rounded shadow-lg w-1/2 hover:bg-blue-600">
      Guardar Estudiante
    </button>
    <button
              type="button"
              className="ml-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
           onClick={handleCancel}
           >
              Cancelar
            </button>
  </div>
</form>
        </div>
      ) : (
        // Mostrar el mensaje si no tiene permisos para Insertar

        <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-lg flex items-center">
          <ShieldExclamationIcon className="h-12 w-12 mr-4" />
          <div>
            <h3 className="font-bold text-lg">
              Sin permisos para Editar Registros
            </h3>
            <p>No tienes permisos para consultar la información.</p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default EditarEstudiante;
