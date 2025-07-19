// Crée ce fichier avec ce contenu
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const AdminPage = styled.div`
  background-color: #182032;
  min-height: 100vh;
  padding: 20px;
`;

const AdminContainer = styled.div`
  max-width: 800px;
  margin: 80px auto;
  color: white;
`;

const UserList = styled.ul`
  list-style: none;
  padding: 0;
`;

const UserItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #2f3b55;
  margin-bottom: 10px;
  border-radius: 5px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: none;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #518cc7;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

function Admin() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ pseudo: "", email: "", password: "", role: "user" });
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching users");
      }
    }
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/users", newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewUser({ pseudo: "", email: "", password: "", role: "user" });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || "Error adding user");
    }
  };

  const handleEditUser = async (id, updatedUser) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/users/${id}`, updatedUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || "Error editing user");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || "Error deleting user");
    }
  };

  if (error) {
    return (
      <AdminPage>
        <Header />
        <AdminContainer>
          <h2>Error</h2>
          <p>{error}</p>
        </AdminContainer>
        <Footer />
      </AdminPage>
    );
  }

  return (
    <AdminPage>
      <Header />
      <AdminContainer>
        <h2>Manage Users</h2>
        <Form onSubmit={handleAddUser}>
          <Input
            type="text"
            placeholder="Pseudo"
            value={newUser.pseudo}
            onChange={(e) => setNewUser({ ...newUser, pseudo: e.target.value })}
          />
          <Input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <Input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
          <Input
            type="text"
            placeholder="Role (user/admin/librarian)"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          />
          <Button type="submit">Add User</Button>
        </Form>
        <UserList>
          {users.map((user) => (
            <UserItem key={user.id_user}>
              <span>{user.pseudo} ({user.email}) - {user.role}</span>
              <div>
                <Button onClick={() => handleEditUser(user.id_user, { ...user, role: user.role === "user" ? "admin" : "user" })}>
                  Toggle Role
                </Button>
                <Button onClick={() => handleDeleteUser(user.id_user)}>Delete</Button>
              </div>
            </UserItem>
          ))}
        </UserList>
      </AdminContainer>
      <Footer />
    </AdminPage>
  );
}

export default Admin;