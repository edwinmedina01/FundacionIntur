import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { MagnifyingGlassIcon,ArrowDownCircleIcon, UserPlusIcon, PencilSquareIcon,TrashIcon  } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AuthContext from '../context/AuthContext';

import Select from "react-select";


const GraduandoForm = ({ estudiante }) => {
  const [graduandos, setGraduandos] = useState([]);
  const [formData, setFormData] = useState({
    Anio: '',
    Fecha_Inicio: '',
    Fecha_Final: '',
    Creado_Por: '',
    Estudiante: null,
    Id_Estudiante:null
  });
  
          // ------------------- FUNCIONALIDAD ROLES----------------------//
          const { user } = useContext(AuthContext); // Usuario logueado
          const [permisos, setPermisos] = useState(null); //obtener permiso
          const [error, setError] = useState(null); //mostrar error de permiso
          const [sinPermisos, setSinPermisos] = useState(false); //mostrar que no tiene permiso
        // ------------------------------------------------------------//
        const [estudiantes, setEstudiantes] = useState([]);
        const [isEditing, setIsEditing] = useState(false);
        const [notification, setNotification] = useState('');
        const [updateNotification, setUpdateNotification] = useState('');
        const [deleteNotification, setDeleteNotification] = useState('');
        const resetForm = () => {
          setFormData({ 

            Anio: '',
            Fecha_Inicio: '',
            Fecha_Final: '',
            Creado_Por: '',
            Estudiante: null,
            Id_Estudiante:null

          });
          setIsEditing(false);
        };
        const [searchTerm, setSearchTerm] = useState("");
        


  useEffect(() => {

    if (estudiante) {
      setFormData((prev) => ({
        ...prev,
        Estudiante: estudiante, // Objeto completo del estudiante
        Id_Estudiante: estudiante.Id_Estudiante, // ID del estudiante
      }));
    }
 
    fetchPermisos();
    fetchGraduandos();
   //fetchEstudiantes();

  }, [user,estudiante]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };


  const fetchPermisos = async () => {
    try {
      if (user) {
        const idObjeto = 14; // ID relacionado con matriculas
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



  const exportToExcel = () => {
    // Crear un array de objetos para representar las filas del Excel

    const data = graduandos.map((graduando) => ({
      "ID Graduando": graduando.Id_Graduando,
      "Identidad Estudiante": graduando.Estudiante.Persona.Identidad,
      "Nombre Completo Estudiante":
        graduando.Estudiante.Persona.Primer_Nombre +
        " " +
        graduando.Estudiante.Persona.Primer_Apellido,
      Año: graduando.Anio,
      "Fecha de Inicio": graduando.Fecha_Inicio,
      "Fecha de Finalización": graduando.Fecha_Final,
      "Fecha de Creación": graduando.Fecha_Creacion,
    }));
  
    // Crear el workbook y la hoja de trabajo
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Graduandos");
  
    // Generar archivo Excel
    XLSX.writeFile(workbook, "Graduandos.xlsx");
  };
  

  const fetchGraduandos = async () => {
    try {

    
      const response = await axios.get('/api/graduando');
      const graduandos = response.data; // Usa los datos directamente
      setGraduandos(response.data);

      const graduandoRelacionado = graduandos.find(
        (graduando) => graduando.Id_Estudiante === estudiante.Id_Estudiante
      );

      let data =graduandoRelacionado;
      if (graduandoRelacionado) {
        setFormData({
          Id_Graduando:data.Id_Graduando,
          Anio: data.Anio,
          Fecha_Inicio: data.Fecha_Inicio,
          Fecha_Final: data.Fecha_Final,
          Creado_Por: data.Creado_Por,
          Estudiante: estudiante, 
          Id_Estudiante:estudiante.Id_Estudiante// Objeto esperado por el Select
        });
        setIsEditing(true)
      }

      
    } catch (error) {
      console.error('Error al obtener los graduandos:', error);
    }
  };


  const options = estudiantes.map((estudiante) => ({
    value: estudiante.Id_Estudiante,
    label: `${estudiante.Persona.Identidad} - ${estudiante.Persona.Primer_Nombre} ${estudiante.Persona.Primer_Apellido}`,
    estudiante,
  }));


  const handleSelectChange = (selectedOption) => {
    setFormData({ ...formData, Estudiante: selectedOption.Estudiante,Id_Estudiante:selectedOption.estudiante.Id_Estudiante });
  };
  const fetchEstudiantes = async () => {
    try {
      const response = await axios.get("/api/estudiantes");
      setEstudiantes(response.data);

       // Si hay un estudiante seleccionado, actualizarlo
    if (selectedStudent) {
      const updatedStudent = response.data.find(
        (e) => e.Id_Estudiante === selectedStudent.Id_Estudiante
      );
      setSelectedStudent(updatedStudent || null); // Actualizar el seleccionado o limpiar si no existe
  
      handleEdit(updatedStudent || null); // Actualizar el seleccionado o limpiar si no existe
    }
      console.log(response.data)
    } catch (error) {
      console.error("Error al obtener estudiantes", error);
    }
  };

  const filteredEstudiantes = estudiantes.filter((estudiante) =>
    `${estudiante.Persona.Primer_Nombre} ${estudiante.Persona.Primer_Apellido} ${estudiante.Persona.Identidad}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Manejar los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDelete = async (Id_Graduando) => {
    try {
      const response = await fetch(`/api/graduando/${Id_Graduando}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Id_Graduando }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la graduando');
      }

      fetchGraduandos();
      resetForm();
      setDeleteNotification('graduando eliminado exitosamente');
      setTimeout(() => {
        setDeleteNotification('');
      }, 3000);
    } catch (error) {
      console.error('Error al eliminar la graduando:', error);
    }
  };



  // Enviar datos del formulario para crear un nuevo graduando
  const handleSubmit = async (e) => {
    e.preventDefault();


    try {


      if (!isEditing){

        await axios.post('/api/graduando', formData);
        
        setUpdateNotification('graduando agregado exitosamente');
        setTimeout(() => {
          setUpdateNotification('');
        }, 3000);
      }else{
        await axios.put(`/api/graduando/${formData.Id_Graduando}`, formData);

        
        setUpdateNotification('graduando actualizado exitosamente');
        setTimeout(() => {
          setUpdateNotification('');
        }, 3000);
      }
 
   //   resetForm();
      // Recargar los graduandos después de agregar uno nuevo
      const response = await axios.get('/api/graduando');

     // setGraduandos(response.data);
    } catch (error) {
      console.error('Error al crear un graduando:', error);
    }
  };

  // Función para exportar los datos de graduandos a Excel
  const exportToExcelold = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(graduandos);
    XLSX.utils.book_append_sheet(wb, ws, 'Graduandos');
    XLSX.writeFile(wb, 'graduandos.xlsx');
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (data) => {

    const estudianteSeleccionado = options.find(
      (option) => option.value === data.Id_Estudiante
    );

    setFormData({
      Id_Graduando:data.Id_Graduando,
      Anio: data.Anio,
      Fecha_Inicio: data.Fecha_Inicio,
      Fecha_Final: data.Fecha_Final,
      Creado_Por: data.Creado_Por,
      Estudiante: estudianteSeleccionado, // Objeto esperado por el Select
    });

    setIsEditing(true);
  };

  if (sinPermisos) {
    return         <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-lg flex items-center">
    <ShieldExclamationIcon className="h-12 w-12 mr-4" />
    <div>
      <h3 className="font-bold text-lg">
        Sin permisos para Acceder a la Pantalla de Grados
      </h3>
      <p>No tienes permisos para Acceder a la información.</p>
    </div>
  </div>
  }
  
  if (!permisos) {
    return <p>Cargando permisos...</p>;

  }

  const filteredGraduandosold = graduandos.filter((graduando) => {
    const fullName = `${graduando.Estudiante.Persona.Primer_Nombre}  ${graduando.Estudiante.Persona.Primer_Apellido}`.toLowerCase();
    const identidad = graduando.Estudiante.Persona.Identidad.toLowerCase();

    return (
      fullName.includes(searchTerm) || identidad.includes(searchTerm)
    );
  });

  const filteredGraduandos = graduandos.filter((graduando) => {
    // Convierte el objeto `graduando` en una cadena JSON para buscar en todas las propiedades
    const allProperties = JSON.stringify(graduando).toLowerCase();
  
    // Retorna true si el término de búsqueda está en alguna propiedad
    return allProperties.includes(searchTerm.toLowerCase());
  });



  return (
    <div>

      <h2 className="text-2xl font-bold text-gray-700 mb-4">Graduación</h2>

      <form onSubmit={handleSubmit}>


      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Nombre Completo
        </label>
        <input
  type="text"
  name="NombreCompleto"
  value={
    `${formData.Estudiante?.Persona?.Primer_Nombre || "Sin Nombre"} ${formData.Estudiante?.Persona?.Segundo_Nombre || ""} ${formData.Estudiante?.Persona?.Primer_Apellido || ""} ${formData.Estudiante?.Persona?.Segundo_Apellido || ""}`.trim()
  }
  readOnly
  className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
/>
      </div>
      <div>
        <label htmlFor="Anio" className="block mb-2 text-sm font-medium text-gray-700">
          Año:
        </label>
        <input
          type="number"
          name="Anio"
          value={formData.Anio}
          onChange={handleChange}
          required
          className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ingrese el año"
        />
      </div>

      <div>
        <label htmlFor="Fecha_Inicio" className="block mb-2 text-sm font-medium text-gray-700">
          Fecha de Inicio:
        </label>
        <input
          type="date"
          name="Fecha_Inicio"
          value={formData.Fecha_Inicio}
          onChange={handleChange}
          required
          className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="Fecha_Final" className="block mb-2 text-sm font-medium text-gray-700">
          Fecha de Finalización:
        </label>
        <input
          type="date"
          name="Fecha_Final"
          value={formData.Fecha_Final}
          onChange={handleChange}
          className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
<br></br>

<div className="flex justify-end">
  {isEditing
    ? // Mostrar botón "Actualizar" solo si tiene permisos de actualización
      permisos.Permiso_Actualizar === "1" && (
        <button
        onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Actualizar
        </button>
      )
    : // Mostrar botón "Agregar" solo si tiene permisos de inserción
      permisos.Permiso_Insertar === "1" && (
        <button
        onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Agregar
        </button>
      )}

  <button
    type="button"
    onClick={resetForm}
    className="ml-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
  >
    Cancelar
  </button>
</div>
        </form>

        {notification && <div className="mt-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">{notification}</div>}
        {updateNotification && <div className="mt-4 p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700">{updateNotification}</div>}
        {deleteNotification && <div className="mt-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">{deleteNotification}</div>}
  
    </div>
  );
}; 

export default GraduandoForm;
