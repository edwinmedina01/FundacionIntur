import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';
import { deepSearch } from '../utils/deepSearch';
import { exportToExcel } from '../utils/exportToExcel';
import SearchBar from "./basicos/SearchBar";
import Pagination from "../components/basicos/Pagination";
import LoadingOverlay from "../components/LoadingOverlay";
import { set } from 'nprogress';
import ModalConfirmacion from '../utils/ModalConfirmacion';
import useModal from "../hooks/useModal";
const BitacoraManagement = () => {
  const { user } = useContext(AuthContext);
  const [bitacora, setBitacora] = useState([]);
  const [search, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [error, setError] = useState(null);
  const [sinPermisos, setSinPermisos] = useState(false);
  const [permisos, setPermisos] = useState(null);
      
      const [formData, setFormData] = useState({
        Id_Permiso: '',
        Id_Rol: '',
        Creado_Por: '', 
        Modificado_Por:'',
        // Añadir el Id_Objeto en el estado
        Permiso_Insertar: false,
        Permiso_Actualizar: false,
        Permiso_Eliminar: false,
        Permiso_Consultar: false,
      });
  const { modals, showModal, closeModal } = useModal(); // Hook para manejar modales
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBitacora();
    fetchPermisos();
  }, [user]);

  const fetchBitacora = async () => {
    try {
      const token = localStorage.getItem("token");
      setLoading(true);
      const response = await axios.get('/api/bitacora', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const bitacoraFormateada = response.data.map(item => ({
        ...item,
        Fecha: formatearFechaHora(item.Fecha),
      }));


      setBitacora(bitacoraFormateada);
      setLoading(false);
    } catch (error) {
      setError("No se pudo cargar la bitácora");
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };
  const formatearFechaHora = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString('es-HN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const fetchPermisos = async () => {
    try {
      if (user) {
        const res = await axios.post('/api/api_permiso', {
          idRol: user.rol,
          idObjeto: 45, // 👈🏼 Asegúrate que 99 es el ID_Objeto de Bitácora
        });
        const permisosData = res.data;
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
  

    const handleDelete = async (Id_Bitacora) => {
      try {
        const response = await fetch('/api/bitacora', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ Id_Bitacora, Modificado_Por: user.id }), // Enviar el ID del permiso a eliminar
        });
  
        if (!response.ok) {
          throw new Error('Error al eliminar el permiso');
        }
  
        fetchBitacora();

      //  resetForm();
        toast.error('Permiso eliminado exitosamente', {
          style: {
            backgroundColor: '#ffebee', // Fondo suave rojo
            color: '#d32f2f', // Texto rojo oscuro
            fontWeight: 'bold',
            border: '1px solid #f5c6cb',
            padding: '16px',
            borderRadius: '12px',
          },
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: true,
        });
        closeModal("modalConfirmacion")
      } catch (error) {
        console.error('Error al eliminar el permiso:', error);
      }
    };
  
  

  const filteredBitacora = bitacora.filter((entry) => deepSearch(entry, search, 0, 3));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBitacora.slice(indexOfFirstItem, indexOfLastItem);


  const eliminarBitacora = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este registro de bitácora? Esta acción no se puede deshacer.')) {
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/bitacora?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Registro eliminado exitosamente');
      fetchBitacora(); // Recarga la bitácora
    } catch (error) {
      console.error('Error al eliminar:', error);
      toast.error('Error al eliminar el registro');
    }
  };
  

  const handleExport = async () => {
    const headers = [
      { header: "Usuario", key: "Id_Usuario", width: 15 },
      { header: "Módulo", key: "Modulo", width: 20 },
      { header: "Acción", key: "Tipo_Accion", width: 15 },
      { header: "Detalle", key: "Detalle", width: 40 },
      { header: "IP", key: "IP_Usuario", width: 20 },
    //   { header: "Navegador", key: "Navegador", width: 50 },
      { header: "Fecha", key: "Fecha", width: 25 },
    ];

    const data = filteredBitacora.map((entry) => ({
      ...entry,
    }));

    await exportToExcel({
      fileName: "Bitacora.xlsx",
      title: "Registro de Bitácora",
      headers,
      data,
      searchQuery: search,
    });
  };

  if (!user) return <p>Cargando usuario...</p>;
  if (error) return <p>{error}</p>;
  if (sinPermisos) {
    return (
      <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-lg flex items-center">
        <ShieldExclamationIcon className="h-12 w-12 mr-4" />
        <div>
          <h3 className="font-bold text-lg">Sin permisos para acceder a la bitácora</h3>
          <p>No tienes permisos para acceder a esta información.</p>
        </div>
      </div>
    );
  }

  return (
    
    
    
    <div>
<LoadingOverlay loading={loading} setLoading={setLoading} />

      <SearchBar
        title="Registro de Bitácora"
        searchQuery={search}
        setSearchQuery={setSearchQuery}
        handleClearSearch={handleClearSearch}
        onExport={handleExport}
        showAddButton={false}
      />

      

<ModalConfirmacion
  isOpen={modals["modalConfirmacion"]}
       onClose={() => closeModal("modalConfirmacion")}
  onConfirm={() => handleDelete(formData?.Id_Bitacora)}
  titulo="❌ Confirmar Eliminación"
  mensaje="¿Estás seguro de que deseas eliminar a"
  entidad={""}
  confirmText="Eliminar"
  confirmColor="bg-red-600 hover:bg-red-700"
/>


      <table className="xls_style-excel-table">
        <thead className="bg-slate-200">
          <tr>
            <th>#</th>
          
            <th>Usuario</th>
            <th>Módulo</th>
            <th>Acción</th>
            <th>Detalle</th>
            <th>IP</th>
            {/* <th>Navegador</th> */}
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((entry, index) => (
            <tr key={index} className="border-b hover:bg-gray-100 transition duration-300">
              <td>{index+1}</td>
          
              <td>{entry.Id_Usuario}</td>
              <td>{entry.Modulo}</td>
              <td>{entry.Tipo_Accion}</td>
              <td>{entry.Detalle}</td>
              <td>{entry.IP_Usuario}</td>
              {/* <td>{entry.Navegador}</td> */}
              <td>{entry.Fecha}</td>
              <td>
              {permisos.Permiso_Eliminar === "1" && (
                <button
                  onClick={() => {
                    setFormData(entry);
                    showModal("modalConfirmacion");
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  X
                </button>
              )}
</td>

            </tr>
          ))}
          {filteredBitacora.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center text-gray-500 py-4">
                ❌ No se encontraron registros en la bitácora
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalItems={filteredBitacora.length}
        itemsPerPage={itemsPerPage}
        setPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
        prevPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        nextPage={() =>
          setCurrentPage((prev) =>
            Math.min(prev + 1, Math.ceil(filteredBitacora.length / itemsPerPage))
          )
        }
      />
    </div>
  );
};

export default BitacoraManagement;