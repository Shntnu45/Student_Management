import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { studentService } from '../services/studentService';

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentService.getAll()
      .then(({ data }) => setStudents(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const courses = [...new Set(students.map((s) => s.course).filter(Boolean))];
  const recent = [...students].sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)).slice(0, 5);

  const StatCard = ({ icon, label, value, color, to }) => (
    <div className="col-sm-6 col-xl-3">
      <div className={`stat-card card border-0 shadow-sm h-100`}>
        <div className="card-body d-flex align-items-center gap-3">
          <div className={`stat-icon bg-${color}-subtle text-${color}`}>
            <i className={`bi ${icon} fs-4`} />
          </div>
          <div>
            <div className="stat-value">{loading ? '—' : value}</div>
            <div className="stat-label text-muted">{label}</div>
          </div>
        </div>
        {to && (
          <Link to={to} className="stretched-link" aria-label={label} />
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h5 className="fw-bold mb-0">Dashboard</h5>
          <small className="text-muted">Welcome back, Admin</small>
        </div>
        <Link to="/students" className="btn btn-primary btn-sm">
          <i className="bi bi-plus-lg me-1" /> Add Student
        </Link>
      </div>

      <div className="row g-3 mb-4">
        <StatCard icon="bi-people-fill" label="Total Students" value={students.length} color="primary" to="/students" />
        <StatCard icon="bi-book-fill" label="Total Courses" value={courses.length} color="success" />
        <StatCard icon="bi-person-check-fill" label="Active Records" value={students.length} color="info" />
        <StatCard icon="bi-calendar3" label="This Month" value={students.filter(s => {
          const d = new Date(s.createdDate);
          const now = new Date();
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length} color="warning" />
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center py-3">
          <h6 className="fw-bold mb-0">Recent Students</h6>
          <Link to="/students" className="btn btn-link btn-sm p-0">View all →</Link>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-4"><div className="spinner-border text-primary" /></div>
          ) : recent.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-inbox fs-1 d-block mb-2" />
              No students yet
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Name</th><th>Email</th><th>Course</th><th>Age</th><th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((s) => (
                    <tr key={s.id}>
                      <td className="fw-semibold">{s.name}</td>
                      <td className="text-muted">{s.email}</td>
                      <td><span className="badge bg-primary-subtle text-primary">{s.course}</span></td>
                      <td>{s.age}</td>
                      <td className="text-muted">{new Date(s.createdDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
