import React, { useEffect, useState } from "react";
import { getUsers } from "../services/api";

const Users = () => {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {

    try {

      const res = await getUsers();

      setUsers(res.data.users);

    } catch (error) {

      console.log("Error fetching users:", error);

    }

  };

  return (

    <div style={{ padding: "30px" }}>

      <h1>Users</h1>

      <table border="1" cellPadding="10" style={{ marginTop: "20px", width: "100%" }}>

        <thead>

          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Signup Time</th>
            <th>Last Login</th>
            <th>Total Logins</th>
          </tr>

        </thead>

        <tbody>

          {users.map((user) => (

            <tr key={user._id}>

              <td>{user.name}</td>

              <td>{user.email}</td>

              <td>
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleString()
                  : "N/A"}
              </td>

              <td>
                {user.lastLogin
                  ? new Date(user.lastLogin).toLocaleString()
                  : "Never"}
              </td>

              <td>{user.loginHistory?.length || 0}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

};

export default Users;