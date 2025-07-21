import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import Cookies from "js-cookie";

const UserTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  max-height: 400px;
  overflow-y: auto;
  display: block;

  @media (max-width: 768px) {
    overflow-x: auto;
    width: 100%;
    -webkit-overflow-scrolling: touch;
    font-size: 14px;
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    max-height: 300px;
  }
`;

const AddUserForm = styled.form`
  margin-top: 20px;
  display: flex;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  & input, & select {
    @media (max-width: 768px) {
      width: 100%;
      margin-bottom: 10px;
    }
  }
`;

const AddButton = styled.button`
  background-color: #518CC7;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 8px 15px;
    font-size: 14px;
  }
`;

const SaveButton = styled.button`
  background-color: #518CC7;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 8px 15px;
    font-size: 14px;
  }
`;

const TableHeader = styled.th`
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ffffff33;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #1b2335;
  }
`;

const TableCell = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ffffff33;
  &:focus-within {
    background-color: #344163;
    outline: 2px solid #518cc7;
  }
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;

function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [editUserId, setEditUserId] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [newUser, setNewUser] = useState({ pseudo: "", email: "", password: "", role: "user" });
  const menuRef = useRef(null);

  const fetchUsers = async () => {
    try {
        const token = Cookies.get("session_token");
        console.log("Fetching users with token:", token);
        console.log("API URL:", "https://localhost:5000/api/users");
      const response = await axios.get("https://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching users");
      console.error("Fetch users error:", err.message, err.response?.status, err.response?.data);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    const updatedUsers = users.map(u =>
      u.id_user === user.id_user ? { ...u, ...user } : u
    );
    setUsers(updatedUsers);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = Cookies.get("session_token");
        await axios.delete(`https://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(users.filter(u => u.id_user !== id));
        await fetchUsers();
      } catch (err) {
        console.error("Delete error:", err.response?.data || err.message);
      }
    }
  };

  return (
    <section aria-label="Users management section"> {/* WCAG: Ajouté aria-label pour accessibilité */}
      {/* Ajouter meta tags ici avec react-helmet si utilisé :
      <Helmet>
        <title>Users Management - MangaVerse</title>
        <meta name="description" content="Manage user accounts on the MangaVerse admin panel." />
        <meta name="keywords" content="users, management, admin" />
        <meta name="robots" content="index, follow" />
      </Helmet> */}
      <h1>Manage Users</h1>
      <UserTable aria-label="Users table">
  <thead>
    <tr>
      <TableHeader>Select</TableHeader>
      <TableHeader>ID</TableHeader>
      <TableHeader>Pseudo</TableHeader>
      <TableHeader>Email</TableHeader>
      <TableHeader>Role</TableHeader>
      <TableHeader>Actions</TableHeader>
    </tr>
  </thead>
  <tbody>{users.map((user) => (
    <TableRow key={user.id_user}>
      <TableCell>
        <Checkbox
          type="checkbox"
          checked={selectedUsers.includes(user.id_user)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedUsers([...selectedUsers, user.id_user]);
            } else {
              setSelectedUsers(selectedUsers.filter(id => id !== user.id_user));
            }
          }}
          aria-label={`Select user ${user.pseudo}`} // WCAG: Ajouté aria-label pour accessibilité
        />
      </TableCell>
      <TableCell>
        {editUserId === user.id_user ? (
          <input
            style={{ padding: "5px", border: "1px solid #518cc7", borderRadius: "5px", width: "50px" }}
            value={user.id_user || ""}
            disabled
          />
        ) : (
          user.id_user || ""
        )}
      </TableCell>
      <TableCell>
        {editUserId === user.id_user ? (
          <input
            style={{ padding: "5px", border: "1px solid #518cc7", borderRadius: "5px" }}
            value={user.pseudo || ""}
            onChange={(e) => {
              const updatedUser = { ...user, pseudo: e.target.value };
              handleEdit(updatedUser);
            }}
            aria-label="Edit pseudo" // WCAG: Ajouté aria-label pour accessibilité
          />
        ) : (
          user.pseudo || ""
        )}
      </TableCell>
      <TableCell>
        {editUserId === user.id_user ? (
          <input
            style={{ padding: "5px", border: "1px solid #518cc7", borderRadius: "5px" }}
            value={user.email || ""}
            onChange={(e) => {
              const updatedUser = { ...user, email: e.target.value };
              handleEdit(updatedUser);
            }}
            aria-label="Edit email" // WCAG: Ajouté aria-label pour accessibilité
          />
        ) : (
          user.email || ""
        )}
      </TableCell>
      <TableCell>
        {editUserId === user.id_user ? (
          <select
            style={{ padding: "5px", border: "1px solid #518cc7", borderRadius: "5px" }}
            value={user.role || "user"}
            onChange={(e) => {
              const updatedUser = { ...user, role: e.target.value };
              handleEdit(updatedUser);
            }}
            aria-label="Edit role" // WCAG: Ajouté aria-label pour accessibilité
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="librarian">Librarian</option>
          </select>
        ) : (
          user.role || "user"
        )}
      </TableCell>
      <TableCell>
        <button
          ref={menuRef}
          onClick={() => setEditUserId(editUserId === user.id_user ? null : user.id_user)}
          style={{ background: "none", border: "none", cursor: "pointer", marginRight: "10px" }}
          aria-label="Edit user button" // WCAG: Ajouté aria-label pour accessibilité
        >
          <FaEdit color="#518CC7" />
        </button>
        <button
          onClick={() => handleDelete(user.id_user)}
          style={{ background: "none", border: "none", cursor: "pointer" }}
          aria-label="Delete user button" // WCAG: Ajouté aria-label pour accessibilité
        >
          <FaTrash color="#ff4444" />
        </button>
      </TableCell>
    </TableRow>
  ))}</tbody>
