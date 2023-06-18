import { database } from "@/src/db";

export default async function TestServerComponent() {
  const data = await database.selectors.youngPlatform.deposits.getAllFiat({});

  return (
    <ul>
      {data.map((deposit) => (
        <li key={deposit.id}>
          {deposit.credit} € - {deposit.date.toISOString()}
        </li>
      ))}
    </ul>
  );
}
