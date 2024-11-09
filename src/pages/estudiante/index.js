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

  return (
    <Layout>
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">Nuevo Registro de Estudiante</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg mb-10">
        {/* <h3 className="text-2xl font-semibold mb-6 text-blue-600">Datos de Persona</h3> */}
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
            name="Lugar_Nacimiento"
            placeholder="Lugar de Nacimiento"
            value={personaData.Lugar_Nacimiento}
            onChange={handlePersonaInputChange}
            className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="text"
            name="Identidad"
            placeholder="Identidad"
            value={personaData.Identidad}
            onChange={handlePersonaInputChange}
            className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* <h3 className="text-2xl font-semibold mb-6 text-blue-600">Datos de Estudiante</h3> */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <select
              name="Id_Beneficio"
              value={estudianteData.Id_Beneficio}
              onChange={handleEstudianteInputChange}
              className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300"
              required
            >
              <option value="">Seleccione un Beneficio</option>
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
              className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300"
              required
            >
              <option value="">Seleccione un Área</option>
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
              className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300"
              required
            >
              <option value="">Seleccione un Instituto</option>
              {institutos.map((instituto) => (
                <option key={instituto.Id_Instituto} value={instituto.Id_Instituto}>
                  {instituto.Nombre_Instituto}
                </option>
              ))}
            </select>
          {/* <input
            type="text"
            name="Creado_Por"
            placeholder="Creado Por"
            value={estudianteData.Creado_Por}
            onChange={handleEstudianteInputChange}
            required
            className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300"
          /> */}
        </div>

        <button type="submit" className="w-1/4 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors mr-4">
          {editId ? 'Actualizar' : 'Agregar'}
        </button>

        <button  type="button" onClick={() => handleCancel()} className="w-1/4 bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition-colors">Cancelar</button>
        
      </form>

      <table className="min-w-full bg-white shadow-lg rounded-lg mb-6">
        <thead>
          <tr>
            <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">ID</th>
            <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">Identidad</th>
            <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">Nombre</th>
            <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">Sexo</th>
            <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">Lugar Nacimiento</th>
            <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map((estudiante) => (
            <tr key={estudiante.Id_Estudiante} className="hover:bg-blue-50">
              <td className="py-4 px-6 border-b">{estudiante.Id_Estudiante}</td>
              <td className="py-4 px-6 border-b">{estudiante.Persona?.Identidad}</td>
              <td className="py-4 px-6 border-b">
                {`${estudiante.Persona?.Primer_Nombre || ''} ${estudiante.Persona?.Primer_Apellido || ''}`}
              </td>
              <td className="py-4 px-6 border-b">{estudiante.Persona?.Sexo === '1' ? 'Masculino' : 'Femenino'}</td>
              <td className="py-4 px-6 border-b">{estudiante.Persona?.Lugar_Nacimiento}</td>
              <td className="py-4 px-6 border-b">
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(estudiante)} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(estudiante.Id_Estudiante)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>  
    </Layout>
  );

};

export default EstudiantesCrud;
