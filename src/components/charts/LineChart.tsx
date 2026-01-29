import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

interface Props {
  labels: string[]
  values: (number | null)[]
  label: string
  title?: string
}

export default function LineChart({ labels, values, label, title }: Props) {
  return (
    <div>
      {title && <h3 className="text-sm font-medium text-gray-600 text-center mb-2">{title}</h3>}
      <Line
        data={{
          labels,
          datasets: [{
            label,
            data: values,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.3,
          }],
        }}
        options={{
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: false } },
        }}
      />
    </div>
  )
}
