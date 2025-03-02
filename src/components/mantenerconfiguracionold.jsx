import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import AuthContext from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalGenerico from '../utils/ModalGenerico';
import ModalConfirmacion from '../utils/ModalConfirmacion';
import useModal from "../hooks/useModal";

const ConfiguracionManagementOld = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [configuraciones, setConfiguraciones] = useState([]);
  const [formData, setFormData] = useState({
    Clave: '',
    Valor: '',
  });
  const { modals, showModal, closeModal } = useModal();
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    fetchConfiguraciones();
  }, [user]);

  const fetchConfiguraciones = async () => {
    try {
      const response = await axios.get('/api/configuracion');
      setConfiguraciones(response.data);
    } catch (error) {
      console.error('Error fetching configuraciones:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (clave, valor) => {
    if (!user || user.role !== "SuperAdministrador") {
      toast.error("No tienes permisos para modificar.");
      return;
    }
    try {
      await axios.put('/api/configuracion', { clave, valor });
      toast.success("Configuración actualizada correctamente");
      fetchConfiguraciones();
    } catch (error) {
      toast.error("Error al actualizar configuración");
    }
  };

  return (
    <div>
      <h2>Mantenimiento de Configuración</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Clave</th>
            <th>Valor</th>
            <th>Modificar</th>
          </tr>
        </thead>
        <tbody>
          {configuraciones.map(config => (
            <tr key={config.Id_Configuracion}>
              <td>{config.Clave}</td>
              <td>
                <input
                  type="text"
                  value={config.Valor}
                  onChange={(e) => handleUpdate(config.Clave, e.target.value)}
                  disabled={user?.role !== "SuperAdministrador"}
                />
              </td>
              <td>
                <button onClick={() => handleUpdate(config.Clave, config.Valor)} disabled={user?.role !== "SuperAdministrador"}>
                  Guardar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default ConfiguracionManagementOld;
