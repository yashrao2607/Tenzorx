import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const CostBreakdownChart = ({ data }) => {
  if (!data) return null;

  const chartData = Object.entries(data).map(([key, value]) => ({
    name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: value
  }));

  const COLORS = ['#2dd4bf', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#0f172a', 
              border: '1px solid #1e293b',
              borderRadius: '8px',
              color: '#f1f5f9'
            }}
            formatter={(value) => `₹${value.toLocaleString()}`}
          />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CostBreakdownChart;
