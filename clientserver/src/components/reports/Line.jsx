import { Line } from 'react-chartjs-2';

export default function Line_({ labels, data, title, backgroundColor, borderColor }) {
    const data_ = {
        labels,
        datasets: [
            {
                label: title,
                data,
                fill: false,
                backgroundColor,
                // borderColor: 'rgba(255, 99, 132, 0.2)',
                borderColor,
            },
        ],
    };

    const options = {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },
    };
    return <Line data={data_} options={options} />;
}
