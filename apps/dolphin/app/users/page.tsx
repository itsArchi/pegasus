import AdminLayout from '@/components/templates/AdminLayout'
import UserTable from '@/components/organisms/UserTable'

export const metadata = { title: 'Users — Dolphin Admin' }

export default function UsersPage() {
  return (
    <AdminLayout title="User Management">
      <UserTable />
    </AdminLayout>
  )
}
