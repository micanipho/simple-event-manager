import { redirect } from 'next/navigation';

export default function HomePage() {
  // As per README, the homepage will likely redirect to /events
  redirect('/events');
  return null;
}
