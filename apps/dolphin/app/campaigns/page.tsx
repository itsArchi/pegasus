import AdminLayout from '@/components/templates/AdminLayout'
import CampaignTable from '@/components/organisms/CampaignTable'

export const metadata = { title: 'Campaign — Dolphin Admin' }

export default function CampaignsPage() {
  return (
    <AdminLayout title="Campaign">
      <CampaignTable />
    </AdminLayout>
  )
}
