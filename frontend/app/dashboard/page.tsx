import database from '../../database';

export default async function DashboardPage() {
  const user = await database.fetchUser(1421);
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome!</p>
    </div>
  );
}
