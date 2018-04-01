var adtlabels = [];
var adtdatapoints = [];
var dtdatapoints = [];

var adtdata = {
    labels: [],
    datasets: [
        {
            label: "Average Damage per Turn",
            fill: false,
            lineTension: 0.5,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [],
            spanGaps: false,
        },

        {
            label: "Damage in Turn",
            fill: false,
            lineTension: 0.5,
            backgroundColor: "rgba(255,165,0,0.4)",
            borderColor: "rgba(255,165,0,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(255,165,0,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(255,165,0,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [],
            spanGaps: false,
        }
    ]
};

var adtoptions = {
    scales: {
        yAxes: [{
        type: 'logarithmic',
            position: 'left'
        }]
    }
};

var graphctx = document.getElementById("graph").getContext("2d");
var adtChart = new Chart.Line(graphctx, {data: adtdata, options: adtoptions});

function updateadtChart() {

    adtlabels.push(turnNumber);
    //adtdata.labels = adtlabels.slice(Math.max(0,adtlabels.length - 10), adtlabels.length);
    //adtdata.labels.push(turnNumber);
    adtChart.data.labels.push(turnNumber);

    adtdatapoints.push(Math.round(totalDamage / turnNumber / 1000));
    dtdatapoints.push(Math.round(turnDamage / 1000));

    //adtChart.data.datasets[0].data = adtdatapoints.slice(Math.max(0, adtdatapoints.length - 10), adtdatapoints.length);
    //adtChart.data.datasets[1].data = dtdatapoints.slice(Math.max(0, dtdatapoints.length - 10), dtdatapoints.length);;
    adtChart.data.datasets[0].data.push(Math.round(totalDamage / turnNumber / 1000));
    adtChart.data.datasets[1].data.push(Math.round(turnDamage / 1000));

    adtChart.update();

    turnDamage = 0;

}
