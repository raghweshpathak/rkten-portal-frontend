import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = "http://localhost:5000";

function Dashboard() {
  const token = localStorage.getItem("token");

  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const [employeesCount, setEmployeesCount] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);

  const [empForm, setEmpForm] = useState({
    name: "",
    email: "",
    role: "",
    salary: "",
  });

  const [projectForm, setProjectForm] = useState({
    name: "",
    client: "",
    status: "",
  });

  const loadStats = async () => {
    const emp = await axios.get(`${API}/employees`, authHeader);
    const proj = await axios.get(`${API}/projects`, authHeader);

    setEmployeesCount(emp.data.length);
    setProjectsCount(proj.data.length);
  };

  useEffect(() => {
    loadStats();
  }, []);

  // ADD EMPLOYEE
  const addEmployee = async () => {
    await axios.post(`${API}/employees`, empForm, authHeader);
    setEmpForm({ name: "", email: "", role: "", salary: "" });
    loadStats();
  };

  // ADD PROJECT
  const addProject = async () => {
    await axios.post(`${API}/projects`, projectForm, authHeader);
    setProjectForm({ name: "", client: "", status: "" });
    loadStats();
  };

  return (
    <div className="p-8 space-y-10">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-6">
        <Link to="/employees">
          <div className="bg-blue-600 text-white p-8 rounded shadow">
            <h2>Employees</h2>
            <p className="text-3xl font-bold">{employeesCount}</p>
          </div>
        </Link>

        <Link to="/projects">
          <div className="bg-green-600 text-white p-8 rounded shadow">
            <h2>Projects</h2>
            <p className="text-3xl font-bold">{projectsCount}</p>
          </div>
        </Link>
      </div>

      {/* QUICK ADD EMPLOYEE */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="font-bold mb-4">Quick Add Employee</h2>

        <div className="grid grid-cols-4 gap-3">
          {["name", "email", "role", "salary"].map((field) => (
            <input
              key={field}
              className="border p-2 rounded"
              placeholder={field}
              value={empForm[field]}
              onChange={(e) =>
                setEmpForm({ ...empForm, [field]: e.target.value })
              }
            />
          ))}
        </div>

        <button
          onClick={addEmployee}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Employee
        </button>
      </div>

      {/* QUICK ADD PROJECT */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="font-bold mb-4">Quick Add Project</h2>

        <div className="grid grid-cols-3 gap-3">
          {["name", "client", "status"].map((field) => (
            <input
              key={field}
              className="border p-2 rounded"
              placeholder={field}
              value={projectForm[field]}
              onChange={(e) =>
                setProjectForm({
                  ...projectForm,
                  [field]: e.target.value,
                })
              }
            />
          ))}
        </div>

        <button
          onClick={addProject}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Project
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
