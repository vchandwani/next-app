import React from 'react'
//Fetching in server component has extra benefits like caching, streaming, and avoiding CORS issues.Avoding fetching in client component is a good practice to avoid unnecessary re-renders and improve performance.
// Next JS has caching built in for server components, so you can use the fetch API directly without any additional libraries. You can also use the revalidate option to specify how often the data should be re-fetched.

interface User {
    id: number;
    name: string;   
}

const UsersPage = async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/users', {
        next: { revalidate: 60 } // Revalidate the data every 60 seconds
    });
    const users: User[] = await res.json();

    return (
        <>
            <h1>Users</h1>
            <p>{new Date().toLocaleTimeString()}</p>
            <ul>
                {users.map((user: User) => (
                    <li key={user.id}>{user.name}</li>
                ))}
            </ul>
        </>
    )
}

export default UsersPage