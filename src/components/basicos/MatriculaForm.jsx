// ✅ CÓDIGO REFACTORIZADO PARA MATRÍCULA MANAGEMENT USANDO COMPONENTE

import React, { useState, useEffect,useCallback } from 'react';
import { obtenerEstados } from '../../../src/utils/api';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { validarFormulario } from "../../utils/validaciones";

import {  reglasValidacionMatricula} from "../../../models/ReglasValidacionModelos";


const MatriculaForm = ({ formData, isEditing, setIsEditing, onClose, fetchMatriculas,estudianteId, Usuario }) => {
  const [form, setForm] = useState({
    Estudiante: '',
    Modalidad: '',
    Grado: '',
    Seccion: '',
    Fecha_Matricula: '',
    Estado: ''
  });

  const [estudiantes, setEstudiantes] = useState([]);
  const [modalidades, setModalidades] = useState([]);
  const [grados, setGrados] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(true);  // Estado de carga
  const [filteredSecciones, setFilteredSecciones] = useState([]);  // Secciones filtradas por grado

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);  // Inicia el estado de carga
      try {
        fetchEstudiantes();
        fetchModalidades();
        fetchGrados();
        fetchSecciones();
        cargarEstados();
      } catch (error) {
        toast.error('Error al cargar los datos');
      } finally {
        setLoading(false);  // Termina la carga
      }
    };

    if (formData) {
      setForm({
        Estudiante: formData.Estudiante || '',
        Modalidad: formData.Modalidad || '',
        Grado: formData.Grado || '',
        Seccion: formData.Seccion || '',
        Fecha_Matricula: formData.Fecha_Matricula || '',
        Estado: formData.Estado || ''
      });
    }

    loadData();  // Llamar a la función que obtiene los datos
  }, [formData]); // Dependencia de formData para asegurarnos que se ejecute cada vez que cambie
 // Ejecutará cada vez que formData cambie
  




  const fetchEstudiantes = async () => {
    const res = await fetch('/api/estudiantes');
    const data = await res.json();
    setEstudiantes(data);
  };

  const fetchModalidades = async () => {
    const res = await fetch('/api/modalidades');
    const data = await res.json();
    setModalidades(data);
  };

  const fetchGrados = async () => {
    const res = await fetch('/api/grado');
    const data = await res.json();
    setGrados(data);
  };

  const fetchSecciones = async () => {
    const res = await fetch('/api/seccion');
    const data = await res.json();
    setSecciones(data);
  };


  useEffect(() => {
    if (form.Id_Grado) {
      const seccionesFiltradas = secciones.filter(
        seccion => seccion.Id_Grado === Number( form.Id_Grado)
      );
      setFilteredSecciones(seccionesFiltradas);
      
      // Resetear la sección seleccionada si no es compatible
      if (form.Id_Seccion && !seccionesFiltradas.some(s => s.Id_Seccion === form.Id_Seccion)) {
        setForm(prev => ({ ...prev, Id_Seccion: '' }));
      }
    } else {
      setFilteredSecciones([]);
    }
  }, [form.Id_Grado, secciones]);

