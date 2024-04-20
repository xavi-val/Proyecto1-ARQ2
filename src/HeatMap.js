import React, { useEffect, useState } from "react";
import "./HeatMap.css";

const HeatMap = ({ data }) => {
  const [colorMap, setColorMap] = useState([]);

  // Función para interpolar colores
  const interpolateColor = (color1, color2, factor) => {
    let result = color1.slice(1).match(/.{2}/g).map((hex) => parseInt(hex, 16))
                 .map((val, i) => {
                   return Math.floor(val + (parseInt(color2.slice(1).match(/.{2}/g)[i], 16) - val) * factor);
                 })
                 .map((val) => {
                   return ('0' + val.toString(16)).slice(-2);
                 });
    return `#${result.join('')}`;
  };

  // Calcula el color de cada celda basándose en el valor
  const computeColorMap = (data) => {
    let minValue = Math.min(...data);
    let maxValue = Math.max(...data);

    if (minValue === maxValue){
        minValue = 0;
        maxValue = 1;
    };

    const colorPoints = [
      { value: minValue, color: "#cacaca" },
      { value: minValue + (maxValue - minValue) * 0.25, color: "#f1d714" },
      { value: minValue + (maxValue - minValue) * 0.50, color: "#FFA500" },
      { value: minValue + (maxValue - minValue) * 0.75, color: "#FF0000" },
      { value: maxValue, color: "#000000" },
    ];

    return data.map(value => {
      for (let i = 0; i < colorPoints.length - 1; i++) {
        if (value >= colorPoints[i].value && value <= colorPoints[i + 1].value) {
          const factor = (value - colorPoints[i].value) / (colorPoints[i + 1].value - colorPoints[i].value);
          return interpolateColor(colorPoints[i].color, colorPoints[i + 1].color, factor);
        }
      }
      return colorPoints[colorPoints.length - 1].color;
    });
  };

  // Efecto para recalcular el mapa de colores cuando los datos cambian
  useEffect(() => {
    setColorMap(computeColorMap(data));
  }, [data]); // Dependencias del useEffect, observa cambios en 'data'

  return (
    <div className="heat-map">
      {data.map((value, index) => (
        <div
          key={index}
          className="heat-map-cell"
          style={{ backgroundColor: colorMap[index] || '#FFFFFF' }}
        >
          {value}
        </div>
      ))}
    </div>
  );
};

export default HeatMap;
