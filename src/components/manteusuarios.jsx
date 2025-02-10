import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import { useRouter } from "next/router";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";
import AuthContext from "../context/AuthContext"; // para permisos
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; // Importación correcta para Heroicons v2
import { validatePasswordDetails } from "../utils/passwordValidator";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";


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
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
// ------------------------------------------------------------//


const openResetModal = (user) => {
  setSelectedUser(user);
  setShowModal(true);
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
  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/usuarios"); // API  usuarios
      // Filtrar solo los usuarios activos
      const activeUsers = response.data.filter(
        (user) => user.Id_EstadoUsuario === 1
      );
      setUsers(activeUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get("/api/roles");
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
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

  const validateUsername = (username) => {
    const regex = /^[a-zA-Z0-9]{3,80}$/; // Permite solo letras y números, sin espacios, entre 3 y 80 caracteres
    return regex.test(username) && !/\s/.test(username); // Verifica que no tenga espacios
};

const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Validación de email
  return regex.test(email);
};




  const checkUserOrEmailExists = async (usuario, correo) => {
    try {
        const response = await fetch(`/api/usuarios?usuario=${usuario}&correo=${correo}`);
        const data = await response.json();
        return data; // Devuelve { userExists: true/false, emailExists: true/false }
    } catch (error) {
        console.error("Error al verificar existencia:", error);
        return { userExists: false, emailExists: false };
    }
};



  const handleSubmitold = async (e) => {
    e.preventDefault();
    try {



      const currentDate = new Date().toISOString();
      formData.Fecha_Ultima_Conexion = currentDate;

      // Verifica si se está editando o si se está creando un nuevo usuario
      if (isEditing) {
        // Si se está editando, solo asigna la contraseña si se cambió
        formData.Primer_Ingreso = 1;
        if (formData.Contrasena) {
          // Aquí ya no se hashea la contraseña
        } else {
          // Eliminar la contraseña del objeto formData si no se ha cambiado
          delete formData.Contrasena;
        }
        const response = await fetch(`/api/usuarios`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.error) {
            throw new Error(errorData.error); // Mostrar el mensaje de error específico
          }
          throw new Error("Error al actualizar el usuario");
        }

        toast.success("Usuario actualizado exitosamente",
          {
            style: {
              backgroundColor: '#e6ffed', // Fondo verde suave
              color: '#2e7d32', // Texto verde oscuro
              fontWeight: 'bold',
              border: '1px solid #a5d6a7', // Borde verde claro
              padding: '16px',
              borderRadius: '12px',
            },
            position: 'top-right', // Posición en la esquina superior derecha
            autoClose: 5000, // Cierra automáticamente en 5 segundos
            hideProgressBar: true, // Ocultar barra de progreso
          }
        );
        
      } else {

        if (!validateEmail(formData.Correo)) {
          toast.error("El correo electrónico no es válido. Usa un formato correcto (ejemplo: nombre@dominio.com).");
          return;
      }

      if (!validatePasswordDetails(formData.Contrasena)) {
          toast.error("La contraseña debe ser fuerte (mayúsculas, minúsculas, números y caracteres especiales).");
          return;
      }

      if (formData.Contrasena !== formData.ConfirmarContrasena) {
          toast.error("Las contraseñas no coinciden.");
          return;
      }


        // Lógica para crear un nuevo usuario
// 1. Verificar si el usuario o el correo ya existen con un GET
const { userExists, emailExists } = await checkUserOrEmailExists(formData.Usuario, formData.Correo);

if (userExists) {
    toast.error("El usuario ya existe. Prueba con otro nombre.");
    return;
}

if (emailExists) {
    toast.error("El correo ya está registrado. Usa otro correo.");
    return;
}


        const response = await fetch("/api/usuarios", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.error) {
            throw new Error(errorData.error); // Mostrar el mensaje de error específico
          }
          throw new Error("Error al crear el usuario");
        }

        // Ya no se hashea la contraseña aquí
        toast.success("Usuario agregado exitosamente",
          {
            style: {
              backgroundColor: '#e6ffed', // Fondo verde suave
              color: '#2e7d32', // Texto verde oscuro
              fontWeight: 'bold',
              border: '1px solid #a5d6a7', // Borde verde claro
              padding: '16px',
              borderRadius: '12px',
            },
            position: 'top-right', // Posición en la esquina superior derecha
            autoClose: 5000, // Cierra automáticamente en 5 segundos
            hideProgressBar: true, // Ocultar barra de progreso
          }
        );
        
      }

      fetchUsers();
      resetForm();
    } catch (error) {
      toast.error("Error al guardar el usuario:", error);
      toast.error(error.message);
     
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const currentDate = new Date().toISOString();
        formData.Fecha_Ultima_Conexion = currentDate;

        // 🔍 Validación del nombre de usuario
        if (!validateUsername(formData.Usuario)) {
            toast.error("El nombre de usuario debe tener entre 3 y 20 caracteres y no contener caracteres especiales.");
            return;
        }

        if (!validatePasswordDetails(formData.Contrasena)) {
            toast.error("La contraseña no cumple con los requisitos.");
            return;
        }

        if (formData.Contrasena !== formData.ConfirmarContrasena) {
            toast.error("Las contraseñas no coinciden.");
            return;
        }

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

        let response;
        if (isEditing) {
            formData.Primer_Ingreso = 1;
            if (!formData.Contrasena) {
                delete formData.Contrasena;
                delete formData.ConfirmarContrasena;
            }

            response = await fetch(`/api/usuarios`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

        } else {
            response = await fetch("/api/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
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

  const checkUserExists = async (usuario) => {
    const response = await axios.get(`/api/usuarios?usuario=${usuario}`);
    return response.data.exists;
}

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
    <div className="p-8 mt-4 bg-gray-100 flex space-x-8">
      {/* Columna izquierda: Formulario */}
      <div className="w-1/3 bg-white p-6 rounded-lg shadow-md items-center">
        <center>
          <h2 className="text-2xl font-semibold mb-4">
            {isEditing ? "Editar Usuario" : "Agregar Usuario"}
          </h2>
        </center>
        <form onSubmit={handleSubmit}>
          <div className="relative mb-4">
            <input
              type="text"
              name="Usuario"
              value={formData.Usuario}
              onChange={handleInputChange}
              required
              className="peer pt-4 pl-1 pb-1 w-full border-b border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent uppercase text-gray-900"
              placeholder=" aaa"
              style={{ textTransform: "uppercase" }}
            />
            <label
              className={`absolute left-1 top-1 transition-all duration-200 transform ${
                formData.Usuario
                  ? "text-gray-500 -translate-y-1 scale-100 text-xs"
                  : "text-gray-400"
              }`}
            >
              Usuario
            </label>
          </div>

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
            <label
              className={`absolute left-1 top-1 transition-all duration-200 transform ${
                formData.Nombre_Usuario
                  ? "text-gray-500 -translate-y-1 scale-100 text-xs"
                  : "text-gray-400"
              }`}
            >
              Nombre Completo
            </label>
          </div>

          <div className="relative mb-4">
            <input
              type="email"
              name="Correo"
              value={formData.Correo}
              onChange={handleInputChange}
              required
               className="peer pt-4 pl-1 pb-1 w-full border-b border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent  text-gray-900"
            
              placeholder=" "
            />
            <label
              className={`absolute left-1 top-1 transition-all duration-200 transform ${
                formData.Correo
                  ? "text-gray-500 -translate-y-1 scale-100 text-xs"
                  : "text-gray-400"
              }`}
            >
              Correo Electrónico
            </label>
          </div>

          <div className="relative mb-4">
      <input
        type={showPassword ? "text" : "password"}
        name="Contrasena"
        value={formData.Contrasena}
        onChange={handlePasswordChange} // 

        className="peer pt-4 pl-1 pb-1 w-full border-b border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent  text-gray-900"
        placeholder=""
        required={!isEditing}
      />


 {/* Lista de validaciones */}
 <ul className="mt-2 text-sm">
    {passwordValidation?.map(({ label, passed }, index) => (
        <li key={index} className={passed ? "text-green-600" : "text-red-600"}>
            {passed ? "✔️" : "❌"} {label}
        </li>
    ))}
</ul>
      <label
                  className={`absolute left-1 top-1 transition-all duration-200 transform ${
          formData.Contrasena
                  ? "text-gray-500 -translate-y-1 scale-100 text-xs"
            : "text-gray-400"
        }`}
      >
        Contraseña
      </label>
      
      {/* Botón de mostrar/ocultar */}
      <button
        type="button"
        className="absolute right-3 top-4 text-gray-600 hover:text-gray-900 focus:outline-none"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeSlashIcon className="w-5 h-5" />
        ) : (
          <EyeIcon className="w-5 h-5" />
        )}
      </button>
    </div>
    <div className="relative mb-4">
      <input
        type={showPassword2 ? "text" : "password"}
        name="ConfirmarContrasena"
        value={formData.ConfirmarContrasena}
        onChange={handleInputChange}
        className="peer pt-4 pl-1 pb-1 w-full border-b border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent  text-gray-900"
        placeholder=""
        required={!isEditing}
      />
      <label
                  className={`absolute left-1 top-1 transition-all duration-200 transform ${
          formData.Contrasena
                  ? "text-gray-500 -translate-y-1 scale-100 text-xs"
            : "text-gray-400"
        }`}
      >
               Confirmar Contraseña
      </label>
      
      {/* Botón de mostrar/ocultar */}
      <button
        type="button"
        className="absolute right-3 top-4 text-gray-600 hover:text-gray-900 focus:outline-none"
        onClick={() => setShowPassword2(!showPassword2)}
      >
        {showPassword2 ? (
          <EyeSlashIcon className="w-5 h-5" />
        ) : (
          <EyeIcon className="w-5 h-5" />
        )}
      </button>
    </div>
          <label
            htmlFor="Id_Rol"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
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
            {roles
              .filter((role) => role.Estado === 1) // Filtra para mostrar solo roles activos
              .map((role) => (
                <option key={role.Id_Rol} value={role.Id_Rol}>
                  {role.Rol}
                </option>
              ))}
          </select>

          <label
            htmlFor="Id_EstadoUsuario"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
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
              <option
                key={state.Id_EstadoUsuario}
                value={state.Id_EstadoUsuario}
              >
                {state.Descripcion}
              </option>
            ))}
          </select>
          <div className="flex justify-end">
  {isEditing
    ? // Mostrar botón "Actualizar" solo si tiene permisos de actualización
      permisos.Permiso_Actualizar === "1" && (
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Actualizar
        </button>
      )
    : // Mostrar botón "Registrar" solo si tiene permisos de inserción
      permisos.Permiso_Insertar === "1" && (
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Agregar
        </button>
      )}

  <button
    type="button"
    onClick={resetForm}
    className="ml-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
  >
    Cancelar
  </button>
</div>

        </form>
      </div>

      {/* Columna derecha: Tabla de Usuarios */}
      <div className="w-2/3">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Listado de Usuarios
        </h2>
        <div className="mb-4">
          {/*Barra de busqueda */}
          <center>
            {" "}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-3 pl-10 pr-4 border border-gray-900 rounded-lg w-1/2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Buscar por nombre o correo"
            />
          </center>
          <br></br>
          <div className="flex justify-end space-x-4 mb-4">
            {/* Botón para exportar */}
            <button
              onClick={exportToExcel}
              className="bg-lime-600 text-white py-2 px-4 rounded hover:bg-lime-900 transition duration-200"
            >
              <strong>Exportar a Excel</strong>
            </button>
            {/* Botón para ir a asignar permisos */}
            <button
              onClick={() => router.push("/permisos")}
              className="bg-cyan-900 text-white px-3 py-1 rounded hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-red-400 ml-2"
            >
              <strong>Ver Permisos</strong>
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
            {filteredUsers
              .slice(indexOfFirstUser, indexOfLastUser)
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
      onClick={() => handleDelete(user.Id_Usuario)}
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
              ))}
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
    </div>
  );
};

export default UsersManagement;
