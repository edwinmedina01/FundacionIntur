import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { getBase64ImageFromUrl } from './getBase64ImageFromUrl';
export const exportToExcel = async ({ fileName, title, headers, data, searchQuery = {} }) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(title);

    // 📌 **Obtener la Imagen en Base64**
    const logoBase64 = await getBase64ImageFromUrl("/img/intur.png");
    const imageId = workbook.addImage({
        base64: logoBase64,
        extension: "png",
    });

    // 📌 **Insertar el Logo en la Esquina Izquierda**
    worksheet.addImage(imageId, {
        tl: { col: 0, row: 0 }, // Posición en la celda A1
        ext: { width: 120, height: 50 }, // Tamaño del logo
    });

    // 📌 **Insertar el Título en la Fila 1**
    worksheet.mergeCells("B1", `${String.fromCharCode(65 + headers.length)}1`);
    worksheet.getCell("B1").value = title;
    worksheet.getCell("B1").font = { bold: true, size: 16 };
    worksheet.getCell("B1").alignment = { horizontal: "center", vertical: "middle" };

    // 📌 **Fecha de Exportación en la Fila 2**
    worksheet.mergeCells("B2", `${String.fromCharCode(65 + headers.length)}2`);
    worksheet.getCell("B2").value = `Fecha de Exportación: ${new Date().toLocaleDateString("es-ES")}`;
    worksheet.getCell("B2").font = { italic: true, size: 12 };
    worksheet.getCell("B2").alignment = { horizontal: "center", vertical: "middle" };

    // 📌 **Criterios de Búsqueda en la Fila 3**
    const filterCriteria = Object.entries(searchQuery || {})
        .filter(([_, value]) => value)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ") || "Sin filtros";

    worksheet.mergeCells("B3", `${String.fromCharCode(65 + headers.length)}3`);
    worksheet.getCell("B3").value = `Criterios de Búsqueda: ${filterCriteria}`;
    worksheet.getCell("B3").font = { italic: true, size: 12 };
    worksheet.getCell("B3").alignment = { horizontal: "center", vertical: "middle" };

    // 📌 **Agregar una Fila Vacía en la Fila 4 para Separar los Encabezados**
    worksheet.getRow(4).values = [];
     // 📌 **Agregar la columna "Número" antes de los demás encabezados**
     const modifiedHeaders = [{ header: "Número", key: "Numero", width: 10 }, ...headers];


    // 📌 **Definir Encabezados desde la Fila 5**
    const headerRow = worksheet.getRow(5);
    headerRow.values = modifiedHeaders.map((h) => h.header);
    headerRow.font = { bold: true, color: { argb: "FFFFFF" } };
    headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "007ACC" } };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };
    headerRow.border = { top: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" }, bottom: { style: "thin" } };

    // 📌 **Aplicar anchos de columnas**
    headers.forEach((col, index) => {
        worksheet.getColumn(index + 1).width = col.width;
    });

    // 📌 **Agregar Datos al Excel (A partir de la fila 6)**
    let rowIndex = 6;
    data.forEach((item,index) => {
        const rowData = [index + 1, ...headers.map((h) => item[h.key] || "-")];
        const row = worksheet.addRow(rowData);

        // Ajustar alineación en la columna de ID si es necesario
        row.getCell(1).alignment = { horizontal: "center" };
        row.getCell(2).alignment = { horizontal: "center" };
        rowIndex++; 
    });

    // 📌 **Descargar el Archivo**
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, fileName);
};
