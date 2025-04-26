import StatsCard from './StatsCard'
import InventoryTable from './InventoryTable'

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title="Total Items" value="1,254" />
        <StatsCard title="Out of Stock" value="24" />
        <StatsCard title="Orders Pending" value="12" />
      </div>
      <InventoryTable />
    </div>
  )
}
