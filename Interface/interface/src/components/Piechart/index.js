
import { PieChart, Pie, Legend, Cell, ResponsiveContainer } from "recharts";
import './index.css'

const Piechart = ({ data, selectedMonth }) => {
  const COLORS = ['#fecba6', '#b3d23f', '#a44c9e', '#8a2be2', '#ff6347', '#4682b4']; // Add more colors if needed

  return (
    <div className="pie-main">
      <h1 style={{color:"white"}}>Pie chart stats - {selectedMonth} </h1>
    
    <ResponsiveContainer className="pie-contain" width="82%" height={300}>

      <PieChart>
        <Pie
          cx="70%"
          cy="40%"
          data={data}
          startAngle={0}
          endAngle={360}
          innerRadius="40%"
          outerRadius="70%"
          dataKey="num_items"
          nameKey="category"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend
          iconType="circle"
          layout="vertical"
          verticalAlign="middle"
          align="right"
        />
      </PieChart>
    </ResponsiveContainer>
    </div>
  );
}

export default Piechart;