</UserTable>
      <AddUserForm>
        <input
          style={{ padding: "5px", marginRight: "10px", border: "1px solid #518cc7", borderRadius: "5px" }}
          value={newUser.pseudo}
          onChange={(e) => setNewUser({ ...newUser, pseudo: e.target.value })}
          placeholder="Enter pseudo"
          aria-label="New user pseudo input" // WCAG: Ajouté aria-label pour accessibilité
        />
        <input
          style={{ padding: "5px", marginRight: "10px", border: "1px solid #518cc7", borderRadius: "5px" }}
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          placeholder="Enter email"
          aria-label="New user email input" // WCAG: Ajouté aria-label pour accessibilité
        />
        <input
          type="password"
          style={{ padding: "5px", marginRight: "10px", border: "1px solid #518cc7", borderRadius: "5px" }}
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          placeholder="Enter password"
          aria-label="New user password input" // WCAG: Ajouté aria-label pour accessibilité
        />
        <select
          style={{ padding: "5px", border: "1px solid #518cc7", borderRadius: "5px" }}
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          aria-label="New user role selection" // WCAG: Ajouté aria-label pour accessibilité
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="librarian">Librarian</option>
        </select>
        <AddButton
          onClick={async () => {
            try {
              if (!newUser.pseudo || !newUser.email || !newUser.password || !newUser.role) {
                console.error("All fields are required");
                return;
              }
              const token = Cookies.get("session_token");
              const response = await axios.post("https://localhost:5000/api/users", newUser, {
                headers: { Authorization: `Bearer ${token}` },
              });
              await fetchUsers();
              setNewUser({ pseudo: "", email: "", password: "", role: "user" });
            } catch (err) {
              console.error("Error adding user:", err.response?.data || err);
            }
          }}
          aria-label="Add user button" // WCAG: Ajouté aria-label pour accessibilité
        >
          Add User
        </AddButton>
      </AddUserForm>
      <SaveButton
        onClick={async () => {
          try {
            const token = Cookies.get("session_token");
            const originalUsers = await axios.get("https://localhost:5000/api/users", {
              headers: { Authorization: `Bearer ${token}` },
            }).then(res => res.data);
            const updatedUsers = users.filter(user => {
              const original = originalUsers.find(u => u.id_user === user.id_user);
              return original && (user.pseudo !== original.pseudo || user.email !== original.email || user.role !== original.role);
            });
            for (const user of updatedUsers) {
              await axios.put(`https://localhost:5000/api/users/${user.id_user}`, user, {
                headers: { Authorization: `Bearer ${token}` },
              });
            }
            if (updatedUsers.length > 0) {
              console.log("Changes saved to database:", updatedUsers);
            } else {
              console.log("No changes to save");
            }
          } catch (err) {
            console.error("Error saving changes:", err);
          }
        }}
        aria-label="Save changes button" // WCAG: Ajouté aria-label pour accessibilité
      >
        Save Changes
      </SaveButton>
    </section>
  );
}

export default UsersAdmin;