import React, { useState, useEffect } from "react";
import "./App.css";
import HeatMap from "./HeatMap";
import moment from "moment-timezone";

function App() {
  const [modo, setModo] = useState("realTime");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [roomsData, setRoomsData] = useState([]);
  const [temporizador, setTemporizador] = useState(1); // Inicializa con 5 segundos para el ejemplo
  const [intervalo, setIntervalo] = useState(1); // Configuración del intervalo de actualización en segundos

  const fetchRoomsData = async () => {
    let url = "https://usacarqui2api.site/usosHabitacion"; // Asegúrate de usar tu URL correcta

    // Construir los parámetros de la consulta basados en el modo
    const params = new URLSearchParams();
    if (modo === "realTime") {
      const hoy = moment().tz("America/Belize").format("YYYY-MM-DD");
      params.append("fecha", hoy);
    } else {
      if (fechaInicio) params.append("fechaInicio", fechaInicio);
      if (fechaFin) params.append("fechaFin", fechaFin);
    }
    params.append("modo", modo);

    try {
      const response = await fetch(`${url}?${params}`);
      const data = await response.json();
      setRoomsData(data); // Asegúrate de que la API devuelva un arreglo
    } catch (error) {
      console.error("Error al obtener los datos de la API:", error);
    }
  };

  useEffect(() => {
    fetchRoomsData();
  }, [modo, fechaInicio, fechaFin]);

  useEffect(() => {
    let intervalId;

    if (modo === "realTime") {
      intervalId = setInterval(() => {
        setTemporizador((prevTemporizador) => prevTemporizador - 1);
      }, 1000);

      fetchRoomsData(); // Llamada inicial para cargar datos inmediatamente
    }

    return () => clearInterval(intervalId);
  }, [modo]);

  useEffect(() => {
    if (temporizador === 0 && modo === "realTime") {
      fetchRoomsData();
      setTemporizador(intervalo); // Reinicia el temporizador
    }
  }, [temporizador, modo, intervalo]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Proyecto 1 ACYE2</h1>
        <div>
          <label>Intervalo de actualización (segundos):</label>
          <input
            type="number"
            value={intervalo}
            onChange={(e) => setIntervalo(Number(e.target.value))}
          />
        </div>
      </header>
      <div>
        <label>Modo:</label>
        <select value={modo} onChange={(e) => setModo(e.target.value)}>
          <option value="realTime">Tiempo Real</option>
          <option value="historico">Histórico</option>
        </select>
      </div>
      {modo === "historico" && (
        <div>
          <label>Fecha Inicio:</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
          <label>Fecha Fin:</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>
      )}
      <div className="heatmap-container">
        {roomsData.map((room) => (
          <div key={room.habitacion} className="individual-heatmap">
            <h3>Habitacion {room.habitacion}</h3>
            <HeatMap data={room.matriz} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
