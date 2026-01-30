import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

interface Props {
  labels: string[]
  datasets: { label: string; values: number[] }[]
  title?: string
  horizontal?: boolean
}

export default function BarChart({ labels, datasets, title, horizontal = false }: Props) {
  return (
    <div className="w-full h-full flex flex-col">
      {title && <h3 className="text-sm font-medium text-gray-600 text-center mb-2">{title}</h3>}
      <div className="flex-1 min-h-0 relative">
        <Bar
          data={{
            labels,
            datasets: datasets.map((ds, i) => ({
              label: ds.label,
              data: ds.values,
              backgroundColor: COLORS[i % COLORS.length],
            })),
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: horizontal ? 'y' : 'x',
            plugins: { legend: { display: datasets.length > 1, position: 'bottom' } },
            scales: { y: { beginAtZero: true } },
          }}
        />
      </div>
    </div>
  )
}
