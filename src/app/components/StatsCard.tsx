
// /src/components/StatsCard.tsx
interface StatsCardProps {
    title: string;
    value: string | number;
  }
  
  export default function StatsCard({ title, value }: StatsCardProps) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    );
  }
  
  