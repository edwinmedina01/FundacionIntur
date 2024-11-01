import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManejoObjetos = () => {
  const [objetos, setObjetos] = useState([]);
  const [formData, setFormData] = useState({
    Id_Objeto: '',
    Objeto: '',
    Descripcion: '',
    Tipo_Objeto: '',
    Estado: '', // Estado predeterminado a activo
  });
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    fetchObjetos();
  }, []);

  const fetchObjetos = async () => {
    try {
      const response = await axios.get('/api/objetos'); // Endpoint para obtener objetos
      setObjetos(response.data);
    } catch (error) {
      console.error('Error al obtener los objetos:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestData = {
        ...formData,
      };

      const response = await fetch('/api/objetos', {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`Error al ${isEditing ? 'actualizar' : 'crear'} el objeto`);
      }

      setNotification(`Objeto ${isEditing ? 'actualizado' : 'agregado'} exitosamente`);
      setTimeout(() => setNotification(''), 3000);

      fetchObjetos();
      resetForm();
    } catch (error) {
      console.error('Error al guardar el objeto:', error);
    }
  };

  const handleEdit = (objeto) => {
    setFormData({
      Id_Objeto: objeto.Id_Objeto,
      Objeto: objeto.Objeto,
      Descripcion: objeto.Descripcion,
      Tipo_Objeto: objeto.Tipo_Objeto,
      Estado: objeto.Estado,
    });
    setIsEditing(true);
  };

  const handleDelete = async (Id_Objeto) => {
    try {
      const response = await fetch('/api/objetos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Id_Objeto }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el objeto');
      }

      fetchObjetos();
      resetForm();
      setNotification('Objeto eliminado exitosamente');
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      console.error('Error al eliminar el objeto:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      Id_Objeto: '',
      Objeto: '',
      Descripcion: '',
      Tipo_Objeto: '',
      Estado: '', // Reiniciar el estado a activo
    });
    setIsEditing(false);
  };

  return (
    <div className="p-8 mt-4 bg-gray-100 flex space-x-8">
      {/* Columna izquierda: Formulario */}
      <div className="w-1/3 bg-white p-6 rounded-lg shadow-md">
        <center>
          <h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Editar Objeto' : 'Agregar Objeto'}</h2>
        </center>
        <form onSubmit={handleSubmit}>
          {/* Input de Objeto */}
          <label className="block mb-2 text-sm font-medium text-gray-700">Objeto</label>
          <input
            type="text"
            name="Objeto"
            value={formData.Objeto}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg"
          />
          
          {/* Input de Descripción */}
          <label className="block mb-2 text-sm font-medium text-gray-700">Descripción</label>
          <input
            type="text"
            name="Descripcion"
            value={formData.Descripcion}
            required
            onChange={handleInputChange}
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg"
          />

          {/* Input de Tipo de Objeto */}
          <label className="block mb-2 text-sm font-medium text-gray-700">Tipo de Objeto</label>
          <input
            type="text"
            name="Tipo_Objeto"
            required
            value={formData.Tipo_Objeto}
            onChange={handleInputChange}
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg"
          />

          {/* Estado */}
          <label className="block mb-2 text-sm font-medium text-gray-700">Estado</label>
          <select
            name="Estado"
            value={formData.Estado}
            required
            onChange={handleInputChange}
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg"
          >
              <option value="">Selecciona Estado</option>
            <option value={1}>Activo</option>
            <option value={0}>Inactivo</option>
          </select>

          <div className="flex justify-end">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {isEditing ? 'Actualizar' : 'Agregar'}
            </button>
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
      </div>

      {/* Columna derecha: Tabla de objetos */}
      <div className="w-2/3">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-slate-200">
            <tr>
              <th className="py-4 px-6 text-left">Id Objeto</th>
              <th className="py-4 px-6 text-left">Nombre</th>
              <th className="py-4 px-6 text-left">Descripción</th>
              <th className="py-4 px-6 text-left">Tipo</th>
              <th className="py-4 px-6 text-left">Estado</th>
              <th className="py-4 px-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {objetos.map((objeto) => (
              <tr key={objeto.Id_Objeto} className="border-b hover:bg-gray-100">
                <td className="py-4 px-6">{objeto.Id_Objeto}</td>
                <td className="py-4 px-6"><strong>{objeto.Objeto}</strong></td>
                <td className="py-4 px-6">{objeto.Descripcion}</td>
                <td className="py-4 px-6">{objeto.Tipo_Objeto}</td>
                <td className="py-4 px-6">{objeto.Estado === 1 ? 'Activo' : 'Inactivo'}</td>
                <td className="py-4 px-6 flex justify-center space-x-2">
                  <button onClick={() => handleEdit(objeto)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Editar</button>
                  <button onClick={() => handleDelete(objeto.Id_Objeto)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManejoObjetos;