//   const fetchEstados = async () => {
//     const res = await fetch('/api/estados?tipo=GENÉRICO');
//     const data = await res.json();
//     console.log("Estados recibidos:", data); // Verifica aquí
//     if (Array.isArray(data)) {
//       setEstados(data);
//     } else {
//       setEstados([]);
//       console.warn("La respuesta de estados no es un array:", data);
//     }
//   };

    
    const cargarEstados = useCallback(async () => {
    //  setLoading(true);
      const data = await obtenerEstados("GENÉRICO");
      setEstados(data);
    //  setLoading(false);
  }, []); // 🔥 Se ejecu
  
  
  useEffect(() => {
    if (estudianteId) {
      const estudiante = estudiantes.find(e => e.Id_Estudiante === estudianteId);
      if (estudiante) {
        setForm({
          ...form,
          Id_Estudiante: estudianteId,
          Estudiante: `${estudiante.Persona?.Identidad} - ${estudiante.Persona?.Primer_Nombre} ${estudiante.Persona?.Primer_Apellido}`
        });
      }
    } else if (formData) {
      setForm(formData);
    }
  }, [estudianteId, formData, estudiantes]);



  // useEffect(() => {
  //   console.log("Form ID Grado:", form.Id_Grado); // Verifica aquí
  //   if (form.Id_Grado) {
  //     const seccionesFiltradas = secciones.filter(seccion => seccion.Id_Grado === form.Id_Grado);
  //     setFilteredSecciones(seccionesFiltradas);
  //   } else {
  //     setFilteredSecciones([]);
  //   }
  // }, [form.Id_Grado, secciones]); // Este effect se ejecutará cuando form.Id_Grado cambie




  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    form.Creado_Por=Usuario;
    form.Modificado_Por=Usuario;

    form.Estado=Number(form.Estado);


 const errores2 = validarFormulario(form, reglasValidacionMatricula,"matriculaForm");
 if (errores2.length > 0) {
  return ;
 }

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = '/api/matriculas';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Error al guardar matrícula');
      fetchMatriculas();
      setForm({ Estudiante: '', Modalidad: '', Grado: '', Seccion: '', Fecha_Matricula: '', Estado: '' });
      setIsEditing(false);
      onClose();
      toast.success( (isEditing ? 'Matrícula actualizada' : 'Matrícula creada'), {
        position: 'top-right',
        autoClose: 4000,
      });
    } catch (error) {
      toast.error(error.message || 'Error al procesar la matrícula', {
        position: 'top-right',
        autoClose: 5000,
      });
    }
  };

 // Si el estado de carga es true, muestra el mensaje o spinner
 if (loading) {
  return <div>Cargando datos...</div>; // Aquí puedes poner un spinner o un mensaje de carga
}


  return (
    <form onSubmit={handleSubmit} className="space-y-4" id='matriculaForm'>

<div className="flex flex-col">
  <label htmlFor="Estudiante" className="text-gray-700">Estudiante</label>
  {(isEditing||estudianteId) ? (
    <div className="w-full border p-2 rounded bg-gray-100 text-gray-700">
      {
        (() => {
          const estudiante = estudiantes.find(e =>( e.Id_Estudiante === form.Id_Estudiante) || (e.Id_Estudiante ==estudianteId));
          return estudiante
            ? `${estudiante.Persona?.Identidad} - ${estudiante.Persona?.Primer_Nombre} ${estudiante.Persona?.Primer_Apellido}`
            : 'Estudiante no encontrado';
        })()
      }
    </div>
  ) : (
    <select
      name="Id_Estudiante"
      value={form.Id_Estudiante}
      onChange={handleChange}
      className="w-full border p-2 rounded"
      required
    >
      <option value="">Seleccione un estudiante</option>
      {estudiantes.map(e => (
        <option key={e.Id_Estudiante} value={e.Id_Estudiante}>
          {`${e.Persona?.Identidad} - ${e.Persona?.Primer_Nombre} ${e.Persona?.Primer_Apellido}`}
        </option>
      ))}
    </select>
  )}
</div>

      <div className="flex flex-col">
        <label htmlFor="Id_Modalidad" className="text-gray-700">Modalidad</label>
        <select name="Id_Modalidad" value={form.Id_Modalidad} onChange={handleChange} className="w-full border p-2 rounded" required>
          <option value="">Seleccione Modalidad</option>
          {modalidades.map(m => <option key={m.Id_Modalidad} value={m.Id_Modalidad}>{m.Nombre}</option>)}
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="GraId_Gradodo" className="text-gray-700">Curso/Grado</label>
        <select name="Id_Grado" value={form.Id_Grado} onChange={handleChange} className="w-full border p-2 rounded" required>
          <option value="">Seleccione Grado</option>
          {grados.map(g => <option key={g.Id_Grado} value={g.Id_Grado}>{g.Nombre}</option>)}
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="Id_Seccion" className="text-gray-700">Sección</label>
        <select name="Id_Seccion" value={form.Id_Seccion} onChange={handleChange} className="w-full border p-2 rounded" required>
          <option value="">Seleccione Sección</option>
          {filteredSecciones.map(s => <option key={s.Id_Seccion} value={s.Id_Seccion}>{s.Nombre_Seccion}</option>)}
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="Fecha_Matricula" className="text-gray-700">Fecha Matrícula</label>
        <input type="date" required name="Fecha_Matricula" value={form.Fecha_Matricula} onChange={handleChange} className="w-full border p-2 rounded"  />
      </div>

      <div className="flex flex-col">
        <label htmlFor="Estado" className="text-gray-700">Estado</label>
        <select name="Estado" value={form.Estado} onChange={handleChange} className="w-full border p-2 rounded" required>
          <option value="">Seleccione Estado</option>
          {estados.map(e => <option key={e.Codigo_Estado} value={e.Codigo_Estado}>{e.Nombre_Estado}</option>)}
        </select>
      </div>

      <div className="flex justify-end space-x-4">
        <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSubmit} >{isEditing ? 'Actualizar' : 'Guardar'}</button>
        <button type="button" className="bg-red-600 text-white px-4 py-2 rounded" onClick={onClose}>Cancelar</button>
      </div>
    </form>
  );
};

export default MatriculaForm;