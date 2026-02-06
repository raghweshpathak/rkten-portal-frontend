import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectSearch, setProjectSearch] = useState("");
  const [tab, setTab] = useState("employees");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 5;
  const [projectPage, setProjectPage] = useState(1);
  const projectPerPage = 5;
  const [editingProjectId, setEditingProjectId] = useState(null);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  const [empForm, setEmpForm] = useState({
    name: "",
    email: "",
    role: "",
    salary: ""
  });

  const [editingId, setEditingId] = useState(null);

  const [projectForm, setProjectForm] = useState({
    name: "",
    client: "",
    status: ""
  });

  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  // LOGIN
  const login = async () => {
    const res = await axios.post(`${API}/login`, loginForm);
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // EMPLOYEES
const fetchEmployees = async () => {
  console.log("Sending token:", token);

  const res = await axios.get(`${API}/employees`, authHeader);
  setEmployees(res.data);
};


  const addEmployee = async () => {
    await axios.post(`${API}/employees`, empForm, authHeader);
    setEmpForm({ name: "", email: "", role: "", salary: "" });
    fetchEmployees();
  };

  const updateEmployee = async () => {
    await axios.put(`${API}/employees/${editingId}`, empForm, authHeader);
    setEditingId(null);
    setEmpForm({ name: "", email: "", role: "", salary: "" });
    fetchEmployees();
  };

  const deleteEmployee = async (id) => {
    await axios.delete(`${API}/employees/${id}`, authHeader);
    fetchEmployees();
  };

  const startEdit = (emp) => {
    setEmpForm(emp);
    setEditingId(emp._id);
  };
  const filteredEmployees = employees.filter((e) =>
  e.name.toLowerCase().includes(search.toLowerCase())
  );
  const start = (page - 1) * perPage;
  const paginatedEmployees = filteredEmployees.slice(start, start + perPage);

  // PROJECTS
  const fetchProjects = async () => {
    const res = await axios.get(`${API}/projects`, authHeader);
    setProjects(res.data);
  };
const updateProject = async () => {
  await axios.put(
    `${API}/projects/${editingProjectId}`,
    projectForm,
    authHeader
  );

  setEditingProjectId(null);
  setProjectForm({ name: "", client: "", status: "" });
  fetchProjects();
};

const deleteProject = async (id) => {
  await axios.delete(`${API}/projects/${id}`, authHeader);
  fetchProjects();
};

const startProjectEdit = (p) => {
  setProjectForm(p);
  setEditingProjectId(p._id);
};

  const addProject = async () => {
    await axios.post(`${API}/projects`, projectForm, authHeader);
    setProjectForm({ name: "", client: "", status: "" });
    fetchProjects();
  };
  const filteredProjects = projects.filter((p) =>
  p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
  p.client.toLowerCase().includes(projectSearch.toLowerCase())
);

const pStart = (projectPage - 1) * projectPerPage;
const paginatedProjects = filteredProjects.slice(
  pStart,
  pStart + projectPerPage
);


  useEffect(() => {
  console.log("TOKEN:", token);
}, [token]);


  // LOGIN SCREEN
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg w-80">
          <h2 className="text-xl font-bold mb-4">Login</h2>

          <input
            className="border p-2 w-full mb-3 rounded"
            placeholder="Email"
            onChange={(e) =>
              setLoginForm({ ...loginForm, email: e.target.value })
            }
          />

          <input
            className="border p-2 w-full mb-3 rounded"
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setLoginForm({ ...loginForm, password: e.target.value })
            }
          />

          <button
            onClick={login}
            className="bg-blue-600 text-white w-full py-2 rounded"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">RKTen Portal</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 space-x-3">
        <button
          onClick={() => setTab("employees")}
          className={`px-4 py-2 rounded ${
            tab === "employees" ? "bg-blue-600 text-white" : "bg-white"
          }`}
        >
          Employees
        </button>

        <button
          onClick={() => setTab("projects")}
          className={`px-4 py-2 rounded ${
            tab === "projects" ? "bg-blue-600 text-white" : "bg-white"
          }`}
        >
          Projects
        </button>
      </div>

      {/* EMPLOYEE PANEL */}
      {tab === "employees" && (
        <div>
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="font-bold mb-3">
              {editingId ? "Edit Employee" : "Add Employee"}
            </h2>

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
              onClick={editingId ? updateEmployee : addEmployee}
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
            >
              {editingId ? "Update" : "Add Employee"}
            </button>
          </div>
          <input
          className="border p-2 rounded mb-4 w-1/3"
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          />

          <table className="w-full bg-white shadow rounded">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Salary</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedEmployees.map((e) => (
                <tr key={e._id} className="border-t">
                  <td className="p-3">{e.name}</td>
                  <td>{e.email}</td>
                  <td>{e.role}</td>
                  <td>₹{e.salary}</td>
                  <td>
                    <button
                      onClick={() => startEdit(e)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteEmployee(e._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex gap-3">
  <button
    onClick={() => setPage(page - 1)}
    disabled={page === 1}
    className="px-3 py-1 bg-gray-300 rounded"
  >
    Prev
  </button>

  <span>Page {page}</span>

  <button
    onClick={() => setPage(page + 1)}
    disabled={start + perPage >= filteredEmployees.length}
    className="px-3 py-1 bg-gray-300 rounded"
  >
    Next
  </button>
</div>

        </div>
      )}

      {/* PROJECT PANEL (unchanged) */}
      {tab === "projects" && (
        <div>
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="font-bold mb-3">Add Project</h2>

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
                      [field]: e.target.value
                    })
                  }
                />
              ))}
            </div>

            <button
  onClick={editingProjectId ? updateProject : addProject}
  className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
>
  {editingProjectId ? "Update Project" : "Add Project"}
</button>

            <input
  className="border p-2 rounded mb-4 w-1/3"
  placeholder="Search project..."
  value={projectSearch}
  onChange={(e) => setProjectSearch(e.target.value)}
/>

          </div>
          <table className="w-full bg-white shadow rounded">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">Project</th>
                <th>Client</th>
                <th>Status</th>
                <th>Action</th>

              </tr>
            </thead>
<tbody>
  {paginatedProjects.map((p) => (
    <tr key={p._id} className="border-t">
      <td className="p-3">{p.name}</td>
      <td>{p.client}</td>
      <td>{p.status}</td>
      <td>
        <button
          onClick={() => startProjectEdit(p)}
          className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
        >
          Edit
        </button>

        <button
          onClick={() => deleteProject(p._id)}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>

          </table>
          <div className="mt-4 flex gap-3">
  <button
    onClick={() => setProjectPage(projectPage - 1)}
    disabled={projectPage === 1}
    className="px-3 py-1 bg-gray-300 rounded"
  >
    Prev
  </button>

  <span>Page {projectPage}</span>

  <button
    onClick={() => setProjectPage(projectPage + 1)}
    disabled={pStart + projectPerPage >= filteredProjects.length}
    className="px-3 py-1 bg-gray-300 rounded"
  >
    Next
  </button>
</div>

        </div>
      )}
    </div>
  );
}

export default App;
