import Link from "next/link";
import React from "react";

export const instant = false;

//Fetching in server component has extra benefits like caching, streaming, and avoiding CORS issues.Avoding fetching in client component is a good practice to avoid unnecessary re-renders and improve performance.
// Next JS has caching built in for server components, so you can use the fetch API directly without any additional libraries. You can also use the revalidate option to specify how often the data should be re-fetched.

interface User {
  id: number;
  name: string;
  email: string;
}

const UsersPage = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users", {
    cache: "no-store", //This option disables caching and ensures that the data is always fetched from the server. You can also use 'force-cache' to force caching, or 'default' to use the default caching behavior.
  });
  const users: User[] = await res.json();

  return (
    <>
      <h1>Users</h1>
      <p>{new Date().toLocaleTimeString()}</p>
      <table className="table table-bordered border-collapse border border-slate-400">
        <thead>
          <tr>
            <th className="border border-slate-400 px-4 py-2">ID</th>
            <th className="border border-slate-400 px-4 py-2">Name</th>
            <th className="border border-slate-400 px-4 py-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: User) => (
            <tr key={user.id}>
              <td className="border border-slate-400 px-4 py-2 link">
                <Link href={`/dashboard/users/${user.id}`}>{user.id}</Link>
              </td>
              <td className="border border-slate-400 px-4 py-2">{user.name}</td>
              <td className="border border-slate-400 px-4 py-2">{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default UsersPage;
