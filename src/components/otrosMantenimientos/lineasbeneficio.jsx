import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';
import AuthContext from '../../context/AuthContext';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { validarFormulario } from '../../utils/validaciones';
import { reglasValidacionBeneficio } from '../../../models/ReglasValidacionModelos';
import ModalConfirmacion from '../../utils/ModalConfirmacion';
import ModalGenerico from '../../utils/ModalGenerico';
import useModal from '../../hooks/useModal';
import { obtenerEstados } from '../../utils/api';
import { exportToExcel } from '../../utils/exportToExcel';
import SearchBar from '../../components/basicos/SearchBar';
import Pagination from '../../components/basicos/Pagination';

const LineaBeneficioManagement = () => {
  const { user } = useContext(AuthContext);
  const { modals, showModal, closeModal } = useModal();
  const [estados, setEstados] = useState([]);
  const [beneficios, setBeneficios] = useState([]);
  const [formData, setFormData] = useState({
    Id_Beneficio: '',
    Nombre_Beneficio: '',
    Tipo_Beneficio: '',
    Monto_Beneficio: '',
    Responsable_Beneficio: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [permisos, setPermisos] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const beneficiosPerPage = 8;

  // Fetch estado and beneficios data
  const cargarEstados = useCallback(async () => {
    const data = await obtenerEstados('GENÉRICO');
    setEstados(data);
  }, []);

  const fetchBeneficios = async () => {
    try {
      const response = await axios.get('/api/apis_mantenimientos/lineas_beneficio');
      setBeneficios(response.data);
    } catch (error) {
      console.error('Error fetching beneficios:', error);
    }
  };

  const fetchPermisos = async () => {
    try {
      if (user) {
        const idObjeto = 10;
        const response = await axios.post('/api/api_permiso', { idRol: user.rol, idObjeto });
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

  useEffect(() => {
    cargarEstados();
    fetchBeneficios();
    fetchPermisos();
  }, [user]);

  const filteredBeneficios = beneficios.filter((beneficio) =>
    beneficio.Nombre_Beneficio.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      Estado: Number(formData.Estado),
      Creado_Por: user.id,
      Modificado_Por: user.id,
      Fecha_Creacion: new Date().toISOString().split('T')[0],
      Fecha_Modificacion: new Date().toISOString().split('T')[0],
    };

    const errores = validarFormulario(payload, reglasValidacionBeneficio);
    if (errores.length > 0) return;

    try {
      const response = isEditing
        ? await fetch('/api/apis_mantenimientos/lineas_beneficio', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch('/api/apis_mantenimientos/lineas_beneficio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

      if (!response.ok) throw new Error('Error al guardar el beneficio');

      toast.success(`Beneficio ${isEditing ? 'actualizado' : 'agregado'} exitosamente`);
      fetchBeneficios();
      resetForm();
      closeModal('modalAddBeneficio');
    } catch {
      toast.error('Error al guardar el beneficio');
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Id_Beneficio }),
      });

      if (!response.ok) throw new Error('Error al eliminar el beneficio');

      fetchBeneficios();
      resetForm();
      toast.success('Beneficio eliminado exitosamente');
      closeModal('modalConfirmacion');
    } catch {
      toast.error('Error al eliminar el beneficio');
    }
  };

  const resetForm = () => {
    setFormData({
      Id_Beneficio: '',
      Nombre_Beneficio: '',
      Tipo_Beneficio: '',
      Monto_Beneficio: '',
      Responsable_Beneficio: '',
    });
    setIsEditing(false);
  };

  const handleExport = async () => {
    const headers = [
      { header: 'ID', key: 'ID', width: 10 },
      { header: 'Nombre', key: 'Nombre', width: 30 },
      { header: 'Tipo', key: 'Tipo', width: 20 },
      { header: 'Monto', key: 'Monto', width: 15 },
      { header: 'Responsable', key: 'Responsable', width: 30 },
      { header: 'Estado', key: 'Estado', width: 15 },
    ];

    const data = beneficios.map((b) => ({
      ID: b.Id_Beneficio,
      Nombre: b.Nombre_Beneficio,
      Tipo: b.Tipo_Beneficio,
      Monto: b.Monto_Beneficio,
      Responsable: b.Responsable_Beneficio,
      Estado: b.Estado === '1' ? 'Activo' : 'Inactivo',
    }));

    await exportToExcel({ fileName: 'Beneficios.xlsx', title: 'Reporte de Beneficios', headers, data });
  };

  if (!user) return <p>Cargando usuario...</p>;
  if (sinPermisos)
    return (
      <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-lg flex items-center">
        <ShieldExclamationIcon className="h-12 w-12 mr-4" />
        <div>
          <h3 className="font-bold text-lg">Sin permisos para acceder a los Beneficios</h3>
          <p>No tienes permisos para acceder a esta información.</p>
        </div>
      </div>
    );

  return (
    <div className="p-8 mt-4 bg-gray-100">
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleClearSearch={handleClearSearch}
        onExport={handleExport}
        onAdd={() => { resetForm(); showModal('modalAddBeneficio'); }}
      />

      <ModalGenerico
        id="modalAddBeneficio"
        isOpen={modals['modalAddBeneficio']}
        onClose={() => { resetForm(); closeModal('modalAddBeneficio'); }}
        titulo={isEditing ? 'Editar Beneficio' : 'Agregar Beneficio'}
      >
        <form onSubmit={handleSubmit}>
          <label>Nombre del Beneficio</label>
          <input
            type="text"
            name="Nombre_Beneficio"
            value={formData.Nombre_Beneficio}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label>Tipo de Beneficio</label>
          <input
            type="text"
            name="Tipo_Beneficio"
            value={formData.Tipo_Beneficio}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label>Monto del Beneficio</label>
          <input
            type="text"
            name="Monto_Beneficio"
            value={formData.Monto_Beneficio}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label>Responsable del Beneficio</label>
          <input
            type="text"
            name="Responsable_Beneficio"
            value={formData.Responsable_Beneficio}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label>Estado</label>
          <select
            name="Estado"
            value={formData.Estado || ''}
            onChange={handleInputChange}
            required
            className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <button type="submit" className="btn-guardar">
                Actualizar
              </button>
            )}
            {!isEditing && permisos?.Permiso_Insertar === '1' && (
              <button type="submit" className="btn-guardar">
                Agregar
              </button>
            )}
            <button
              type="button"
              onClick={() => { resetForm(); closeModal('modalAddBeneficio'); }}
              className="btn-cancelar"
            >
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
        mensaje="¿Estás seguro de que deseas eliminar a"
        entidad={formData?.Nombre_Beneficio}
        confirmText="Eliminar"
        confirmColor="bg-red-600 hover:bg-red-700"
      />

      <table className="xls_style-excel-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Monto</th>
            <th>Responsable</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {currentBeneficios.map((beneficio) => {
            const estado = estados.find((e) => e.Codigo_Estado === beneficio.Estado);
            return (
              <tr key={beneficio.Id_Beneficio}>
                <td>{beneficio.Id_Beneficio}</td>
                <td>{beneficio.Nombre_Beneficio}</td>
                <td>{beneficio.Tipo_Beneficio}</td>
                <td>{beneficio.Monto_Beneficio}</td>
                <td>{beneficio.Responsable_Beneficio}</td>
                <td>{estado ? estado.Nombre_Estado : 'Desconocido'}</td>
                <td className="flex gap-2">
                  {permisos?.Permiso_Actualizar === '1' && (
                    <button onClick={() => handleEdit(beneficio)} className="btn-editar">
                      Editar
                    </button>
                  )}
                  {permisos?.Permiso_Eliminar === '1' && (
                    <button
                      onClick={() => {
                        setFormData(beneficio);
                        showModal('modalConfirmacion');
                      }}
                      className="btn-eliminar"
                    >
                      Eliminar
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
        totalItems={filteredBenefactores.length}
        itemsPerPage={beneficiosPerPage}
        setPage={setCurrentPage}
        prevPage={prevPage}
        nextPage={nextPage}
      />
    </div>
  );
};

export default LineaBeneficioManagement;
