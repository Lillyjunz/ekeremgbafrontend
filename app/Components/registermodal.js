// components/RegisterModal.js
"use client";
import { useRouter } from "next/navigation";

const RegisterModal = ({ onClose }) => {
  const router = useRouter();

  const handleClose = () => {
    router.back(); // takes user to the previous page
  };

  return (
    <div className="modal-overlay d-flex justify-content-center align-items-center">
      <div className="bg-white shadow p-4 modal-content-custom">
        <div className="d-flex justify-content-end">
          <button
            className="btn-close float end"
            onClick={handleClose}
          ></button>
        </div>
        <h3 className="text-center fw-semibold">Register your School</h3>
        <p className="text-center mb-4 text-muted">
          Kindly fill this form to reach out to a Consultant
        </p>

        <form>
          <div className="mb-3">
            <label className="form-label">School name*</label>
            <input
              type="text"
              className="form-control"
              placeholder="Noah Naheem"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Address*</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter school address"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone number*</label>
            <input
              type="tel"
              className="form-control"
              placeholder="08012345678"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email address*</label>
            <input
              type="email"
              className="form-control"
              placeholder="school@email.com"
            />
          </div>

          <label className="form-label">Number of Representatives</label>
          <div className="row mb-3">
            {[1, 2, 3, 4].map((n) => (
              <div className="col-6 mb-2" key={n}>
                <input
                  type="text"
                  className="form-control"
                  placeholder={`${n}.`}
                />
              </div>
            ))}
          </div>

          <div className="form-check mb-3">
            <input className="form-check-input" type="checkbox" id="terms" />
            <label className="form-check-label" htmlFor="terms">
              Accept our Terms and Conditions
            </label>
          </div>

          <button type="submit" className="btn w-100 join-button">
            Join the Tournament
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
