import { MagnifyingGlassIcon, UserPlusIcon, ArrowDownCircleIcon } from "@heroicons/react/24/solid";

const SearchBar = ({ 
  title, 
  titleIcon: TitleIcon, 
  searchQuery, 
  setSearchQuery, 
  handleClearSearch, 
  onAdd = () => {}, // Función vacía si no se pasa
  onExport, 
  onAddParams,  
  onExportParams,  
  addParams = [],  
  exportParams = [] 
}) => {
  return (
    <div className="mb-4 flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow-md">
      
      {/* Barra de búsqueda */}
      <div className="relative max-w-md w">
        {/* Ícono de búsqueda 🔍 */}
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
          <MagnifyingGlassIcon className="h-6 w-6 text-gray-500" />
        </div>

        {/* Input con efecto de label */}
        <input
          type="text"
          id="searchInput"
          value={searchQuery.general || ""}
          onChange={(e) =>
            setSearchQuery((prev) => ({ ...prev, general: e.target.value }))
          }
          placeholder="Buscar"
          className="w h-10 pl-10 pr-8 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none peer"
        />

        {/* Label animado */}
        {searchQuery.general && (
          <label
            htmlFor="searchInput"
            className="absolute left-10 transition-all text-gray-500 text-xs -top-2 bg-white px-1"
          >
            Buscar
          </label>
        )}

        {/* Botón de limpiar ❌ */}
        {searchQuery.general && (
          <button
            onClick={handleClearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600 transition-colors"
          >
            ❌
          </button>
        )}
      </div>

      {/* Título de la sección */}
      <p className="text-2xl font-bold text-blue-700 flex items-center">
        {TitleIcon && <TitleIcon className="h-6 w-6 mr-2" />} 📋 {title}
      </p>

      {/* Botones de acciones */}
      <div className="flex gap-x-2">
        {/* Botón para agregar (Siempre se muestra) */}
        <button
          onClick={onAdd}
          className="flex items-center bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-md"
        >
          <UserPlusIcon className="h-5 w-5 mr-2" /> Agregar
        </button>

        {/* Botón para agregar con parámetros */}
        {onAddParams && (
          <button
            onClick={() => onAddParams(...addParams)}
            className="flex items-center bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-md"
          >
            <UserPlusIcon className="h-5 w-5 mr-2" /> Agregar con params
          </button>
        )}

        {/* Botón para exportar (sin parámetros) */}
        {onExport && (
          <button
            onClick={onExport}
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors shadow-md"
          >
            <ArrowDownCircleIcon className="h-5 w-5 mr-2" /> Exportar
          </button>
        )}

        {/* Botón para exportar con parámetros */}
        {onExportParams && (
          <button
            onClick={() => onExportParams(...exportParams)}
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors shadow-md"
          >
            <ArrowDownCircleIcon className="h-5 w-5 mr-2" /> Exportar con params
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
