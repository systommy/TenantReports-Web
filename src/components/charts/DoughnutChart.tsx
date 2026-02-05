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
    <div className="flex flex-col items-center w-full">
      {title && <h3 className="text-sm font-medium text-gray-600 text-center mb-2">{title}</h3>}
      
      <div className="relative w-full max-w-[160px] aspect-square">
        <Doughnut
          data={{
            labels,
            datasets: [{ 
              data: values, 
              backgroundColor: COLORS.slice(0, labels.length), 
              borderWidth: 0,
            }],
          }}
          options={{ 
            responsive: true, 
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: { 
              legend: { display: false },
              tooltip: { 
                enabled: true,
                padding: 12,
                cornerRadius: 8,
              }
            } 
          }}
        />
      </div>

      {/* Custom Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs w-full">
        {labels.map((label, i) => (
          <div key={label} className="flex items-center gap-1.5 whitespace-nowrap">
            <span 
              className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
              style={{ backgroundColor: COLORS[i % COLORS.length] }} 
            />
            <span className="text-gray-600 font-medium">{label}</span>
            <span className="text-gray-400">({values[i]})</span>
          </div>
        ))}
      </div>
    </div>
  )
}
