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

const BackupRestoreManagement = () => {
  const { user } = useContext(AuthContext);
  const [bitacora, setBitacora] = useState([]);
  const [search, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [error, setError] = useState(null);
  const [sinPermisos, setSinPermisos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [archivo, setArchivo] = useState(null);
  const [base, setBase] = useState('testdb');

  useEffect(() => {
    fetchBitacora();
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

      const bitacoraFiltrada = response.data.filter(item => item.Modulo === 'BACKUP');

      const bitacoraFormateada = bitacoraFiltrada.map(item => ({
        ...item,
        Fecha: formatearFechaHora(item.Fecha),
      }));

      setBitacora(bitacoraFormateada);
      setLoading(false);
    } catch (error) {
      setError("No se pudo cargar la bitácora de backups");
    }
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

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleBackup = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://nodedump-production.up.railway.app/');
      toast.success(`✅ Backup generado: ${res.data.file || 'archivo'}`);

      
const nombreArchivo = res.data.file.split('/').pop(); // Extrae solo el nombre

      await axios.post('/api/bitacora/backup', {
        Id_Usuario: user.id,
        Modulo: 'BACKUP',
        Tipo_Accion: 'GENERAR',
        Detalle: `Se generó el backup: ${nombreArchivo}`,
      });
      

      fetchBitacora();
    } catch (err) {
      console.error(err);
      toast.error('❌ Error al generar backup');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadv1 = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://nodedump-production.up.railway.app/download', {
        responseType: 'blob'
      });
      
     



      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;


      const disposition = res.headers['content-disposition'];
      const match = disposition && disposition.match(/filename=(.+)/);
      const nombreArchivo = match ? match[1] : 'backup.sql';
      
      link.setAttribute('download', nombreArchivo);
      document.body.appendChild(link);
      link.click();

      await axios.post('/api/bitacora/backup', {
        Id_Usuario: user.id,
        Modulo: 'BACKUP',
        Tipo_Accion: 'DESCARGAR',
        Detalle: `Se descargó el backup: ${nombreArchivo}`,
      });
      

      fetchBitacora();
    } catch (err) {
      console.error(err);
      toast.error('❌ Error al descargar backup');
    } finally {
      setLoading(false);
    }
  };
  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://nodedump-production.up.railway.app/download', {
        responseType: 'blob'
      });
  
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
  
      // 📦 Extraer nombre de archivo de forma segura
      const disposition = res.headers['content-disposition'];
      let nombreArchivo = 'backup.sql'; // Valor por defecto
  
      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          nombreArchivo = match[1];
        }
      }
  
      link.setAttribute('download', nombreArchivo);
      document.body.appendChild(link);
      link.click();
  
      // ✅ Ahora registramos el nombre correcto en la bitácora
      await axios.post('/api/bitacora/backup', {
        Id_Usuario: user.id,
        Modulo: 'BACKUP',
        Tipo_Accion: 'DESCARGAR',
        Detalle: `Se descargó el backup`,
      });
  
      fetchBitacora();
    } catch (err) {
      console.error(err);
      toast.error('❌ Error al descargar backup');
    } finally {
      setLoading(false);
    }
  };
  

  const handleRestore = async () => {
    if (!archivo) return toast.warn('⚠️ Debes seleccionar un archivo .sql');

    const confirmar = window.confirm('¿Estás seguro de que deseas restaurar la base de datos? Esta acción no se puede deshacer.');
    if (!confirmar) return;

    const formData = new FormData();
    formData.append('sqlfile', archivo);

    setLoading(true);
    try {
      await axios.post(`https://nodedump-production.up.railway.app/restore-manual?db=${base}`, formData);

      const nombreArchivo = archivo.name;
      await axios.post('/api/bitacora/backup', {
        Id_Usuario: user.id,
        Modulo: 'BACKUP',
        Tipo_Accion: 'RESTORE',
        Detalle: `Se restauró la base de datos usando el backup: ${nombreArchivo}`,
      });
      


      toast.success('✅ Restauración completada');
      fetchBitacora();
    } catch (err) {
      console.error(err);
      toast.error('❌ Error al restaurar la base');
    } finally {
      setLoading(false);
    }
  };

  const filteredBitacora = bitacora.filter((entry) => deepSearch(entry, search, 0, 3));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBitacora.slice(indexOfFirstItem, indexOfLastItem);

  const handleExport = async () => {
    const headers = [
      { header: "Usuario", key: "Id_Usuario", width: 15 },
      { header: "Módulo", key: "Modulo", width: 20 },
      { header: "Acción", key: "Tipo_Accion", width: 15 },
      { header: "Detalle", key: "Detalle", width: 40 },
      { header: "IP", key: "IP_Usuario", width: 20 },
      { header: "Fecha", key: "Fecha", width: 25 },
    ];

    await exportToExcel({
      fileName: "BitacoraBackup.xlsx",
      title: "Registro de Acciones de Backup",
      headers,
      data: filteredBitacora,
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
          <h3 className="font-bold text-lg">Sin permisos para acceder al módulo de backups</h3>
          <p>No tienes permisos para acceder a esta información.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <LoadingOverlay loading={loading} setLoading={setLoading} />

      <SearchBar
        title="Gestión de Respaldos de Base de Datos"
        searchQuery={search}
        setSearchQuery={setSearchQuery}
        handleClearSearch={handleClearSearch}
        onExport={handleExport}
        showAddButton={false}
      />

      <div className="p-4">
        <div className="flex gap-4 mb-4">
          <button onClick={handleBackup} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Crear Backup
          </button>
          <button onClick={handleDownload} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Descargar Último Backup
          </button>
          <input type="file" accept=".sql" onChange={(e) => setArchivo(e.target.files[0])} />
          <button onClick={handleRestore} className="ml-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Restaurar Backup
          </button>
        </div>
      </div>

      <table className="xls_style-excel-table">
        <thead className="bg-slate-200">
          <tr>
            <th>#</th>
            <th>Usuario</th>
            <th>Módulo</th>
            <th>Acción</th>
            <th>Detalle</th>
            <th>IP</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((entry, index) => (
            <tr key={index} className="border-b hover:bg-gray-100 transition duration-300">
              <td>{index + 1}</td>
              <td>{entry.Id_Usuario}</td>
              <td>{entry.Modulo}</td>
              <td>{entry.Tipo_Accion}</td>
              <td>{entry.Detalle}</td>
              <td>{entry.IP_Usuario}</td>
              <td>{entry.Fecha}</td>
            </tr>
          ))}
          {filteredBitacora.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center text-gray-500 py-4">
                ❌ No se encontraron registros en la bitácora de backups
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

export default BackupRestoreManagement;
