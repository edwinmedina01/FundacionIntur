import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import { useRouter } from "next/router";

import AuthContext from "../context/AuthContext"; // para permisos
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; // Importación correcta para Heroicons v2
import { validatePasswordDetails } from "../utils/passwordValidator";
import ExcelJS from "exceljs";
import { validateNombre, validateUsername, validateEmail } from "../utils/ValidadorCampos";
import ModalConfirmacion from "../utils/ModalConfirmacion"; 
import { saveAs } from "file-saver";
import {
  MagnifyingGlassIcon,
  ShieldExclamationIcon, TrashIcon, PencilSquareIcon , ArrowDownCircleIcon, UserPlusIcon
} from "@heroicons/react/24/outline";
import { isDynamicPostpone } from "next/dist/server/app-render/dynamic-rendering";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const router = useRouter();
  const [roles, setRoles] = useState([]);
  const [userStates, setUserStates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8; // cantidad de usuarios por pagina
  const [searchQuery, setSearchQuery] = useState("");
  // ------------------- FUNCIONALIDAD ROLES----------------------//
  const { user } = useContext(AuthContext); // Usuario logueado
  const [permisos, setPermisos] = useState(null); //obtener permiso
  const [error, setError] = useState(null); //mostrar error de permiso
  const [sinPermisos, setSinPermisos] = useState(false); //mostrar que no tiene permiso
  const [showModal, setShowModal] = useState(false);
  const [showModalUsario, setShowModalUsuario] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
// ------------------------------------------------------------//
const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);


// Función para abrir el modal de eliminación
const abrirModalEliminar = (usuario) => {
  setSelectedUser(usuario);
  setIsOpenDeleteModal(true);
};

  // Función para cerrar el modal
  const cerrarModalEliminar = () => {
    setIsOpenDeleteModal(false);
    setSelectedUser(null);
  };

const openResetModal = (user) => {
  setSelectedUser(user);
  setShowModal(true);
};

const openUserModal = (user) => {
  setSelectedUser(user);
  setShowModalUsuario(true);
};

const handleReset = (user) => {
  setSelectedUser(user); // Establece el usuario seleccionado
};

  const [formData, setFormData] = useState({
    Id_Usuario: "",
    Id_Rol: "",
    Id_EstadoUsuario: "",
    Id_Persona: "",
    Usuario: "",
    Nombre_Usuario: "",
    Contrasena: "",
    ConfirmarContrasena: "",
    Fecha_Ultima_Conexion: "",
    Preguntas_Contestadas: "",
    Primer_Ingreso: "",
    Fecha_Vencimiento: "",
    Correo: "",
    Creado_Por: "",
    Fecha_Creacion: "",
    Modificado_Por: "",
    Fecha_Modificacion: "",
  });





  const [isEditing, setIsEditing] = useState(false);
 const [visibleDetails, setVisibleDetails] = useState({});
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordValidation, setPasswordValidation] = useState([]);

  const filteredUsers = users.filter(
    (user) =>
      user.Usuario.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.Correo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.Nombre_Usuario.toLowerCase().includes(searchQuery.toLowerCase())
  );


  // ✅ Función para generar una nueva contraseña segura
  const generateRandomPassword = () => {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!";
    let password = "";
    for (let i = 0; i < 10; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };


  

// ✅ Restablecer contraseña y enviarla por correo
const handleResetPassword = async (item) => {
  const newPassword = generateRandomPassword();

  console.log(user)
  try {
    const response = await axios.post("/api/enviarcorreoadmin", {
      userId: selectedUser.Id_Usuario,
      newPassword,
      email: selectedUser.Correo,
      adminId:user.id
      
    });



    if (response.data.success) {
      toast.success(`Se ha enviado una nueva contraseña al correo de ${selectedUser.Correo}`);
      setIsOpen(false); 
    } else {
      throw new Error(response.data.message || "No se pudo restablecer la contraseña.");
    }
  } catch (error) {
    toast.error("Error al restablecer la contraseña.");
    console.error("Error al restablecer la contraseña:", error);
  }
};


  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, Contrasena: newPassword });

    // Obtener los resultados de validación
    const validationResults = validatePasswordDetails(newPassword);
    setPasswordValidation(validationResults);
};
  const nextPage = () => {
    if (currentPage < Math.ceil(users.length / usersPerPage)) {
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

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchUserStates();
    fetchPermisos();
  }, [user]);
