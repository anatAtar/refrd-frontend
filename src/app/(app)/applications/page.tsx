import { cookies } from 'next/headers';
import { getServerMyApplications } from '@/lib/api/applications';
import MyApplicationsClient from './MyApplicationsClient';

export default async function ApplicationsPage() {
  const cookieStore = await cookies();
  const initialData = await getServerMyApplications(cookieStore.toString());
  return <MyApplicationsClient initialData={initialData} />;
}
