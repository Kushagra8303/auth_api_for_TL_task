import React, { useEffect, useState } from "react";
import { getUsers } from "../services/api";

const Dashboard = () => {

  const [users, setUsers] = useState([]);
  const [totalLogins, setTotalLogins] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {

    try {

      const res = await getUsers();

      const usersData = res.data.users;

      setUsers(usersData);

      const logins = usersData.reduce(
        (acc, user) => acc + (user.loginHistory?.length || 0),
        0
      );

      setTotalLogins(logins);

    } catch (err) {

      console.log("Error fetching users:", err);

      setError("Unable to fetch users");

    }

  };

  return (

    <div>

      <h1>Dashboard</h1>

      {error && <p style={{color:"red"}}>{error}</p>}

      <div className="card-container">

        <div className="card">
          <h3>Total Users</h3>
          <h2>{users.length}</h2>
        </div>

        <div className="card">
          <h3>Total Logins</h3>
          <h2>{totalLogins}</h2>
        </div>

      </div>

    </div>

  );

};

export default Dashboard;