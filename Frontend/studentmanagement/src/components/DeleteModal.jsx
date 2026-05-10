import { useState } from 'react';

export default function DeleteModal({ student, onConfirm, onClose }) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    await onConfirm();
    setDeleting(false);
  };

  return (
    <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="modal-dialog modal-dialog-centered modal-sm">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-body text-center py-4">
            <div className="mb-3">
              <i className="bi bi-exclamation-triangle-fill text-danger" style={{ fontSize: '2.5rem' }} />
            </div>
            <h6 className="fw-bold mb-1">Delete Student?</h6>
            <p className="text-muted small mb-0">
              Are you sure you want to delete <strong>{student.name}</strong>? This action cannot be undone.
            </p>
          </div>
          <div className="modal-footer border-0 justify-content-center pt-0 pb-4 gap-2">
            <button className="btn btn-light px-4" onClick={onClose}>Cancel</button>
            <button className="btn btn-danger px-4" onClick={handleConfirm} disabled={deleting}>
              {deleting ? <span className="spinner-border spinner-border-sm me-1" /> : null}
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