// -------- PERMISOS -------- //
const fetchPermisos = async () => {
  try {
    if (user) {
      const idObjeto = 5; // ID del objeto relacionado con esta página
      const response = await axios.post('/api/api_permiso', {
        idRol: user.rol,
        idObjeto,
      });

      const permisosData = response.data;

      // Validar si no hay permisos habilitados
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
  const fetchUsers2 = async () => {
    try {
      
      const token = sessionStorage.getItem("token") || localStorage.getItem("token");

      if (!token) {
          console.error("🚨 No hay token disponible. Redirigiendo a login...");
          // 🔹 Opcional: Redirigir a login si no hay token
          router.push("/login");
          return;
      }
    //  const response = await axios.get("/api/usuarios"); // API  usuarios

      const response = await axios.get("/api/usuarios", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
      // Filtrar solo los usuarios activos
      const activeUsers = response.data.filter(
       (user) => user.Id_EstadoUsuario !== 3
      );
      setUsers(activeUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const fetchUsers = async () => {
    try {
        // 🔹 Intentar obtener el token desde `sessionStorage` primero, luego `localStorage`
        const token = sessionStorage.getItem("token") || localStorage.getItem("token");

        if (!token) {
            console.error("🚨 No hay token disponible. Redirigiendo a login...");
            // 🔹 Opcional: Redirigir a login si no hay token
            router.push("/login");
            return;
        }

        // 🔹 Hacer la petición con el token en la cabecera
        const response = await axios.get("/api/usuarios", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // 🔹 Verificar que la respuesta contenga datos
        if (!response.data || response.data.length === 0) {
            console.warn("⚠️ No se encontraron usuarios.");
            setUsers([]); // Vaciar la lista si no hay usuarios
            return;
        }

        // 🔹 Filtrar solo los usuarios activos
        const activeUsers = response.data.filter(user => user.Id_EstadoUsuario !== 3);
        setUsers(activeUsers);
    
    } catch (error) {
        console.error("🚨 Error al obtener usuarios:", error);

        // 🔹 Si el error es 401 o 403 (token inválido), redirigir a login
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.warn("⚠️ Token inválido o expirado. Cerrando sesión...");
            sessionStorage.removeItem("token");
            localStorage.removeItem("token");
            router.push("/login");
        }
    }
};


  
const fetchRoles = async () => {
  try {
    const token = localStorage.getItem("token"); // 🔑 Obtener el token del usuario autenticado

    if (!token) {
      console.error("🚨 No hay token disponible. No se puede obtener la lista de roles.");
      return;
    }

    const response = await axios.get('/api/roles', {
      headers: {
        Authorization: `Bearer ${token}`, // 🛡️ Enviar el token en la cabecera
      },
    });

    setRoles(response.data); // 📌 Guardar los roles en el estado
  } catch (error) {
    console.error('❌ Error al obtener los roles:', error);
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error("🚨 No autorizado: Token inválido o expirado.");
      // Opcional: Redirigir al login o mostrar alerta
    }
  }
};

  

  const fetchUserStates = async () => {
    try {
      const response = await axios.get("/api/estadousuario");
      setUserStates(response.data);
    } catch (error) {
      console.error("Error fetching user states:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // For the "Usuario" field, enforce uppercase transformation
    if (name === "Usuario" || name === "Nombre_Usuario") {
      setFormData({ ...formData, [name]: value.toUpperCase() });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (name === "Usuario" ){

    }

  };



  const checkUserOrEmailExists = async (usuario, correo) => {

    const token = localStorage.getItem("token"); // 🔑 Obtener el token del usuario autenticado
  
    if (!token) {
      console.error("🚨 No hay token disponible. No se puede obtener la lista de roles.");
      return;
    }
    try {

      const response = await axios.get(`/api/usuarios?usuario=${usuario}&correo=${correo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
      
    
        const data = await response;
        return data; // Devuelve { userExists: true/false, emailExists: true/false }
    } catch (error) {
        console.error("Error al verificar existencia:", error);
        return { userExists: false, emailExists: false };
    }
};





const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const currentDate = new Date().toISOString();
        formData.Fecha_Ultima_Conexion = currentDate;
        formData.Creado_Por=user.id;
     
        const token = localStorage.getItem("token"); // 🔑 Obtener el token del usuario autenticado
  
        if (!token) {
          console.error("🚨 No hay token disponible. No se puede obtener la lista de roles.");
          return;
        }
    

        // 🔍 Validación del nombre de usuario
        if (!validateUsername(formData.Usuario)) {
            toast.error("El nombre de usuario debe tener entre 3 y 20 caracteres y no contener caracteres especiales.");
            return;
        }

         // 🔍 Validación del nombre de usuario
         if (!validateNombre(formData.Nombre_Usuario)) {
          toast.error("El nombre de usuario debe tener entre 3 y 20 caracteres y no contener caracteres especiales.");
          return;
      }


        formData.Contrasena=generateRandomPassword();
        formData.ConfirmarContrasena= formData.Contrasena;
       
        if (! validatePasswordDetails(formData.Contrasena)) {
            toast.error("La contraseña no cumple con los requisitos.");
            return;
        }

        if (formData.Contrasena !== formData.ConfirmarContrasena) {
            toast.error("Las contraseñas no coinciden.");
            return;
        }

        

        let response;
        if (isEditing) {
            formData.Primer_Ingreso = 1;
            formData.Modificado_Por=user.id;
           // formData.Fecha_Modificacion=user.id;
            if (!formData.Contrasena) {
                delete formData.Contrasena;
                delete formData.ConfirmarContrasena;
            }

            response = await fetch(`/api/usuarios`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // 🛡️ Enviar el token en la cabecera
                },
                body: JSON.stringify(formData),
            });

        } else {

// ✅ Verificar si el usuario o el correo ya existen antes de continuar
const { userExists, emailExists } = await checkUserOrEmailExists(formData.Usuario, formData.Correo);

if (userExists) {
    toast.error("El usuario ya existe. Prueba con otro nombre.");
    return;
}

if (emailExists) {
    toast.error("El correo ya está registrado. Usa otro correo.");
    return;
}


            response = await fetch("/api/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // 🛡️ Enviar el token en la cabecera
                },
                body: JSON.stringify(formData),
            });
        }

        if (!response.ok) {
            const errorData = await response.json();
            if (errorData.error) {
                throw new Error(errorData.error);
            }
            throw new Error("Error al procesar la solicitud.");
        }

        toast.success(isEditing ? "Usuario actualizado exitosamente" : "Usuario agregado exitosamente", {
            style: {
                backgroundColor: '#e6ffed',
                color: '#2e7d32',
                fontWeight: 'bold',
                border: '1px solid #a5d6a7',
                padding: '16px',
                borderRadius: '12px',
            },
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: true,
        });

        // 🔄 Limpiar el formulario después de éxito
        fetchUsers();
        resetForm();
        setShowModalUsuario(false);

    } catch (error) {
        toast.error(error.message || "Error al guardar el usuario.");
    }
};

  const handleEdit = (user) => {
    // Carga los datos del usuario, pero deja la contraseña vacía
    setFormData({
      ...user,
      Contrasena: "", // Mantén la contraseña vacía
    });
    setIsEditing(true);
    setShowModalUsuario(true);
  };



  const handleDelete = async (Id_Usuario) => {
    try {
      const response = await fetch("/api/usuarios", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Id_Usuario }),
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el usuario");
      }

      fetchUsers();
      resetForm();
      cerrarModalEliminar(); 
      toast.error("Usuario eliminado exitosamente", {
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
    } catch (error) {
      toast.error("Error al eliminar el usuario:", error);
    }
  };



  const resetForm = () => {
    setFormData({
      Id_Usuario: "",
      Id_Rol: "",
      Id_EstadoUsuario: "",
      Id_Persona: "",
      Usuario: "",
      Nombre_Usuario: "",
      Contrasena: "",
     ConfirmarContrasena:"",
      Fecha_Ultima_Conexion: "",
      Preguntas_Contestadas: "",
      Primer_Ingreso: "",
      Fecha_Vencimiento: "",
      Correo: "",
      Creado_Por: "",
      Fecha_Creacion: "",
      Modificado_Por: "",
      Fecha_Modificacion: "",
    });
    setIsEditing(false);
  };

  const getRoleNameById = (roleId) => {
    const role = roles.find((r) => r.Id_Rol === roleId);
    return role ? role.Rol : "Desconocido";
  };

  const getUserStateNameById = (stateId) => {
    const state = userStates.find((s) => s.Id_EstadoUsuario === stateId);
    return state ? state.Descripcion : "Desconocido";
  };

  const toggleDetails = (userId) => {
    setVisibleDetails((prevState) => ({
      ...prevState,
      [userId]: !prevState[userId], // Alterna la visibilidad del usuario correspondiente
    }));
  };

  // Función para exportar a Excel
 const exportToExcel = async () => {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Usuarios");
  
      // 📌 **Definir Encabezados**
      const headers = [
          { header: "ID", key: "Id_Usuario", width: 10 },
          { header: "Usuario", key: "Usuario", width: 15 },
          { header: "Nombre", key: "Nombre_Usuario", width: 20 },
          { header: "Correo", key: "Correo", width: 25 },
          { header: "Rol", key: "Rol", width: 15 },
          { header: "Estado", key: "Estado", width: 15 },
          { header: "Fecha Última Conexión", key: "Fecha_Ultima_Conexion", width: 18 },
          { header: "Creado Por", key: "Creado_Por", width: 15 },
          { header: "Fecha Creación", key: "Fecha_Creacion", width: 18 },
          { header: "Modificado Por", key: "Modificado_Por", width: 15 },
          { header: "Fecha Modificación", key: "Fecha_Modificacion", width: 18 }
      ];
  
      // Asignar columnas al worksheet
      worksheet.columns = headers;
  
      // Aplicar estilos a los encabezados
      worksheet.getRow(1).eachCell((cell) => {
          cell.font = { bold: true, color: { argb: "FFFFFF" } };
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "007ACC" } };
          cell.alignment = { horizontal: "center", vertical: "middle" };
          cell.border = { top: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" }, bottom: { style: "thin" } };
      });
  
      // 📌 **Agregar Datos al Excel**

console.log(users)

      users.forEach((user) => {
          worksheet.addRow({
              Id_Usuario: user.Id_Usuario,
              Usuario: user.Usuario,
              Nombre_Usuario: user.Nombre_Usuario,
              Correo: user.Correo,
              Rol: getRoleNameById(user.Id_Rol),
              Estado: getUserStateNameById(user.Id_EstadoUsuario),
              Fecha_Ultima_Conexion: user.Fecha_Ultima_Conexion ? new Date(user.Fecha_Ultima_Conexion).toLocaleDateString("es-ES") : "-",
              Creado_Por: user.Creado_Por,
              Fecha_Creacion: user.Fecha_Creacion ? new Date(user.Fecha_Creacion).toLocaleDateString("es-ES") : "-",
              Modificado_Por: user.Modificado_Por,
              Fecha_Modificacion: user.Fecha_Modificacion ? new Date(user.Fecha_Modificacion).toLocaleDateString("es-ES") : "-",
          });
      });
  
      // 📌 **Descargar el Archivo**
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, "Usuarios.xlsx");
  };
  
// Renderizado
if (!user) {
  return <p>Cargando usuario...</p>;
}

// 📌 Limpiar búsqueda
const handleClearSearch = () => {
  setSearchQuery("");
  setCurrentPage(1); // Reiniciar a la primera página
};

if (error) {
  return <p>{error}</p>;
}

if (sinPermisos) {
  return         <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-lg flex items-center">
  <ShieldExclamationIcon className="h-12 w-12 mr-4" />
  <div>
    <h3 className="font-bold text-lg">
      Sin permisos para Acceder a la Pantalla de Usuarios
    </h3>
    <p>No tienes permisos para Acceder a la información.</p>
  </div>
</div>
}

if (!permisos) {
  return <p>Cargando permisos...</p>;
}

  return (
    <div >

      {/* Columna derecha: Tabla de Usuarios */}
      <div className="w-3/3">
      <div className="mb-1 flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow-md">
  {/* Barra de búsqueda */}
  <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-white shadow-sm">
    <MagnifyingGlassIcon className="h-6 w-6 mr-2 text-gray-600" />
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="border-none focus:ring-0 w-200 text-gray-700 bg-transparent"
      placeholder="Buscar por nombre o correo"
    />
      {/* Botón para limpiar búsqueda */}
  {searchQuery && (
    <button
      onClick={handleClearSearch}
      className="px-0 py-0 bg-white-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md"
    >
      ❌ 
    </button>
    
  )
  }
  </div>

  {/* Título de la sección */}
  <p className="text-3xl font-bold text-blue-700">📋 Listado de Usuarios</p>

  {/* Botones de acciones */}
  <div className="flex gap-x-2">

    {/* Botón para abrir el modal de agregar usuario */}
<button
  onClick={() => setShowModalUsuario(true)}
  className="flex items-center bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-md"
>
  <UserPlusIcon className="h-5 w-5 mr-2" /> Agregar Usuario
</button>
    
    <button
      onClick={exportToExcel}
      className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors shadow-md"
    >
      <ArrowDownCircleIcon className="h-5 w-5 mr-2" /> Exportar
    </button>

    <button
      onClick={() => router.push("/permisos")}
      className="flex items-center bg-cyan-900 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-red-400"
    >
      <PencilSquareIcon className="h-5 w-5 mr-2" /> Ver Permisos
    </button>
  </div>
</div>

        <table className="xls_style-excel-table">
          <thead className="bg-slate-200">
            <tr>
              <th className="py-4 px-6 text-left">ID</th>
              <th className="py-4 px-6 text-left">Usuario</th>
              <th className="py-4 px-6 text-left">Nombre</th>
              <th className="py-4 px-6 text-left">Correo</th>
              <th className="py-4 px-6 text-left">Rol</th>
              <th className="py-4 px-6 text-left">Estado</th>
              <th className="py-4 px-6 text-center">Acciones</th>
            </tr>
          </thead>
          {permisos?.Permiso_Consultar === "1" && (
          <tbody>
            {filteredUsers.length>0?(
              filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
              .map((user) => (
                <React.Fragment key={user.Id_Usuario}>
                  <tr className="hover:bg-gray-100">
                    <td className="py-4 px-6">{user.Id_Usuario}</td>
                    <td className="border-b border-gray-200 p-2">
                      {user.Usuario}
                    </td>
                    <td className="border-b border-gray-200 p-2">
                      {user.Nombre_Usuario}
                    </td>
                    <td className="border-b border-gray-200 p-2">
                      {user.Correo}
                    </td>
                    <td className="border-b border-gray-200 p-2">
                      {getRoleNameById(user.Id_Rol)}
                    </td>
                    <td className="border-b border-gray-200 p-2">
                      {getUserStateNameById(user.Id_EstadoUsuario)}
                    </td>
                    <td className="border-b border-gray-200 p-2">
                      <td className="border-b border-gray-200 p-2">
                      <div className="flex items-center">
  {/* Botón de Editar: verificar permiso */}
  {permisos.Permiso_Actualizar === "1" && (
    <button
      onClick={() => handleEdit(user)}
      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 ml-2"
    >
      Editar
    </button>
  )}
  
  {/* Botón de Ver: verificar permiso */}
  {permisos.Permiso_Consultar === "1" && (
    <button
      onClick={() => toggleDetails(user.Id_Usuario)}
      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 ml-2"
    >
      {visibleDetails[user.Id_Usuario] ? "Ocultar" : "Ver"}
    </button>
  )}
  
  {/* Botón de Eliminar: verificar permiso */}
  {permisos.Permiso_Eliminar === "1" && (
    <button
      onClick={() => abrirModalEliminar(user)}
      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 ml-2"
    >
      X
    </button>
  )}
  {permisos.Permiso_Actualizar === "1" && (
  <button
    onClick={() => {
      handleReset(user); // Guarda el usuario seleccionado
      setIsOpen(true); // Abre el modal
    }}
    className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 focus:outline-none ml-2"
  >
    Reset
  </button>
)}
</div>

                      </td>
                    </td>
                  </tr>
                  {visibleDetails[user.Id_Usuario] && (
                    <tr className="bg-gray-50">
                      <td colSpan="6" className="border-b border-gray-200 p-2">
                        <div>
                          <p>
                            <strong>Fecha de Última Conexión:</strong>{" "}
                            {user.Fecha_Ultima_Conexion}
                          </p>
                          <p>
                            <strong>Preguntas Contestadas:</strong>{" "}
                            {user.Preguntas_Contestadas}
                          </p>
                          <p>
                            <strong>Primer Ingreso:</strong>{" "}
                            {user.Primer_Ingreso ? "Sí" : "No"}
                          </p>
                          <p>
                            <strong>Fecha de Vencimiento:</strong>{" "}
                            {user.Fecha_Vencimiento}
                          </p>
                          <p>
                            <strong>Creado Por:</strong> {user.Creado_Por}
                          </p>
                          <p>
                            <strong>Fecha de Creación:</strong>{" "}
                            {user.Fecha_Creacion}
                          </p>
                          <p>
                            <strong>Modificado Por:</strong>{" "}
                            {user.Modificado_Por}
                          </p>
                          <p>
                            <strong>Fecha de Modificación:</strong>{" "}
                            {user.Fecha_Modificacion}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))):( <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500">
                  ❌ No se encontraron usuarios con los criterios de búsqueda
                </td>
              </tr>)}
          </tbody>)}
        </table>
        {/* Paginación */}
        <div className="flex justify-between items-center mt-4">
          {/* Botón "Anterior" */}
          <button
            onClick={prevPage}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 transform ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white-600 text-black shadow-md hover:bg-gray-200 focus:outline-none"
            }`}
            disabled={currentPage === 1}
          >
            Anterior
          </button>


          {/* Páginas */}
          <div className="flex space-x-2">
            {Array.from(
              { length: Math.ceil(users.length / usersPerPage) },
              (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setPage(index + 1)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 transform ${
                    currentPage === index + 1
                      ? "bg-white-600 text-black shadow-lg scale-105"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none"
                  }`}
                >
                  {index + 1}
                </button>
              )
            )}
          </div>

          {/* Botón "Siguiente" */}
          <button
            onClick={nextPage}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 transform ${
              currentPage === Math.ceil(users.length / usersPerPage)
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white-600 text-black shadow-md hover:bg-gray-200 focus:outline-none"
            }`}
            disabled={currentPage === Math.ceil(users.length / usersPerPage)}
          >
            Siguiente
          </button>
        </div>
      </div>




  <ModalConfirmacion
  isOpen={isOpenDeleteModal}
  onClose={() => setIsOpenDeleteModal(false)}
  onConfirm={() => handleDelete(selectedUser?.Id_Usuario)}
  titulo="❌ Confirmar Eliminación"
  mensaje="¿Estás seguro de que deseas eliminar a"
  entidad={selectedUser?.Nombre_Usuario}
  confirmText="Eliminar"
  confirmColor="bg-red-600 hover:bg-red-700"
/>

    
 {/* Modal */}
 {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold text-gray-800">
              ¿Restablecer contraseña?
            </h2>
            <p className="text-gray-600 mt-2">
              Se enviará una nueva contraseña al correo del usuario.
            </p>

            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-lg mr-2 hover:bg-gray-500"
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </button>
              <button
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleResetPassword}
                disabled={loading}
              >
                {loading ? "Enviando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}




{/* Modal para agregar usuario */}
{showModalUsario && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        {isEditing ? "Editar Usuario" : "Agregar Usuario"}
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Campo de Usuario */}
        <div className="relative mb-4">
          <input
            type="text"
            name="Usuario"
            value={formData.Usuario}
            onChange={handleInputChange}
            required
            className="peer pt-4 pl-1 pb-1 w-full border-b border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent uppercase text-gray-900"
            placeholder=" "
          />
          <label className={`absolute left-1 top-1 transition-all duration-200 transform ${formData.Usuario ? "text-gray-500 -translate-y-1 scale-100 text-xs" : "text-gray-400"}`}>
            Usuario
          </label>
        </div>

        {/* Campo de Nombre Completo */}
        <div className="relative mb-4">
          <input
            type="text"
            name="Nombre_Usuario"
            value={formData.Nombre_Usuario}
            onChange={handleInputChange}
            required
            className="peer pt-4 pl-1 pb-1 w-full border-b border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent uppercase text-gray-900"
            placeholder=" "
          />
          <label className={`absolute left-1 top-1 transition-all duration-200 transform ${formData.Nombre_Usuario ? "text-gray-500 -translate-y-1 scale-100 text-xs" : "text-gray-400"}`}>
            Nombre Completo
          </label>
        </div>

        {/* Campo de Correo */}
        <div className="relative mb-4">
          <input
            type="email"
            name="Correo"
            value={formData.Correo}
            onChange={handleInputChange}
            required
            className="peer pt-4 pl-1 pb-1 w-full border-b border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent text-gray-900"
            placeholder=" "
          />
          <label className={`absolute left-1 top-1 transition-all duration-200 transform ${formData.Correo ? "text-gray-500 -translate-y-1 scale-100 text-xs" : "text-gray-400"}`}>
            Correo Electrónico
          </label>
        </div>

        {/* Selección de Rol */}
        <label htmlFor="Id_Rol" className="block mb-2 text-sm font-medium text-gray-700">
          Rol
        </label>
        <select
          name="Id_Rol"
          value={formData.Id_Rol}
          onChange={handleInputChange}
          required
          className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecciona Rol</option>
          {roles.filter((role) => role.Estado === 1).map((role) => (
            <option key={role.Id_Rol} value={role.Id_Rol}>
              {role.Rol}
            </option>
          ))}
        </select>

        {/* Selección de Estado */}
        <label htmlFor="Id_EstadoUsuario" className="block mb-2 text-sm font-medium text-gray-700">
          Estado
        </label>
        <select
          name="Id_EstadoUsuario"
          value={formData.Id_EstadoUsuario}
          onChange={handleInputChange}
          required
          className="mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecciona Estado</option>
          {userStates.map((state) => (
            <option key={state.Id_EstadoUsuario} value={state.Id_EstadoUsuario}>
              {state.Descripcion}
            </option>
          ))}
        </select>

        {/* Botones de acción */}
        <div className="flex justify-end">
          {isEditing ? (
            permisos.Permiso_Actualizar === "1" && (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Actualizar
              </button>
            )
          ) : (
            permisos.Permiso_Insertar === "1" && (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Agregar
              </button>
            )
          )}

          <button
            type="button"
            onClick={() => setShowModalUsuario(false)}
            className="ml-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
)}




    </div>
  );
};

export default UsersManagement;
