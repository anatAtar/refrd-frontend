import { cookies } from 'next/headers';
import { getServerInbox } from '@/lib/api/applications';
import InboxClient from './InboxClient';

export default async function InboxPage() {
  const cookieStore = await cookies();
  const initialData = await getServerInbox(cookieStore.toString());
  return <InboxClient initialData={initialData} />;
}
