import { useEffect, useRef, useState } from 'react';

export default function FotoCarnetUpload({ idEstudiante,onFotoActualizada}) {
  const [fotoBase64, setFotoBase64] = useState(null);
  const [streamActivo, setStreamActivo] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [capturaPrevia, setCapturaPrevia] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const puedeEditar = !!idEstudiante;

  // Cargar la foto actual
  useEffect(() => {
    if (!puedeEditar) return;

    const cargarFoto = async () => {
      const res = await fetch(`/api/estudiantes/FotoCarnet?id=${idEstudiante}`);
      const data = await res.json();
      if (data?.foto_carnet) setFotoBase64(data.foto_carnet);
      onFotoActualizada?.(data.foto_carnet); // ⬅️ Lo mandas al padre
    };

    cargarFoto();
  }, [idEstudiante]);

  // Activar cámara
  const abrirModal = async () => {
    setModalAbierto(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setStreamActivo(true);
    } catch (err) {
      console.error('No se pudo acceder a la cámara:', err);
    }
  };

  const cerrarModal = () => {
    try {
      const video = videoRef.current;
      if (video && video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach((track) => track.stop()); // 🔌 Detiene video y audio
        video.srcObject = null; // ❌ Limpia el objeto
      }
    } catch (err) {
      console.warn('Error al cerrar cámara:', err);
    }
  
    setStreamActivo(false);
    setCapturaPrevia(null);
    setModalAbierto(false);
  };
  
  useEffect(() => {
    return () => {
      // 🔒 Se ejecuta al desmontar el componente
      const video = videoRef.current;
      if (video && video.srcObject) {
        video.srcObject.getTracks().forEach((track) => track.stop());
        video.srcObject = null;
      }
    };
  }, []);
  

  const tomarFotoold = () => {
    const canvas = canvasRef.current;
    canvas.width = 200;
    canvas.height = 250;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL('image/jpeg', 0.6);
    setCapturaPrevia(base64);
  };


  const tomarFoto = () => {
    const canvas = canvasRef.current;
    canvas.width = 200;
    canvas.height = 250;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
  
    const base64 = canvas.toDataURL('image/jpeg', 0.6);
    setCapturaPrevia(base64);
  
    // 🔌 Detener cámara después de tomar la foto
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  
    setStreamActivo(false); // 👈 importante para que no intente volver a usar la cámara
  };
  


  const guardarFoto = async () => {
    if (!capturaPrevia) return;
    const limpio = capturaPrevia.replace(/^data:image\/\w+;base64,/, '');
    setFotoBase64(limpio);

    await fetch('/api/estudiantes/FotoCarnet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idEstudiante, imagen: capturaPrevia }),
    });
    console.log('Tamaño del payload:', JSON.stringify({ idEstudiante, imagen: capturaPrevia }).length, 'caracteres');

    cerrarModal();
  };

  const seleccionarArchivo = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result;
      const limpio = base64.replace(/^data:image\/\w+;base64,/, '');
      setFotoBase64(limpio);
      await fetch('/api/estudiantes/FotoCarnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idEstudiante, imagen: base64 }),
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center justify-center gap-4">
      {/* Botones */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={abrirModal}
          disabled={!puedeEditar}
          className="text-xs px-2 py-1 border rounded bg-white shadow disabled:opacity-50"
        >
          📷
        </button>
        <label className="text-xs px-2 py-1 border rounded bg-white shadow cursor-pointer">
          📂
          <input
            type="file"
            accept="image/*"
            onChange={seleccionarArchivo}
            hidden
            disabled={!puedeEditar}
          />
        </label>
      </div>

      {/* Vista previa */}
      <div
        className="w-[100px] h-[125px] border rounded overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: puedeEditar ? '#f9f9f9' : '#ddd' }}
      >
        {puedeEditar ? (
          fotoBase64 ? (
            <img
              src={`data:image/jpeg;base64,${fotoBase64}`}
              alt="Foto carnet"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[10px] text-gray-500">Sin foto</span>
          )
        ) : (
          <span className="text-[10px] text-center text-gray-600 px-2">
            Debe guardar primero al estudiante
          </span>
        )}
      </div>

      {/* Modal de cámara */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 shadow-lg text-center w-[300px]">
            <h3 className="text-sm font-semibold mb-2">Captura de Foto</h3>

            {!capturaPrevia ? (
              <video ref={videoRef} autoPlay className="w-full h-[250px] object-cover rounded" />
            ) : (
              <img src={capturaPrevia} alt="Preview" className="w-full h-[250px] object-cover rounded" />
            )}

            <div className="flex justify-between mt-3">
              {!capturaPrevia ? (
                <button        type="button"
                onClick={tomarFoto} className="px-3 py-1 bg-blue-500 text-white rounded text-sm">Tomar</button>
              ) : (
                <button       type="button"
                onClick={guardarFoto} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Guardar</button>
              )}
              <button        type="button"
 onClick={cerrarModal} className="px-3 py-1 bg-gray-300 rounded text-sm">Cancelar</button>
            </div>

            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        </div>
      )}
    </div>
  );
}
