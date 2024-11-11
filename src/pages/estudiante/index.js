import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';

const EstudiantesCrud = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [institutos, setInstitutos] = useState([]);
  const [areas, setAreas] = useState([]);
  const [beneficios, setBeneficios] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [sexos, setSexos] = useState([{id: 1, descripcion: 'Masculino'}, {id: 0, descripcion: 'Femenino'}]);

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
  const [editId, setEditId] = useState(null);
  const [editPersonaId, setEditPersonaId] = useState(null);

  useEffect(() => {
    fetchEstudiantes();
    fetchInstitutos();
    fetchAreas();
    fetchBeneficios();
    fetchDepartamentos();
  }, []);

  const fetchEstudiantes = async () => {
    try {
      const response = await axios.get('/api/estudiantes');
      setEstudiantes(response.data);
    } catch (error) {
      console.error('Error al obtener estudiantes', error);
    }
  };

  const fetchInstitutos = async () => {
    try {
      const response = await axios.get('/api/institutos');
      setInstitutos(response.data);
    } catch (error) {
      console.error('Error al obtener estudiantes', error);
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await axios.get('/api/areas');
      setAreas(response.data);
    } catch (error) {
      console.error('Error al obtener estudiantes', error);
    }
  };

  const fetchBeneficios = async () => {
    try {
      const response = await axios.get('/api/beneficios');
      setBeneficios(response.data);
    } catch (error) {
      console.error('Error al obtener estudiantes', error);
    }
  };

  const fetchDepartamentos = async () => {
    try {
      const response = await axios.get('/api/departamentos');
      setDepartamentos(response.data);
    } catch (error) {
      console.error('Error al obtener estudiantes', error);
    }
  };

  const fetchMunicipios = async (departamentoId) => {
    try {
      const response = await axios.get(`/api/municipios?Id_Departamento=${departamentoId}`);
      setMunicipios(response.data);
    } catch (error) {
      console.error('Error al obtener estudiantes', error);
    }
  };

  const handlePersonaInputChange = (e) => {
    if(e.target.name == 'Id_Departamento'){
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
      if (editId) {
        await axios.put(`/api/estudiantes/${editId}`, { estudianteData, personaData });
        setEditId(null);
      } else {
        await axios.post('/api/estudiantes', { personaData, estudianteData });
      }
      setPersonaData({
        Primer_Nombre: '',
        Segundo_Nombre: '',
        Primer_Apellido: '',
        Segundo_Apellido: '',
        Sexo: '',
        Fecha_Nacimiento: '',
        Lugar_Nacimiento: '',
        Identidad: '',
        Creado_Por: '',
      });
      setEstudianteData({ Id_Beneficio: '', Id_Area: '', Id_Instituto: '', Creado_Por: '' });
      fetchEstudiantes();
    } catch (error) {
      console.error('Error al guardar estudiante y persona', error);
    }
  };

  const handleCancel = () => {
    setPersonaData({
      Primer_Nombre: '',
      Segundo_Nombre: '',
      Primer_Apellido: '',
      Segundo_Apellido: '',
      Sexo: '',
      Fecha_Nacimiento: '',
      Lugar_Nacimiento: '',
      Identidad: '',
      Creado_Por: '',
    });

    setEstudianteData({ Id_Beneficio: '', Id_Area: '', Id_Instituto: '', Creado_Por: '' });
  }

  const handleEdit = (estudiante) => {
    setEditId(estudiante.Id_Estudiante);
    setEstudianteData({
      Id_Beneficio: estudiante.Id_Beneficio,
      Id_Area: estudiante.Id_Area,
      Id_Instituto: estudiante.Id_Instituto,
      Creado_Por: estudiante.Creado_Por,
    });

    setEditPersonaId(estudiante.Persona.Id_Persona);
    setPersonaData(estudiante.Persona);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/estudiantes/${id}`);
      fetchEstudiantes();
    } catch (error) {
      console.error('Error al eliminar estudiante', error);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtrar los estudiantes basados en el término de búsqueda
  // const filteredEstudiantes = estudiantes.filter(estudiante =>
  //   `${estudiante.Persona?.Primer_Nombre} ${estudiante.Persona?.Primer_Apellido}`
  //     .toLowerCase()
  //     .includes(searchTerm.toLowerCase())
  // );
  // const filteredEstudiantes = estudiantes.filter(estudiante =>
  //   `${estudiante.Persona?.Primer_Nombre} ${estudiante.Persona?.Segundo_Nombre || ''} ${estudiante.Persona?.Primer_Apellido} ${estudiante.Persona?.Segundo_Apellido || ''} ${estudiante.Persona?.Identidad} ${estudiante.Persona?.Lugar_Nacimiento} ${estudiante.Instituto?.Nombre_Instituto} ${estudiante.Area?.Nombre_Area} ${estudiante.Beneficio?.Nombre_Beneficio} ${estudiante.Persona?.Municipio?.Nombre_Municipio}`
  //     .toLowerCase()
  //     .includes(searchTerm.toLowerCase())
  // );

  const filteredEstudiantes = estudiantes.filter((estudiante) => {
    const fullText = `
      ${estudiante.Persona?.Identidad || ''} 
      ${estudiante.Persona?.Primer_Nombre || ''} 
      ${estudiante.Persona?.Segundo_Nombre || ''} 
      ${estudiante.Persona?.Primer_Apellido || ''} 
      ${estudiante.Persona?.Segundo_Apellido || ''} 
      ${estudiante.Persona?.Sexo || ''} 
      ${estudiante.Persona?.Lugar_Nacimiento || ''} 
      ${estudiante.Instituto?.Nombre_Instituto || ''} 
      ${estudiante.Area?.Nombre_Area || ''} 
      ${estudiante.Beneficio?.Nombre_Beneficio || ''} 
      ${estudiante.Persona?.Municipio?.Nombre_Municipio || ''}
    `;
  
    // Convertir todo el texto a minúsculas y buscar el término de búsqueda
    return fullText.toLowerCase().includes(searchTerm.toLowerCase());
  });
  


  return (
    <Layout>
      <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">Nuevo Registro de Estudiante</h1>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg mb-10">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <input
              type="text"
              name="Primer_Nombre"
              placeholder="Primer Nombre"
              value={personaData.Primer_Nombre}
              onChange={handlePersonaInputChange}
              required
              className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300"
            />
            <input
              type="text"
              name="Segundo_Nombre"
              placeholder="Segundo Nombre"
              value={personaData.Segundo_Nombre}
              onChange={handlePersonaInputChange}
              className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300"
            />
            <input
              type="text"
              name="Primer_Apellido"
              placeholder="Primer Apellido"
              value={personaData.Primer_Apellido}
              onChange={handlePersonaInputChange}
              required
              className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300"
            />
            <input
              type="text"
              name="Segundo_Apellido"
              placeholder="Segundo Apellido"
              value={personaData.Segundo_Apellido}
              onChange={handlePersonaInputChange}
              className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300"
            />
            <select
              name="Sexo"
              value={personaData.Sexo}
              onChange={handlePersonaInputChange}
              className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300"
              required
            >
              <option value="">Sexo</option>
              {sexos.map((sexo) => (
                <option key={sexo.id} value={sexo.id}>
                  {sexo.descripcion}
                </option>
              ))}
            </select>
            <input
              type="date"
              name="Fecha_Nacimiento"
              placeholder="Fecha de Nacimiento"
              value={personaData.Fecha_Nacimiento}
              onChange={handlePersonaInputChange}
              className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300"
            />

            <select
              name="Id_Departamento"
              value={personaData.Id_Departamento}
              onChange={handlePersonaInputChange}
              className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300"
              required
            >
              <option value="">Seleccione un Departamento</option>
              {departamentos.map((departamento) => (
                <option key={departamento.Id_Departamento} value={departamento.Id_Departamento}>
                  {departamento.Nombre_Departamento}
                </option>
              ))}
            </select>

            <select
              name="Id_Municipio"
              value={personaData.Id_Municipio}
              onChange={handlePersonaInputChange}
              className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300"
              required
            >
              <option value="">Seleccione un Municipio</option>
              {municipios.map((municipio) => (
                <option key={municipio.Id_Municipio} value={municipio.Id_Municipio}>
                  {municipio.Nombre_Municipio}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="Identidad"
              placeholder="Número de Identidad"
              value={personaData.Identidad}
              onChange={handlePersonaInputChange}
              required
              className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300"
            />

            <input
              type="text"
              name="Creado_Por"
              placeholder="Creado Por"
              value={personaData.Creado_Por}
              onChange={handlePersonaInputChange}
              required
              className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <select
              name="Id_Beneficio"
              value={estudianteData.Id_Beneficio}
              onChange={handleEstudianteInputChange}
              required
              className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300"
            >
              <option value="">Beneficio</option>
              {beneficios.map((beneficio) => (
                <option key={beneficio.Id_Beneficio} value={beneficio.Id_Beneficio}>
                  {beneficio.Nombre_Beneficio}
                </option>
              ))}
            </select>

            <select
              name="Id_Area"
              value={estudianteData.Id_Area}
              onChange={handleEstudianteInputChange}
              required
              className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300"
            >
              <option value="">Área</option>
              {areas.map((area) => (
                <option key={area.Id_Area} value={area.Id_Area}>
                  {area.Nombre_Area}
                </option>
              ))}
            </select>

            <select
              name="Id_Instituto"
              value={estudianteData.Id_Instituto}
              onChange={handleEstudianteInputChange}
              required
              className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300"
            >
              <option value="">Instituto</option>
              {institutos.map((instituto) => (
                <option key={instituto.Id_Instituto} value={instituto.Id_Instituto}>
                  {instituto.Nombre_Instituto}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white p-3 rounded shadow-md hover:bg-blue-600"
            >
              {editId ? 'Actualizar Estudiante' : 'Registrar Estudiante'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white p-3 rounded shadow-md hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </form>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar estudiante "
            value={searchTerm}
            onChange={handleSearch}
            className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 w-full mb-4"
          />
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="p-3">Nombre</th>
                <th className="p-3">Instituto</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEstudiantes.map((estudiante) => (
                <tr key={estudiante.Id_Estudiante}>
                  <td className="p-3">{`${estudiante.Persona.Primer_Nombre} ${estudiante.Persona.Primer_Apellido}`}</td>
                  <td className="p-3">{estudiante.Instituto.Nombre_Instituto}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleEdit(estudiante)}
                      className="bg-yellow-500 text-white p-2 rounded mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(estudiante.Id_Estudiante)}
                      className="bg-red-500 text-white p-2 rounded"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default EstudiantesCrud;
