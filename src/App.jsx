import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [buses, setBuses] = useState([]);
  const [page, setPage] = useState(0); // página actual
  const [totalPages, setTotalPages] = useState(0); // total de páginas

  //  Obtener buses con paginación
  useEffect(() => {
    fetch(`http://localhost:8080/api/v1/buses?page=${page}&size=5`)
      .then(res => res.json())
      .then(data => {
        console.log("DATA DEL BACKEND:", data);
        setBuses(data.content || []);
        setTotalPages(data.totalPages); 
      })
      .catch(error => {
        console.error("Error al obtener los buses:", error);
        setBuses([]);
        setTotalPages(0);
      });
  }, [page]); // <- se actualiza cuando cambia la página

 
  const handleClick = (id) => {
    fetch(`http://localhost:8080/api/v1/bus/${id}`)
      .then(res => res.json())
      .then(data => {
        alert(
          `🚌 Detalles del Bus:
            - ID: ${data.id}
            - Número: ${data.numero}
            - Placa: ${data.placa}
            - Marca: ${data.marca.nombre}
            - Estado: ${data.activo ? 'Activo' : 'Inactivo'}
            - Características: ${data.caracteristicas}
            - Fecha de creación: ${data.fechaCreacion}`
        );
      })
      .catch(error => {
        console.error("Error al obtener el bus:", error);
        alert("No se pudo obtener los detalles del bus.");
      });
  };

 
  const handlePrevious = () => {
    if (page > 0) setPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (page < totalPages - 1) setPage(prev => prev + 1);
  };

  return (
    <div className="app-container">
      <h1>🚌 Lista de Buses</h1>

      <div className="bus-table-container">
        <table className="bus-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Placa</th>
              <th>Fecha de creación</th>
              <th>Características</th>
              <th>Marca</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {buses.map(bus => (
              <tr
                key={bus.id}
                onClick={() => handleClick(bus.id)}
                style={{ cursor: 'pointer' }}
              >
                <td>{bus.id}</td>             
                <td>{bus.placa}</td>
                <td>{bus.fechaCreacion}</td>
                <td>{bus.caracteristicas}</td>
                <td>{bus.marca.nombre}</td>
                <td>{bus.activo ? 'Activo' : 'Inactivo'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔢 Controles de paginación */}
      <div className="pagination-controls">
        <button onClick={handlePrevious} disabled={page === 0}>⬅️ Anterior</button>
        <span>Página {page + 1} de {totalPages}</span>
        <button onClick={handleNext} disabled={page >= totalPages - 1}>Siguiente ➡️</button>
      </div>
    </div>
  );
}

export default App;