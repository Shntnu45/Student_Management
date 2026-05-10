import { useState, useEffect } from 'react';

const EMPTY = { name: '', email: '', age: '', course: '' };

export default function StudentModal({ student, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(student ? { name: student.name, email: student.email, age: student.age, course: student.course } : EMPTY);
    setErrors({});
  }, [student]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required';
    if (!form.age || form.age < 1 || form.age > 100) e.age = 'Age must be between 1 and 100';
    if (!form.course.trim()) e.course = 'Course is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSaving(true);
    await onSave({ ...form, age: Number(form.age) });
    setSaving(false);
  };

  const field = (key, label, type = 'text', extra = {}) => (
    <div className="mb-3">
      <label className="form-label fw-semibold">{label}</label>
      <input
        type={type}
        className={`form-control${errors[key] ? ' is-invalid' : ''}`}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        {...extra}
      />
      {errors[key] && <div className="invalid-feedback">{errors[key]}</div>}
    </div>
  );

  return (
    <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">
              <i className={`bi ${student ? 'bi-pencil-square' : 'bi-person-plus-fill'} me-2 text-primary`} />
              {student ? 'Edit Student' : 'Add New Student'}
            </h5>
            <button className="btn-close" onClick={onClose} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body pt-3">
              {field('name', 'Full Name', 'text', { placeholder: 'e.g. John Doe' })}
              {field('email', 'Email Address', 'email', { placeholder: 'e.g. john@example.com' })}
              <div className="row">
                <div className="col-6">{field('age', 'Age', 'number', { min: 1, max: 100, placeholder: '18' })}</div>
                <div className="col-6">{field('course', 'Course', 'text', { placeholder: 'e.g. Computer Science' })}</div>
              </div>
            </div>
            <div className="modal-footer border-0 pt-0">
              <button type="button" className="btn btn-light" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                {student ? 'Update Student' : 'Add Student'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
