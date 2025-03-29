document.addEventListener('DOMContentLoaded', () => {
    const yearSelector = document.getElementById("yearSelector");
    const countrySelector = document.getElementById("countrySelector");
    const lineCountrySelector = document.getElementById("lineCountrySelector"); // 👈 asegúrate que el HTML tenga este ID
    const ctxPie = document.getElementById("myPieChart").getContext("2d");
    const ctxBar = document.getElementById("myBarChart").getContext("2d");
    const ctxLine = document.getElementById("myConsumoLineChart").getContext("2d");

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
                        font: { size: 16, weight: 'bold' }
                    }
                },
                title: {
                    display: true,
                    text: 'Distribución de Energías Renovables',
                    color: 'white',
                    font: { size: 20, weight: 'bold' },
                    padding: { top: 20, bottom: 20 }
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
                        font: { size: 14, weight: 'bold' }
                    }
                },
                x: {
                    ticks: {
                        color: 'white',
                        font: { size: 16, weight: 'bold' }
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white',
                        font: { size: 16, weight: 'bold' }
                    }
                },
                datalabels: {
                    color: 'white',
                    font: { size: 16, weight: 'bold' },
                    formatter: value => value.toFixed(2)
                }
            }
        },
        plugins: [ChartDataLabels]
    });

    // Gráfica de líneas
    let myConsumoLineChart = new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: [],
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
                        font: { size: 16, weight: 'bold' }
                    }
                },
                title: {
                    display: true,
                    text: 'TWh consumidos por año',
                    color: 'white',
                    font: { size: 20, weight: 'bold' },
                    padding: { top: 20, bottom: 20 }
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

    // Actualizar gráfica de torta y barras
    function updateChart() {
        const pais = countrySelector.value;
        const anio = yearSelector.value;
        const endpoint = `http://localhost:8080/api/consumo/${pais}/${anio}`;

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

                    myPieChart.data.datasets[0].data = porcentajes;
                    myPieChart.update();

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

    // Gráfica de líneas: datos históricos
    function updateLineChart() {
        const pais = lineCountrySelector.value;
        const endpoint = `http://localhost:8080/api/consumo/${pais}/serie`;
        console.log("Consultando consumo histórico:", endpoint);

        fetch(endpoint)
            .then(response => response.json())
            .then(data => {
                console.log("Datos recibidos:", data);
                myConsumoLineChart.data.labels = data.years;
                myConsumoLineChart.data.datasets[0].data = data.hydro;
                myConsumoLineChart.data.datasets[1].data = data.wind;
                myConsumoLineChart.data.datasets[2].data = data.solar;
                myConsumoLineChart.update();
            })
            .catch(error => {
                console.error("Error al obtener los datos para el gráfico de líneas:", error);
            });
    }

    // Cargar años desde el backend
    function loadYears() {
        const endpoint = "http://localhost:8080/api/consumo/years";
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

    // Eventos
    yearSelector.addEventListener("change", updateChart);
    countrySelector.addEventListener("change", updateChart);
    lineCountrySelector.addEventListener("change", updateLineChart);

    // Inicialización
    loadYears();
    updateLineChart();
});
