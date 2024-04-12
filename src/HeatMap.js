import React from "react";
import "./HeatMap.css";

const HeatMap = ({ data }) => {
  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);

  // Interpola linealmente entre dos colores
  const interpolateColor = (color1, color2, factor) => {
    let result = color1.slice(1).match(/.{2}/g).map((hex) => parseInt(hex, 16))
                 .map((val, i) => {
                   return Math.floor(val + (parseInt(color2.slice(1).match(/.{2}/g)[i], 16) - val) * factor);
                 })
                 .map((val) => {
                   return ('0' + val.toString(16)).slice(-2); // Asegura dos dígitos hexadecimales
                 });
    return `#${result.join('')}`;
  };

  // Define puntos de referencia para los valores y colores
  const colorPoints = [
    { value: minValue, color: "#cacaca" }, // Blanco
    { value: minValue + (maxValue - minValue) * 0.25, color: "#f1d714" }, // Amarillo
    { value: minValue + (maxValue - minValue) * 0.50, color: "#FFA500" }, // Naranja
    { value: minValue + (maxValue - minValue) * 0.75, color: "#FF0000" }, // Rojo
    { value: maxValue, color: "#000000" }, // Negro
  ];

  // Determina el color basado en el valor usando interpolación entre puntos de referencia
  const colorScale = (value) => {
    for (let i = 0; i < colorPoints.length - 1; i++) {
      if (value >= colorPoints[i].value && value <= colorPoints[i + 1].value) {
        const factor = (value - colorPoints[i].value) / (colorPoints[i + 1].value - colorPoints[i].value);
        return interpolateColor(colorPoints[i].color, colorPoints[i + 1].color, factor);
      }
    }
    return colorPoints[colorPoints.length - 1].color; // Devuelve negro si el valor excede el máximo
  };

  return (
    <div className="heat-map">
      {data.map((value, index) => (
        <div
          key={index}
          className="heat-map-cell"
          style={{ backgroundColor: colorScale(value) }}
        >
          {value}
        </div>
      ))}
    </div>
  );
};

export default HeatMap;
