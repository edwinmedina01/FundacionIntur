import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { validarFormulario } from '../utils/validaciones';
import { reglasValidacionBeneficio } from '../../models/ReglasValidacionModelos'; // Importamos las reglas del modelo
import ModalGenerico from '../utils/ModalGenerico';
import ModalConfirmacion from '../utils/ModalConfirmacion';
import useModal from '../hooks/useModal';
import { obtenerEstados } from '../../src/utils/api'; // Importar la función
import Pagination from '../components/basicos/Pagination'; // Importar componente de paginación
import SearchBar from '../components/basicos/SearchBar'; // Importar componente de búsqueda
import { deepSearch } from '../utils/deepSearch'; // Importar función de búsqueda profunda
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import { exportToExcel } from '../utils/exportToExcel';




const LineaBeneficioManagement = () => {
  const [estados, setEstados] = useState([]);
  const { modals, showModal, closeModal } = useModal();
  const [beneficios, setBeneficios] = useState([]);
  const [formData, setFormData] = useState({
    Id_Beneficio: '',
    Nombre_Beneficio: '',
    Tipo_Beneficio: '',
    Monto_Beneficio: '',
    Responsable_Beneficio: '',
    Estado: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useContext(AuthContext); // Usuario logueado
  const [permisos, setPermisos] = useState(null);
  const [error, setError] = useState(null);
  const [sinPermisos, setSinPermisos] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const beneficiosPerPage = 8;
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrado de beneficios por Nombre_Beneficio
  const filteredBeneficios = beneficios.filter(beneficio =>
    beneficio.Nombre_Beneficio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Lógica de paginación
  const indexOfLastBeneficio = currentPage * beneficiosPerPage;
  const indexOfFirstBeneficio = indexOfLastBeneficio - beneficiosPerPage;
  const currentBeneficios = filteredBeneficios.slice(indexOfFirstBeneficio, indexOfLastBeneficio);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredBeneficios.length / beneficiosPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const setPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  const handleExport = async () => {
    const headers = [
      { header: "ID", key: "ID", width: 10 },
      { header: "Nombre", key: "Nombre", width: 30 },
      { header: "Tipo", key: "Tipo", width: 20 },
      { header: "Monto", key: "Monto", width: 15 },
      { header: "Responsable", key: "Responsable", width: 30 },
    ];
  
    const data = filteredBeneficios.map((beneficio) => ({
      ID: beneficio.Id_Beneficio,
      Nombre: beneficio.Nombre_Beneficio,
      Tipo: beneficio.Tipo_Beneficio,
      Monto: beneficio.Monto_Beneficio,
      Responsable: beneficio.Responsable_Beneficio,
    }));
  
    await exportToExcel({
      fileName: "Beneficios.xlsx",
      title: "Reporte de Beneficios",
      headers,
      data,
      searchQuery,
    });
  };
  

  const exportToExcelold = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Líneas de Beneficio');

    worksheet.columns = [
      { header: 'ID', key: 'ID', width: 10 },
      { header: 'Nombre', key: 'Nombre', width: 30 },
      { header: 'Tipo', key: 'Tipo', width: 20 },
      { header: 'Monto', key: 'Monto', width: 15 },
      { header: 'Responsable', key: 'Responsable', width: 30 },
    ];

    const exportData = currentBeneficios.map((beneficio) => ({
      ID: beneficio.Id_Beneficio,
      Nombre: beneficio.Nombre_Beneficio,
      Tipo: beneficio.Tipo_Beneficio,
      Monto: beneficio.Monto_Beneficio,
      Responsable: beneficio.Responsable_Beneficio,
    }));

    exportData.forEach((beneficio) => {
      worksheet.addRow(beneficio);
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center' };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const fileBlob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(fileBlob, 'LineasBeneficio.xlsx');
  };

  const cargarEstados = useCallback(async () => {
    const data = await obtenerEstados('GENÉRICO');
    setEstados(data);
  }, []);

  useEffect(() => {
    cargarEstados();
    fetchBeneficios();
    fetchPermisos();
  }, [user]);

  const fetchBeneficios = async () => {
    try {
      const response = await axios.get('/api/apis_mantenimientos/lineas_beneficio');
      setBeneficios(response.data);
    } catch (error) {
      toast.error('Error fetching beneficios:', error);
    }
  };

  const fetchPermisos = async () => {
    try {
      if (user) {
        const idObjeto = 10;
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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    formData.Creado_Por = user.id;
    formData.Fecha_Creacion = new Date().toISOString().split('T')[0];
    formData.Modificado_Por = user.id;
    formData.Fecha_Modificacion = new Date().toISOString().split('T')[0];
    formData.Estado = Number(formData.Estado);

    const errores = validarFormulario(formData, reglasValidacionBeneficio);

    if (errores.length > 0) {
      return;
    }

    try {
      if (isEditing) {
        const response = await fetch('/api/apis_mantenimientos/lineas_beneficio', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar el beneficio');
        }

        toast.success('Beneficio actualizado exitosamente');
      } else {
        const response = await fetch('/api/apis_mantenimientos/lineas_beneficio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Error al crear el beneficio');
        }

        toast.success('Beneficio agregado exitosamente');
      }

      fetchBeneficios();
      resetForm();
      closeModal('modalAddBeneficio');
    } catch (error) {
      toast.error('Error al guardar el beneficio:', error);
    }
  };

  const handleEdit = (beneficio) => {
    setFormData(beneficio);
    setIsEditing(true);
    showModal('modalAddBeneficio');
  };

  const handleDelete = async (Id_Beneficio) => {
    try {
      const response = await fetch('/api/apis_mantenimientos/lineas_beneficio', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Id_Beneficio }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el beneficio');
      }

      closeModal('modalConfirmacion');
      fetchBeneficios();
      resetForm();
      toast.success('Beneficio eliminado exitosamente');
    } catch (error) {
      toast.error('Error al eliminar el beneficio:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      Id_Beneficio: '',
      Nombre_Beneficio: '',
      Tipo_Beneficio: '',
      Monto_Beneficio: '',
      Responsable_Beneficio: '',
      Estado: '',
    });
    setIsEditing(false);
  };

  if (!user) {
    return <p>Cargando usuario...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (sinPermisos) {
    return (
      <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-lg flex items-center">
        <ShieldExclamationIcon className="h-12 w-12 mr-4" />
        <div>
          <h3 className="font-bold text-lg">Sin permisos para Acceder a la Pantalla de Lineas de Beneficio</h3>
          <p>No tienes permisos para Acceder a la información.</p>
        </div>
      </div>
    );
  }

  if (!permisos) {
    return <p>Cargando permisos...</p>;
  }

  return (
    <div className="">
      <SearchBar
        title="Listado de Beneficios"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleClearSearch={handleClearSearch}
        onAdd={() => {
          resetForm();
          showModal('modalAddBeneficio');
        }}
        onExport={handleExport}
      />

      <ModalGenerico
        id="modalAddBeneficio"
        isOpen={modals['modalAddBeneficio']}
        onClose={() => closeModal('modalAddBeneficio')}
        titulo={isEditing ? 'Editar Beneficio' : 'Agregar Beneficio'}
      >
        <form onSubmit={handleSubmit}>
          <label>Nombre del Beneficio:</label>
          <input
            type="text"
            name="Nombre_Beneficio"
            value={formData.Nombre_Beneficio}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border rounded"
          />
          <label>Tipo de Beneficio:</label>
          <input
            type="text"
            name="Tipo_Beneficio"
            value={formData.Tipo_Beneficio}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border rounded"
          />
          <label>Monto del Beneficio:</label>
          <input
            type="text"
            name="Monto_Beneficio"
            value={formData.Monto_Beneficio}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border rounded"
          />
          <label>Responsable del Beneficio:</label>
          <input
            type="text"
            name="Responsable_Beneficio"
            value={formData.Responsable_Beneficio}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border rounded"
          />
          <label>Estado:</label>
          <select
            name="Estado"
            value={formData.Estado || ''}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border rounded"
          >
            <option value="">Seleccione un estado</option>
            {estados.map((estado) => (
              <option key={estado.Codigo_Estado} value={estado.Codigo_Estado}>
                {estado.Nombre_Estado}
              </option>
            ))}
          </select>
          <div className="flex justify-end">
            {isEditing && permisos?.Permiso_Actualizar === '1' && (
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Actualizar
              </button>
            )}
            {!isEditing && permisos?.Permiso_Insertar === '1' && (
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Agregar
              </button>
            )}
            <button type="button" onClick={resetForm} className="ml-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Cancelar
            </button>
          </div>
        </form>
      </ModalGenerico>

      <ModalConfirmacion
        isOpen={modals['modalConfirmacion']}
        onClose={() => closeModal('modalConfirmacion')}
        onConfirm={() => handleDelete(formData?.Id_Beneficio)}
        titulo="❌ Confirmar Eliminación"
        mensaje="¿Estás seguro de que deseas eliminar el beneficio?"
        entidad={formData?.Nombre_Beneficio}
        confirmText="Eliminar"
        confirmColor="bg-red-600 hover:bg-red-700"
      />

      <table className="xls_style-excel-table">
        <thead className="bg-slate-200">
          <tr>
            <th className="p-3 border-b">ID</th>
            <th className="p-3 border-b">Nombre del Beneficio</th>
            <th className="p-3 border-b">Tipo de Beneficio</th>
            <th className="p-3 border-b">Monto del Beneficio</th>
            <th className="p-3 border-b">Responsable del Beneficio</th>
            <th className="p-3 border-b">Estado</th>
            <th className="p-3 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentBeneficios.map((beneficio) => {
            const estado = estados.find((e) => e.Codigo_Estado === beneficio.Estado);
            return (
              <tr key={beneficio.Id_Beneficio} className="hover:bg-slate-100 transition-colors">
                <td className="p-3 border-b">{beneficio.Id_Beneficio}</td>
                <td className="p-3 border-b">{beneficio.Nombre_Beneficio}</td>
                <td className="p-3 border-b">{beneficio.Tipo_Beneficio}</td>
                <td className="p-3 border-b">{beneficio.Monto_Beneficio}</td>
                <td className="p-3 border-b">{beneficio.Responsable_Beneficio}</td>
                <td className="p-3 border-b">{estado ? estado.Nombre_Estado : 'Desconocido'}</td>
                <td className="p-3 border-b flex space-x-2">
                  {permisos?.Permiso_Actualizar === '1' && (
                    <button
                      onClick={() => handleEdit(beneficio)}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
                    >
                      Editar
                    </button>
                  )}
                  {permisos?.Permiso_Eliminar === '1' && (
                    <button
                      onClick={() => {
                        setFormData(beneficio);
                        showModal('modalConfirmacion');
                      }}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                    >
                      X
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalItems={filteredBeneficios.length}
        itemsPerPage={beneficiosPerPage}
        setPage={setCurrentPage}
        prevPage={prevPage}
        nextPage={nextPage}
      />
    </div>
  );
};

export default LineaBeneficioManagement;
