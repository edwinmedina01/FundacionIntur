// ✅ CÓDIGO REFACTORIZADO PARA MATRÍCULA MANAGEMENT USANDO COMPONENTE

import React, { useState, useEffect,useCallback } from 'react';
import { obtenerEstados } from '../../../src/utils/api';
import Select from 'react-select';
import { toast } from 'react-toastify';

const MatriculaForm = ({ formData, isEditing, setIsEditing, onClose, fetchMatriculas }) => {
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

  useEffect(() => {
    if (formData) setForm(formData);
    fetchEstudiantes();
    fetchModalidades();
    fetchGrados();
    fetchSecciones();
    cargarEstados();
  }, [formData]);

  const fetchEstudiantes = async () => {
    const res = await fetch('/api/estudiantes');
    const data = await res.json();
    setEstudiantes(data);
  };

  const fetchModalidades = async () => {
    const res = await fetch('/api/apis_mantenimientos/modalidades');
    const data = await res.json();
    setModalidades(data);
  };

  const fetchGrados = async () => {
    const res = await fetch('/api/apis_mantenimientos/grado');
    const data = await res.json();
    setGrados(data);
  };

  const fetchSecciones = async () => {
    const res = await fetch('/api/apis_mantenimientos/seccion');
    const data = await res.json();
    setSecciones(data);
  };



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
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

<div className="flex flex-col">
  <label htmlFor="Estudiante" className="text-gray-700">Estudiante</label>
  {isEditing ? (
    <div className="w-full border p-2 rounded bg-gray-100 text-gray-700">
      {
        (() => {
          const estudiante = estudiantes.find(e => e.Id_Estudiante === form.Id_Estudiante);
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
          {secciones.map(s => <option key={s.Id_Seccion} value={s.Id_Seccion}>{s.Nombre_Seccion}</option>)}
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="Fecha_Matricula" className="text-gray-700">Fecha Matrícula</label>
        <input type="date" name="Fecha_Matricula" value={form.Fecha_Matricula} onChange={handleChange} className="w-full border p-2 rounded" required />
      </div>

      <div className="flex flex-col">
        <label htmlFor="Estado" className="text-gray-700">Estado</label>
        <select name="Estado" value={form.Estado} onChange={handleChange} className="w-full border p-2 rounded" required>
          <option value="">Seleccione Estado</option>
          {estados.map(e => <option key={e.Codigo_Estado} value={e.Codigo_Estado}>{e.Nombre_Estado}</option>)}
        </select>
      </div>

      <div className="flex justify-end space-x-4">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{isEditing ? 'Actualizar' : 'Guardar'}</button>
        <button type="button" className="bg-gray-300 text-black px-4 py-2 rounded" onClick={onClose}>Cancelar</button>
      </div>
    </form>
  );
};

export default MatriculaForm;