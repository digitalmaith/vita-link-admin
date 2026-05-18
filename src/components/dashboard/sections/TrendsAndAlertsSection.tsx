import { DonationTrendChart } from "@/components/reports/DonationTrendChart";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";

export function TrendsAndAlertsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <DonationTrendChart />
      </div>
      <div>
        <AlertsPanel />
      </div>
    </div>
  );
}