import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { ArrowDownCircleIcon, UserPlusIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AuthContext from '../context/AuthContext';
import { ShieldExclamationIcon, TrashIcon } from '@heroicons/react/24/outline';

const TutorPadreManagement = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext); // Usuario logueado
  const [tutores, setTutores] = useState([]);
  const [permisos, setPermisos] = useState(null);
  const [error, setError] = useState(null);
  const [sinPermisos, setSinPermisos] = useState(false);
  const [formData, setFormData] = useState({
    Id_Persona: '',
    Primer_Nombre: '',
    Primer_Apellido: '',
    Municipio: '',
    Departamento: '',
    Tipo_Persona: 2, // Solo tutores/padres (tipo 3)
  });
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState('');
  const [updateNotification, setUpdateNotification] = useState('');
  const [deleteNotification, setDeleteNotification] = useState('');
  const [search, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [tutoresPerPage] = useState(10);

  useEffect(() => {
    fetchTutores();
    fetchPermisos();
  }, []);



  const handleEdit = (data) => {
    console.log("handleEdit")
    console.log(data)
    router.push({
      pathname: '/estudiante', // Ruta de la página destino
      query: {
        tab: 2,
        idEstudiante: data.Id_Estudiante,
        relacionId:data.Id_Relacion
      },
    });
  };

  // Verificación de permisos
  const fetchPermisos = async () => {
    try {
      if (user) {
        const idObjeto = 15; // ID relacionado con tutores (suponiendo que esto corresponde a los tutores)
        const response = await axios.post('/api/api_permiso', {
          idRol: user.rol,
          idObjeto,
        });

        const permisosData = response.data;

        if (
          permisosData.Permiso_Insertar !== '1' &&
          permisosData.Permiso_Actualizar !== '1' &&
          permisosData.Permiso_Eliminar !== '1' &&
          permisosData.Permiso_Consultar !== '1'
        ) {
          setSinPermisos(true);
        } else {
          setPermisos(permisosData);
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al obtener permisos');
    }
  };

  const fetchTutores = async () => {
    try {
      const response = await axios.get('/api/tutorpadre');
      if (response.data && Array.isArray(response.data)) {
        setTutores(response.data);
      } else {
        throw new Error('Datos no válidos recibidos');
      }
    } catch (error) {
      console.error('Error fetching tutores:', error);
      setError('Hubo un problema al obtener los tutores');
    }
  };

  // Funciones para obtener el nombre (esto depende de cómo tengas la información)
  const getMunicipioNameById = (municipioId) => {
    // Implementar lógica para obtener el nombre del municipio según el ID
    return 'Nombre Municipio';
  };
  
  const getDepartamentoNameById = (departamentoId) => {
    // Implementar lógica para obtener el nombre del departamento según el ID
    return 'Nombre Departamento';
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const response = await fetch(`/api/tutorpadre`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar el tutor');
        }

        setUpdateNotification('Tutor actualizado exitosamente');
        setTimeout(() => {
          setUpdateNotification('');
        }, 3000);
      } else {
        const response = await fetch('/api/tutorpadre', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Error al agregar el tutor');
        }

        setNotification('Tutor agregado exitosamente');
        setTimeout(() => {
          setNotification('');
        }, 3000);
      }

      fetchTutores();
      resetForm();
    } catch (error) {
      console.error('Error al guardar el tutor:', error);
    }
  };

  // const handleEdit = (tutor) => {
  //   setFormData(tutor);
  //   setIsEditing(true);
  // };

  const handleDelete = async (Id_Persona) => {
    try {
      const response = await fetch('/api/tutorpadre', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Id_Persona }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el tutor');
      }

      fetchTutores();
      resetForm();
      setDeleteNotification('Tutor eliminado exitosamente');
      setTimeout(() => {
        setDeleteNotification('');
      }, 3000);
    } catch (error) {
      console.error('Error al eliminar el tutor:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      Id_Persona: '',
      Nombre: '',
      Apellido: '',
      Municipio: '',
      Departamento: '',
      Tipo_Persona: 3, // Solo tutores/padres (tipo 3)
    });
    setIsEditing(false);
  };

  const filteredTutores = tutores.filter((tutor) => {
    const searchLower = search.toLowerCase();
    return (
      (tutor.Identidad && String(tutor.Identidad).toLowerCase().includes(searchLower)) ||
      (tutor.Persona_Nombre && String(tutor.Persona_Nombre).toLowerCase().includes(searchLower)) ||
      (tutor.Persona_Apellido && String(tutor.Persona_Apellido).toLowerCase().includes(searchLower)) ||
      (tutor.Persona_Telefono && String(tutor.Persona_Telefono).toLowerCase().includes(searchLower)) ||
      (tutor.Persona_Direccion && String(tutor.Persona_Direccion).toLowerCase().includes(searchLower)) ||
      (tutor.Estudiante_Nombre && String(tutor.Estudiante_Nombre).toLowerCase().includes(searchLower)) ||
      (tutor.Estudiante_Apellido && String(tutor.Estudiante_Apellido).toLowerCase().includes(searchLower))
    );
  });
  
  

  // Paginación
  const indexOfLastTutor = currentPage * tutoresPerPage;
  const indexOfFirstTutor = indexOfLastTutor - tutoresPerPage;
  const currentTutores = filteredTutores.slice(indexOfFirstTutor, indexOfLastTutor);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredTutores.length / tutoresPerPage);

  const handleExport = () => {
    const transformedTutores = tutores.map((tutor) => ({
      Identidad: tutor.Identidad,
      Nombre: `${tutor.Primer_Nombre} ${tutor.Primer_Apellido}`,
      Sexo: tutor.Sexo === 1 ? 'Masculino' : 'Femenino',
      telefono: `${tutor.telefono}`,
      direccion: `${tutor.direccion}`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(transformedTutores);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tutores');
    XLSX.writeFile(workbook, 'tutores.xlsx');
  };


  if (!user) {
    return <p>Cargando usuario...</p>;
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-lg">
        <h3>Error al cargar los tutores:</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (sinPermisos) {
    return (
      <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-lg flex items-center">
        <ShieldExclamationIcon className="h-12 w-12 mr-4" />
        <div>
          <h3 className="font-bold text-lg">Sin permisos para acceder a los tutores</h3>
          <p>No tienes permisos para acceder a esta información.</p>
        </div>
      </div>
    );
  }

  if (!permisos) {
    return <p>Cargando permisos...</p>;
  }

  return (
    <div className="w-full lg:w-2/3 p-6 rounded-lg">
      <center>
        <h2 className="text-2xl font-semibold mb-4">Listado Tutores</h2>
      </center>

      {/* Barra de búsqueda */}
      <div className="w-2/2">
        <div>
          <center>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-3 pl-10 pr-4 border border-gray-900 rounded-lg w-1/2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Buscar..."
            />
          </center>
        </div>
      </div>
      <br />
      {/* Botón para exportar */}
      <div className="mb-4 flex justify-between items-center">
        {/* Botón para agregar tutor
        {permisos.Permiso_Insertar === '1' && (
          <Link href="/agregarTutor">
            <button className="flex items-center bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700">
              <UserPlusIcon className="w-6 h-6 mr-2" />
              <span>Agregar Tutor</span>
            </button>
          </Link>
        )} */}
        {/* Botón para exportar */}
        <button onClick={handleExport} className="flex items-center bg-green-600 text-white rounded-lg p-2 hover:bg-green-700">
          <ArrowDownCircleIcon className="w-6 h-6 mr-2" />
          <span>Exportar a Excel</span>
        </button>
      </div>

      {/* Mensajes de notificación */}
      {notification && <div className="text-green-600">{notification}</div>}
      {updateNotification && <div className="text-yellow-600">{updateNotification}</div>}
      {deleteNotification && <div className="text-red-600">{deleteNotification}</div>}

{/* Tabla de tutores */}
<div className="overflow-x-auto border-t border-b mb-4">

<table className="min-w-full border-collapse">
<thead>
<tr className="bg-blue-200 text-black uppercase text-sm font-semibold">
        <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">Identidad</th>
        <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">Nombre y Apellido</th>
        <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">Sexo</th>
        <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">Telefono</th>
        <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">Direccion</th>
        <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">Identidad E.</th>
        <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">Estudiante</th>
        <th className="py-4 px-6 bg-blue-200 text-blue-800 font-semibold text-left">Acciones</th>
      </tr>
    </thead>
    <tbody>
      {tutores && tutores.length > 0 ? (
        filteredTutores.map(Benefactor => (
          <tr key={Benefactor.Id_Persona}>
            <td className="border px-4 py-2">{Benefactor.Identidad}</td>
           <td className="border px-4 py-2">{Benefactor.Persona_Nombre} {Benefactor.Persona_Apellido}</td>
           <td className="border px-4 py-2">
  {Benefactor.Sexo === 1
    ? 'Masculino'
    : Benefactor.Sexo === 0
    ? 'Femenino'
    : 'Desconocido'}
</td>
<td className="border px-4 py-2">{Benefactor.Persona_Telefono}</td>
<td className="border px-4 py-2">{Benefactor.Persona_Direccion}</td>
<td className="border px-4 py-2">{Benefactor.Estudiante_Identidad}</td>
<td className="2 ">{Benefactor.Estudiante_Nombre}{""} {Benefactor.Estudiante_Apellido}</td>
<td className='xls_center'>

{permisos.Permiso_Actualizar === "1" && (
    <button
      onClick={() => handleEdit(Benefactor)}


      
      className="px-1 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
    >
      <PencilSquareIcon className="h-6 w-6" />
    </button>
  )}
</td>
              

          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="8">No hay Benefactores disponibles</td>
        </tr>
      )}
    </tbody>
  </table>



</div>

{/* Paginación */}
<div className="flex justify-between items-center mt-4">
  {/* Botón "Anterior" */}
  <button
    onClick={() => paginate(currentPage - 1)}
    disabled={currentPage === 1}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 transform ${
      currentPage === 1
        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
        : 'bg-white-600 text-black shadow-md hover:bg-gray-200 focus:outline-none'
    }`}
  >
    Anterior
  </button>

  {/* Páginas */}
  <div className="flex space-x-2">
    {Array.from({ length: totalPages }, (_, index) => (
      <button
        key={index + 1}
        onClick={() => paginate(index + 1)}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 transform ${
          currentPage === index + 1
            ? 'bg-white-600 text-black shadow-lg scale-105'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none'
        }`}
      >
        {index + 1}
      </button>
    ))}
  </div>

  {/* Botón "Siguiente" */}
  <button
    onClick={() => paginate(currentPage + 1)}
    disabled={currentPage === totalPages}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 transform ${
      currentPage === totalPages
        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
        : 'bg-white-600 text-black shadow-md hover:bg-gray-200 focus:outline-none'
    }`}
  >
    Siguiente
  </button>
</div>

    </div>
  );
};

export default TutorPadreManagement;
