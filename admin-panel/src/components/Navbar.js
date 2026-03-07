import React from "react";

const Navbar = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "60px",
        background: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        borderBottom: "1px solid #e2e8f0"
      }}
    >
      <h2 style={{ margin: 0 }}>Admin Dashboard</h2>

      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <span>Welcome Admin</span>

        <button
          style={{
            padding: "6px 12px",
            border: "none",
            background: "#ef4444",
            color: "white",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;