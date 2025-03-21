const Pagination = ({
    currentPage,
    totalItems,
    itemsPerPage,
    setPage,
    setItemsPerPage,
    prevPage,
    nextPage
  }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const visiblePages = 5; // Cantidad de páginas visibles antes de usar "..."
  
    const getPageNumbers = () => {
      const pages = [];
      const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
      const endPage = Math.min(totalPages, startPage + visiblePages - 1);
  
      if (startPage > 1) pages.push(1); // Primera página
      if (startPage > 2) pages.push("..."); // Indicador de omisión
  
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
  
      if (endPage < totalPages - 1) pages.push("..."); // Indicador de omisión
      if (endPage < totalPages) pages.push(totalPages); // Última página
  
      return pages;
    };
  
    return (
      <div className="flex justify-between items-center mt-4">
        {/* Selección de cantidad de elementos por página */}
        <div className="flex items-center">
          <span className="mr-2 text-gray-700">Mostrar:</span>
          <select
            className="border border-gray-300 rounded-md px-2 py-1"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setPage(1); // Reinicia a la página 1 al cambiar cantidad
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
  
        {/* Paginación */}
        <div className="flex space-x-2">
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
  
          {/* Números de página */}
          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span key={index} className="px-4 py-2 text-gray-500">
                ...
              </span>
            ) : (
              <button
                key={index}
                onClick={() => setPage(page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 transform ${
                  currentPage === page
                    ? "bg-blue-500 text-white shadow-lg scale-105"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none"
                }`}
              >
                {page}
              </button>
            )
          )}
  
          {/* Botón "Siguiente" */}
          <button
            onClick={nextPage}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 transform ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white-600 text-black shadow-md hover:bg-gray-200 focus:outline-none"
            }`}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      </div>
    );
  };
  
  export default Pagination;
  