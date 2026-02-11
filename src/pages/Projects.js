import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = "http://localhost:5000";

function Projects() {
  const token = localStorage.getItem("token");

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const [projects, setProjects] = useState([]);

  const [form, setForm] = useState({
    name: "",
    client: "",
    status: ""
  });

  const [editingId, setEditingId] = useState(null);

  // 🔍 search
  const [search, setSearch] = useState("");

  // 📄 pagination
  const [page, setPage] = useState(1);
  const perPage = 5;

  const fetchProjects = async () => {
    const res = await axios.get(`${API}/projects`, authHeader);
    setProjects(res.data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ADD
  const addProject = async () => {
    await axios.post(`${API}/projects`, form, authHeader);
    setForm({ name: "", client: "", status: "" });
    fetchProjects();
  };

  // UPDATE
  const updateProject = async () => {
    await axios.put(`${API}/projects/${editingId}`, form, authHeader);
    setEditingId(null);
    setForm({ name: "", client: "", status: "" });
    fetchProjects();
  };

  // DELETE
  const deleteProject = async (id) => {
    await axios.delete(`${API}/projects/${id}`, authHeader);
    fetchProjects();
  };

  const startEdit = (p) => {
    setForm(p);
    setEditingId(p._id);
  };

  // 🔍 filter
  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase())
  );

  // 📄 paginate
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Projects</h2>

      {/* FORM */}
      <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-3 gap-3">
        {["name", "client", "status"].map((field) => (
          <input
            key={field}
            className="border p-2 rounded"
            placeholder={field}
            value={form[field]}
            onChange={(e) =>
              setForm({ ...form, [field]: e.target.value })
            }
          />
        ))}

        <button
          onClick={editingId ? updateProject : addProject}
          className="bg-green-600 text-white px-4 py-2 rounded col-span-3"
        >
          {editingId ? "Update Project" : "Add Project"}
        </button>
      </div>

      {/* SEARCH */}
      <input
        className="border p-2 rounded mb-4 w-1/3"
        placeholder="Search project..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
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
          {paginated.map((p) => (
            <tr key={p._id} className="border-t">
              <td className="p-3">
  <Link
    to={`/projects/${p._id}`}
    className="text-blue-600 underline hover:text-blue-800"
  >
    {p.name}
  </Link>
</td>

              <td>{p.client}</td>
              <td>{p.status}</td>
              <td>
                <button
                  onClick={() => startEdit(p)}
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

      {/* PAGINATION */}
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
          disabled={start + perPage >= filtered.length}
          className="px-3 py-1 bg-gray-300 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Projects;
