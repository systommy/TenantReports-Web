import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const COLORS = [
  '#6366f1', // Indigo
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#f97316', // Orange
  '#14b8a6', // Teal
]

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
              backgroundColor: datasets.length === 1 
                ? labels.map((_, j) => COLORS[j % COLORS.length]) 
                : COLORS[i % COLORS.length],
              borderRadius: 4, // Add slight rounding for better visuals
            })),
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: horizontal ? 'y' : 'x',
            plugins: { 
              legend: { 
                display: datasets.length > 1, // Hide legend if only 1 dataset (since bars are self-labeled by axis)
                position: 'bottom' 
              } 
            },
            scales: { 
              y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
              x: { grid: { display: false } }
            },
          }}
        />
      </div>
    </div>
  )
}
