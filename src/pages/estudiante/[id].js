import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';

const EditarEstudiante = () => {
  const [estudiante, setEstudiante] = useState(null);
  const [institutos, setInstitutos] = useState([]);
  const [areas, setAreas] = useState([]);
  const [beneficios, setBeneficios] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [sexos, setSexos] = useState([{ id: 1, descripcion: 'Masculino' }, { id: 0, descripcion: 'Femenino' }]);

  const [personaData, setPersonaData] = useState({
    Primer_Nombre: '',
    Segundo_Nombre: '',
    Primer_Apellido: '',
    Segundo_Apellido: '',
    Sexo: '',
    Fecha_Nacimiento: '',
    Lugar_Nacimiento: '',
    Identidad: '',
    Creado_Por: '',
    Id_Departamento: 0,
    Id_Municipio: 0
  });

  const [estudianteData, setEstudianteData] = useState({
    Id_Beneficio: '',
    Id_Area: '',
    Id_Instituto: '',
    Creado_Por: '',
  });

  const router = useRouter();
  const { id } = router.query;  // Obtener el ID desde la URL

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
      console.error('Error al obtener el estudiante', error);
    }
  };

  const fetchInstitutos = async () => {
    try {
      const response = await axios.get('/api/institutos');
      setInstitutos(response.data);
    } catch (error) {
      console.error('Error al obtener institutos', error);
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await axios.get('/api/areas');
      setAreas(response.data);
    } catch (error) {
      console.error('Error al obtener áreas', error);
    }
  };

  const fetchBeneficios = async () => {
    try {
      const response = await axios.get('/api/beneficios');
      setBeneficios(response.data);
    } catch (error) {
      console.error('Error al obtener beneficios', error);
    }
  };

  const fetchDepartamentos = async () => {
    try {
      const response = await axios.get('/api/departamentos');
      setDepartamentos(response.data);
    } catch (error) {
      console.error('Error al obtener departamentos', error);
    }
  };

  const fetchMunicipios = async (departamentoId) => {
    try {
      const response = await axios.get(`/api/municipios?Id_Departamento=${departamentoId}`);
      setMunicipios(response.data);
    } catch (error) {
      console.error('Error al obtener municipios', error);
    }
  };

  const handlePersonaInputChange = (e) => {
    if (e.target.name === 'Id_Departamento') {
      fetchMunicipios(e.target.value);
    }
    setPersonaData({ ...personaData, [e.target.name]: e.target.value });
  };

  const handleEstudianteInputChange = (e) => {
    setEstudianteData({ ...estudianteData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/estudiantes/${id}`, { personaData, estudianteData });
      router.push('/estudiante/reporte');  // Redirigir a la lista de estudiantes
    } catch (error) {
      console.error('Error al actualizar estudiante y persona', error);
    }
  };

  const handleCancel = () => {
    router.push('/estudiante/reporte');  // Cancelar y redirigir
  };

  if (!estudiante) return <div>Loading...</div>;

  return (
    <Layout>
      <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">Editar Estudiante</h1>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg mb-10 space-y-6">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
    </div>

    {/* Sexo */}
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
          <option key={sexo.id} value={sexo.id}>
            {sexo.descripcion}
          </option>
        ))}
      </select>
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

    {/* Identidad */}
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

    {/* Creado Por 
    <div className="flex flex-col">
      <label htmlFor="Creado_Por" className="text-gray-700">Creado Por</label>
      <input
        id="Creado_Por"
        type="text"
        name="Creado_Por"
        placeholder="Creado Por"
        value={personaData.Creado_Por}
        onChange={handlePersonaInputChange}
        required
        className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 mt-2"
      />
    </div>*/}
  </div>

  {/* Beneficio, Área, y Instituto */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
          <option key={area.Id_Area} value={area.Id_Area}>
            {area.Nombre_Area}
          </option>
        ))}
      </select>
    </div>

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
    </Layout>
  );
};

export default EditarEstudiante;
