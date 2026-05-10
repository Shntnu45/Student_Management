import { useEffect, useState, useCallback } from 'react';
import { studentService } from '../services/studentService';
import { useToast } from '../context/ToastContext';
import Spinner from '../components/Spinner';
import StudentModal from '../components/StudentModal';
import DeleteModal from '../components/DeleteModal';

const PAGE_SIZE = 8;

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [editStudent, setEditStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { addToast } = useToast();

  const fetchStudents = useCallback(() => {
    setLoading(true);
    studentService.getAll()
      .then(({ data }) => setStudents(data))
      .catch(() => addToast('Failed to load students', 'error'))
      .finally(() => setLoading(false));
  }, [addToast]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const filtered = students.filter((s) =>
    [s.name, s.email, s.course].some((v) => v?.toLowerCase().includes(search.toLowerCase()))
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSave = async (data) => {
    try {
      if (editStudent) {
        await studentService.update(editStudent.id, data);
        addToast('Student updated successfully!');
      } else {
        await studentService.create(data);
        addToast('Student added successfully!');
      }
      setShowForm(false);
      setEditStudent(null);
      fetchStudents();
    } catch {
      addToast('Operation failed. Please try again.', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await studentService.delete(deleteTarget.id);
      addToast('Student deleted successfully!');
      setDeleteTarget(null);
      fetchStudents();
    } catch {
      addToast('Delete failed. Please try again.', 'error');
    }
  };

  const openEdit = (student) => { setEditStudent(student); setShowForm(true); };
  const openAdd = () => { setEditStudent(null); setShowForm(true); };

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h5 className="fw-bold mb-0">Students</h5>
          <small className="text-muted">{filtered.length} record{filtered.length !== 1 ? 's' : ''} found</small>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openAdd}>
          <i className="bi bi-plus-lg me-1" /> Add Student
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 py-3">
          <div className="input-group" style={{ maxWidth: 320 }}>
            <span className="input-group-text bg-light border-end-0"><i className="bi bi-search text-muted" /></span>
            <input
              type="text"
              className="form-control bg-light border-start-0"
              placeholder="Search by name, email, course..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        <div className="card-body p-0">
          {loading ? <Spinner /> : paginated.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-inbox fs-1 d-block mb-2" />
              <p className="mb-0">{search ? 'No students match your search.' : 'No students yet. Add one!'}</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Age</th>
                    <th>Course</th>
                    <th>Created</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((s, i) => (
                    <tr key={s.id}>
                      <td className="text-muted">{(page - 1) * PAGE_SIZE + i + 1}</td>
                      <td className="fw-semibold">{s.name}</td>
                      <td className="text-muted">{s.email}</td>
                      <td>{s.age}</td>
                      <td><span className="badge bg-primary-subtle text-primary px-2 py-1">{s.course}</span></td>
                      <td className="text-muted">{new Date(s.createdDate).toLocaleDateString()}</td>
                      <td className="text-center">
                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(s)} title="Edit">
                          <i className="bi bi-pencil" />
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteTarget(s)} title="Delete">
                          <i className="bi bi-trash" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="card-footer bg-white border-0 d-flex justify-content-between align-items-center py-3">
            <small className="text-muted">Page {page} of {totalPages}</small>
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item${page === 1 ? ' disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(page - 1)}>‹</button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i + 1} className={`page-item${page === i + 1 ? ' active' : ''}`}>
                    <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
                  </li>
                ))}
                <li className={`page-item${page === totalPages ? ' disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(page + 1)}>›</button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      {showForm && (
        <StudentModal
          student={editStudent}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditStudent(null); }}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          student={deleteTarget}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}
