import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

interface Props {
  labels: string[]
  values: number[]
  title?: string
}

export default function DoughnutChart({ labels, values, title }: Props) {
  return (
    <div className="max-w-xs mx-auto">
      {title && <h3 className="text-sm font-medium text-gray-600 text-center mb-2">{title}</h3>}
      <Doughnut
        data={{
          labels,
          datasets: [{ data: values, backgroundColor: COLORS.slice(0, labels.length), borderWidth: 1 }],
        }}
        options={{ responsive: true, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } } }}
      />
    </div>
  )
}
