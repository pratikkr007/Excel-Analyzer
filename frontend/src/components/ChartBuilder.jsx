import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  BarChart, Bar, LineChart, Line, ScatterChart, Scatter, 
  PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import Plot from "react-plotly.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./ChartBuilder.css";

function ChartBuilder() {
  const file = useSelector((state) => state.analysis.file);
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [zAxis, setZAxis] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [chartTitle, setChartTitle] = useState("My Chart");
  const [colorScheme, setColorScheme] = useState("default");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (file) {
      setIsLoading(true);
      import("xlsx").then((XLSX) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const workbook = XLSX.read(new Uint8Array(e.target.result), { type: "array" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(sheet);
          setData(json);
          setColumns(Object.keys(json[0] || {}));
          setIsLoading(false);
        };
        reader.readAsArrayBuffer(file);
      });
    }
  }, [file]);

  const colorSchemes = {
    default: ["#8884d8", "#82ca9d", "#ff8042", "#0088FE", "#00C49F", "#FFBB28", "#FF8042"],
    pastel: ["#a3d9ff", "#b6e6bd", "#ffcf9e", "#ffb3c1", "#d8bfff", "#97f2f3", "#ffdf90"],
    vibrant: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#f9c80e", "#f86624", "#791e94", "#2de1c2"]
  };

  const getColors = () => {
    return colorSchemes[colorScheme] || colorSchemes.default;
  };

  // 📌 Download as PNG/PDF
  const downloadChart = async (type) => {
    const chartElement = document.querySelector(".chart-container");
    if (!chartElement) return;

    const canvas = await html2canvas(chartElement, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    if (type === "png") {
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `${chartTitle || "chart"}.png`;
      link.click();
    } else if (type === "pdf") {
      const pdf = new jsPDF("landscape");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 20, pdfWidth, pdfHeight);
      pdf.save(`${chartTitle || "chart"}.pdf`);
    }
  };

  const renderChart = () => {
    if (!xAxis || !yAxis || !chartType) return (
      <div className="chart-placeholder">
        <div className="placeholder-icon">📊</div>
        <p>Select X-axis, Y-axis, and chart type to visualize your data</p>
      </div>
    );

    const colors = getColors();

    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={yAxis} fill={colors[0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case "line":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={yAxis} stroke={colors[1]} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      case "area":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey={yAxis} stroke={colors[2]} fill={colors[2]} fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        );
      case "scatter":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid />
              <XAxis dataKey={xAxis} name={xAxis} />
              <YAxis dataKey={yAxis} name={yAxis} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter data={data} fill={colors[3]} />
            </ScatterChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Tooltip />
              <Legend />
              <Pie
                data={data}
                dataKey={yAxis}
                nameKey={xAxis}
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                label
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );
      case "3d":
        return (
          <div className="plotly-container">
            <Plot
              data={[
                {
                  x: data.map((d) => d[xAxis]),
                  y: data.map((d) => d[yAxis]),
                  z: zAxis ? data.map((d) => d[zAxis]) : data.map((_, i) => i),
                  mode: "markers",
                  type: "scatter3d",
                  marker: { 
                    size: 5, 
                    color: data.map((_, i) => i),
                    colorscale: 'Viridis'
                  }
                }
              ]}
              layout={{ 
                width: 700, 
                height: 500, 
                title: chartTitle,
                scene: {
                  xaxis: { title: xAxis },
                  yaxis: { title: yAxis },
                  zaxis: { title: zAxis || "Index" }
                }
              }}
            />
          </div>
        );
      default:
        return <p>Select a valid chart type.</p>;
    }
  };

  if (!file) {
    return (
      <div className="chart-builder-page">
        <div className="no-file-message">
          <div className="message-icon">📁</div>
          <h2>No Data File Uploaded</h2>
          <p>Please upload an Excel file to start building charts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-builder-page">
      <div className="chart-builder-container">
        <div className="chart-builder-header">
          <h2>Chart Builder</h2>
          <p>Visualize your data with interactive charts</p>
        </div>

        {isLoading ? (
          <div className="loading-data">
            <div className="spinner"></div>
            <p>Processing your data...</p>
          </div>
        ) : (
          <div className="chart-builder-content">
            <div className="controls-panel">
              <div className="control-group">
                <h3>Chart Settings</h3>
                
                <div className="form-group">
                  <label>Chart Title</label>
                  <input 
                    type="text" 
                    value={chartTitle} 
                    onChange={(e) => setChartTitle(e.target.value)}
                    placeholder="Enter chart title"
                  />
                </div>

                <div className="form-group">
                  <label>X-axis</label>
                  <select value={xAxis} onChange={(e) => setXAxis(e.target.value)}>
                    <option value="">Select X-axis</option>
                    {columns.map((col, i) => (
                      <option key={i} value={col}>{col}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Y-axis</label>
                  <select value={yAxis} onChange={(e) => setYAxis(e.target.value)}>
                    <option value="">Select Y-axis</option>
                    {columns.map((col, i) => (
                      <option key={i} value={col}>{col}</option>
                    ))}
                  </select>
                </div>

                {chartType === "3d" && (
                  <div className="form-group">
                    <label>Z-axis (optional)</label>
                    <select value={zAxis} onChange={(e) => setZAxis(e.target.value)}>
                      <option value="">Select Z-axis (or use index)</option>
                      {columns.map((col, i) => (
                        <option key={i} value={col}>{col}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label>Chart Type</label>
                  <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
                    <option value="bar">Bar Chart</option>
                    <option value="line">Line Chart</option>
                    <option value="area">Area Chart</option>
                    <option value="scatter">Scatter Plot</option>
                    <option value="pie">Pie Chart</option>
                    <option value="3d">3D Plot</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Color Scheme</label>
                  <select value={colorScheme} onChange={(e) => setColorScheme(e.target.value)}>
                    <option value="default">Default</option>
                    <option value="pastel">Pastel</option>
                    <option value="vibrant">Vibrant</option>
                  </select>
                </div>
              </div>

              <div className="data-preview">
                <h3>Data Preview</h3>
                <div className="preview-table">
                  <table>
                    <thead>
                      <tr>
                        {columns.slice(0, 4).map((col, i) => (
                          <th key={i}>{col}</th>
                        ))}
                        {columns.length > 4 && <th>...</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {data.slice(0, 5).map((row, i) => (
                        <tr key={i}>
                          {columns.slice(0, 4).map((col, j) => (
                            <td key={j}>{row[col]}</td>
                          ))}
                          {columns.length > 4 && <td>...</td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="preview-note">
                    Showing {Math.min(5, data.length)} of {data.length} rows · {columns.length} columns
                  </p>
                </div>
              </div>
            </div>

            <div className="chart-display">
              <div className="chart-header">
                <h3>{chartTitle}</h3>
                <div className="download-buttons">
                  <button onClick={() => downloadChart("png")}>⬇ PNG</button>
                  <button onClick={() => downloadChart("pdf")}>⬇ PDF</button>
                </div>
              </div>
              <div className="chart-container">
                {renderChart()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChartBuilder;
