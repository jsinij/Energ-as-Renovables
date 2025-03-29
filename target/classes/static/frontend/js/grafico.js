document.addEventListener('DOMContentLoaded', () => {
    const yearSelector = document.getElementById("yearSelector");
    const countrySelector = document.getElementById("countrySelector");
    const lineCountrySelector = document.getElementById("lineCountrySelector");
    const ctxPie = document.getElementById("myPieChart").getContext("2d");
    const ctxBar = document.getElementById("myBarChart").getContext("2d");
    const ctxLine = document.getElementById("myLineChart").getContext("2d");

    // Gráfica de torta
    let myPieChart = new Chart(ctxPie, {
        type: 'pie',
        data: {
            labels: ['Hidroeléctrica', 'Eólica', 'Solar'],
            datasets: [{
                label: 'Distribución de Energías Renovables',
                data: [0, 0, 0],
                backgroundColor: ['#9ACBD0', '#DDEB9D', '#DDA853'],
                borderColor: ['#ffffff', '#ffffff', '#ffffff'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: 'white',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Distribución de Energías Renovables',
                    color: 'white',
                    font: {
                        size: 20,
                        weight: 'bold'
                    },
                    padding: {
                        top: 20,
                        bottom: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.label + ': ' + tooltipItem.raw.toFixed(2) + '%';
                        }
                    }
                }
            }
        }
    });

    // Gráfica de barras
    let myBarChart = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: ['Hidroeléctrica', 'Eólica', 'Solar'],
            datasets: [{
                label: "Cantidad de Energía (TWh)",
                data: [0, 0, 0],
                backgroundColor: ['#9ACBD0', '#DDEB9D', '#DDA853'],
                borderColor: ['#ffffff', '#ffffff', '#ffffff'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'white',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                x: {
                    ticks: {
                        color: 'white',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    }
                },
                datalabels: {
                    color: 'white',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    formatter: function(value) {
                        return value.toFixed(2);
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });

    // Gráfica de líneas
    let myLineChart = new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: [], // Aquí se llenará con los años
            datasets: [
                {
                    label: 'Hidroeléctrica',
                    data: [],
                    borderColor: '#9ACBD0',
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'Eólica',
                    data: [],
                    borderColor: '#DDEB9D',
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'Solar',
                    data: [],
                    borderColor: '#DDA853',
                    fill: false,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: 'white',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'TWh producidos por año',
                    color: 'white',
                    font: {
                        size: 20,
                        weight: 'bold'
                    },
                    padding: {
                        top: 20,
                        bottom: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.label + ': ' + tooltipItem.raw.toFixed(2) + ' TWh';
                        }
                    }
                }
            }
        }
    });

    // Función para actualizar ambas gráficas
    function updateChart() {
        const pais = countrySelector.value;
        const anio = yearSelector.value;
        const endpoint = `http://localhost:8080/api/produccion/${pais}/${anio}`;

        fetch(endpoint)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    const total = data.hydro + data.wind + data.solar;
                    const porcentajes = total > 0
                        ? [
                            (data.hydro / total) * 100,
                            (data.wind / total) * 100,
                            (data.solar / total) * 100
                        ]
                        : [0, 0, 0];

                    // Actualizar la gráfica de torta
                    myPieChart.data.datasets[0].data = porcentajes;
                    myPieChart.update();

                    // Actualizar la gráfica de barras con TWh
                    myBarChart.data.datasets[0].data = [data.hydro, data.wind, data.solar];
                    myBarChart.update();
                } else {
                    alert("No hay datos para esa combinación");
                    myPieChart.data.datasets[0].data = [0, 0, 0];
                    myBarChart.data.datasets[0].data = [0, 0, 0];
                    myPieChart.update();
                    myBarChart.update();
                }
            })
            .catch(error => {
                console.error("Error al obtener los datos:", error);
                myPieChart.data.datasets[0].data = [0, 0, 0];
                myBarChart.data.datasets[0].data = [0, 0, 0];
                myPieChart.update();
                myBarChart.update();
            });
    }

    // Función para cargar los años en el selector
    function loadYears() {
        const endpoint = "http://localhost:8080/api/produccion/years";
        fetch(endpoint)
            .then(res => res.json())
            .then(data => {
                data.forEach(year => {
                    const option = document.createElement("option");
                    option.value = year;
                    option.textContent = year;
                    yearSelector.appendChild(option);
                });

                yearSelector.value = "2021";
                updateChart();
            })
            .catch(error => {
                console.error("Error al cargar los años:", error);
            });
    }

    // Función para actualizar el gráfico de líneas
    function updateLineChart() {
        const pais = lineCountrySelector.value;
        const endpoint = `http://localhost:8080/api/produccion/${pais}/serie`;

        fetch(endpoint)
            .then(response => response.json())
            .then(data => {
                myLineChart.data.labels = data.years;
                myLineChart.data.datasets[0].data = data.hydro;
                myLineChart.data.datasets[1].data = data.wind;
                myLineChart.data.datasets[2].data = data.solar;
                myLineChart.update();
            })
            .catch(error => {
                console.error("Error al obtener los datos para el gráfico de líneas:", error);
            });
    }

    // Escuchar los cambios en el selector de año, país (para las gráficas principales)
    yearSelector.addEventListener("change", updateChart);
    countrySelector.addEventListener("change", updateChart);

    // Escuchar los cambios en el selector de país (para el gráfico de líneas)
    lineCountrySelector.addEventListener("change", updateLineChart);

    // Cargar los años al iniciar
    loadYears();
    updateLineChart(); // Cargar el gráfico de líneas al inicio
});
