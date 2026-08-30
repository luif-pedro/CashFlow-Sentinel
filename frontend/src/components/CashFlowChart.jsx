import { Activity } from 'lucide-react'

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

function CashFlowChart({ fluxo }) {
  const dadosGrafico = fluxo
    ? fluxo.diario.map((item) => {
        const [, mes, dia] = item.data.split('-')

        return {
          data: `${dia}/${mes}`,
          saldo: item.saldo_acumulado,
        }
      })
    : []

  return (
    <article className="dashboard-card chart-card">
      <div className="card-title-row">
        <div>
          <h2>Evolução do caixa</h2>
          <p>Saldo acumulado ao longo do período</p>
        </div>

        <div className="small-icon violet-soft">
          <Activity size={18} />
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={dadosGrafico}
            margin={{
              top: 12,
              right: 8,
              left: -10,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient
                id="saldoGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#6d3fc6"
                  stopOpacity={0.22}
                />

                <stop
                  offset="100%"
                  stopColor="#6d3fc6"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#eeeae3"
              strokeDasharray="4 4"
              vertical={false}
            />

            <XAxis
              dataKey="data"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: '#777985',
                fontSize: 11,
              }}
              dy={8}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: '#777985',
                fontSize: 11,
              }}
              tickFormatter={(value) => `R$ ${value}`}
            />

            <Tooltip
              cursor={{
                stroke: '#d7c9eb',
                strokeDasharray: '4 4',
              }}
              contentStyle={{
                border: '1px solid #ece9e2',
                borderRadius: '9px',
                boxShadow: '0 6px 18px rgba(20, 20, 20, 0.08)',
                fontSize: '12px',
              }}
              formatter={(value) => [
                `R$ ${Number(value).toLocaleString('pt-BR')}`,
                'Saldo',
              ]}
            />

            <Area
              type="monotone"
              dataKey="saldo"
              stroke="#6d3fc6"
              strokeWidth={2.5}
              fill="url(#saldoGradient)"
              activeDot={{
                r: 5,
                fill: '#6d3fc6',
                stroke: '#ffffff',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}

export default CashFlowChart