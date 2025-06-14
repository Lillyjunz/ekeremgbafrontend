// "use client";

// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import styles from "./dashboard.module.css";

// export default function Dashboard() {
//   const [showModal, setShowModal] = useState(false);
//   const [step, setStep] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedSchools, setSelectedSchools] = useState([]);
//   const [newSchoolName, setNewSchoolName] = useState("");
//   const [showAddSchoolInput, setShowAddSchoolInput] = useState(false);
//   const router = useRouter();

//   // Sample schools data
//   const [availableSchools, setAvailableSchools] = useState([
//     { id: 1, name: "The Pen College" },
//     { id: 2, name: "The Topmost Schools" },
//     { id: 3, name: "High school" },
//     { id: 4, name: "The Place" },
//     { id: 5, name: "The Topmost Schools" },
//   ]);

//   useEffect(() => {
//     document.body.style.overflow = showModal ? "hidden" : "auto";
//   }, [showModal]);

//   // Toggle school selection
//   const toggleSchoolSelection = (schoolId) => {
//     setSelectedSchools((prev) =>
//       prev.includes(schoolId)
//         ? prev.filter((id) => id !== schoolId)
//         : [...prev, schoolId]
//     );
//   };

//   // Add all schools
//   const addAllSchools = () => {
//     const allSchoolIds = availableSchools.map((school) => school.id);
//     setSelectedSchools(allSchoolIds);
//   };

//   // Remove all schools
//   const removeAllSchools = () => {
//     setSelectedSchools([]);
//   };

//   // Add new school
//   const handleAddNewSchool = () => {
//     if (newSchoolName.trim()) {
//       const newSchool = {
//         id: availableSchools.length + 1,
//         name: newSchoolName.trim(),
//       };
//       setAvailableSchools([...availableSchools, newSchool]);
//       setSelectedSchools([...selectedSchools, newSchool.id]);
//       setNewSchoolName("");
//       setShowAddSchoolInput(false);
//     }
//   };

//   // Simulate loading and navigate
//   const handleFinalSubmit = (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setTimeout(() => {
//       // Navigate directly without hiding modal first
//       router.push("/admin/dashboard/tournament");
//       // Clean up after navigation starts
//       setIsLoading(false);
//       setShowModal(false);
//     }, 2000);
//   };

//   const resetModal = () => {
//     setShowModal(false);
//     setStep(1);
//     setIsLoading(false);
//     setSelectedSchools([]);
//     setNewSchoolName("");
//     setShowAddSchoolInput(false);
//   };

//   return (
//     <div className="row">
//       <div className="col-12">
//         {/* Header */}
//         <div
//           className={`d-flex justify-content-between align-items-center ${styles.contentHeader}`}
//         >
//           <div className={styles.tournamentSelector}>
//             <div
//               className="dropdown p-2"
//               style={{
//                 border: "2px solid #f2f2f2",
//                 borderRadius: "15px",
//                 backgroundColor: "#fff",
//               }}
//             >
//               <button
//                 className={`btn  ${styles.tournamentBtn}`}
//                 type="button"
//                 data-bs-toggle="dropdown"
//               >
//                 Ekeremgba - Akpauche 2025
//                 <i className="bi bi-chevron-down ms-2"></i>
//               </button>
//               <ul className="dropdown-menu">
//                 <li>
//                   <a className="dropdown-item" href="#">
//                     Ekeremgba - Akpauche 2025
//                   </a>
//                 </li>
//                 <li>
//                   <a className="dropdown-item" href="#">
//                     Tournament 2024
//                   </a>
//                 </li>
//                 <li>
//                   <a className="dropdown-item" href="#">
//                     Championship 2023
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           <button
//             className={styles.createBtn}
//             onClick={() => setShowModal(true)}
//           >
//             Create Tournament
//           </button>
//         </div>

//         {/* Empty State */}
//         <div className={styles.emptyState}>
//           <div className={styles.emptyIcon}>
//             <div className={styles.iconCircle}>
//               <i className="bi bi-trophy"></i>
//             </div>
//           </div>
//           <h3 className={styles.emptyTitle}>No Tournament</h3>
//           <p className={styles.emptyText}>
//             You have not created any competition
//           </p>
//           <button
//             className={styles.startBtn}
//             onClick={() => setShowModal(true)}
//           >
//             Start a Competition
//           </button>
//         </div>
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div className={styles.modalOverlay}>
//           <div
//             className={`${styles.modalPanel} ${
//               step === 2 ? styles.modalPanelWide : ""
//             }`}
//           >
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h5 className="fw-bold">Tournament</h5>
//               <button onClick={resetModal} className="btn-close"></button>
//             </div>

//             {/* Step 1 - Tournament Details */}
//             {step === 1 && (
//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   setStep(2);
//                 }}
//               >
//                 <div className="mb-3">
//                   <label className="form-label">
//                     Tournament Name<span className="text-danger">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Ekeremgba - Akpauche 2025"
//                     required
//                   />
//                 </div>
//                 <div className="row">
//                   <div className="col">
//                     <label className="form-label">
//                       Number of participants
//                       <span className="text-danger">*</span>
//                     </label>
//                     <select className="form-select shadow-none" required>
//                       <option value="">Select</option>
//                       <option value="8">8 participants</option>
//                       <option value="16">16 participants</option>
//                       <option value="32">32 participants</option>
//                     </select>
//                   </div>
//                   <div className="col">
//                     <label className="form-label">
//                       Number of groups<span className="text-danger">*</span>
//                     </label>
//                     <select className="form-select shadow-none" required>
//                       <option value="">Select</option>
//                       <option value="2">2 groups</option>
//                       <option value="4">4 groups</option>
//                       <option value="8">8 groups</option>
//                     </select>
//                   </div>
//                 </div>
//                 <div className="row mt-3">
//                   <div className="col">
//                     <label className="form-label">Date</label>
//                     <input type="date" className="form-control" />
//                   </div>
//                   <div className="col">
//                     <label className="form-label">Time</label>
//                     <input type="time" className="form-control" />
//                   </div>
//                 </div>
//                 <div className="mt-3">
//                   <label className="form-label">Location</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Location"
//                   />
//                 </div>
//                 <div className="mt-3">
//                   <label className="form-label">Description</label>
//                   <textarea
//                     className="form-control"
//                     rows="3"
//                     placeholder="Description"
//                   ></textarea>
//                 </div>
//                 <div className="mt-4">
//                   <button
//                     type="submit"
//                     className="btn w-100"
//                     style={{
//                       background: "linear-gradient(to right, #b30000, #660000)",
//                       color: "#fff",
//                       borderRadius: "30px",
//                     }}
//                   >
//                     Continue
//                   </button>
//                 </div>
//               </form>
//             )}

//             {/* Step 2 - Add Schools */}
//             {step === 2 && !isLoading && (
//               <div className={styles.addSchoolsContainer}>
//                 <div className="d-flex justify-content-between align-items-center mb-4">
//                   <h6 className="fw-bold mb-0">Add Schools</h6>
//                   <button
//                     className={styles.addAllBtn}
//                     onClick={
//                       selectedSchools.length === availableSchools.length
//                         ? removeAllSchools
//                         : addAllSchools
//                     }
//                   >
//                     {selectedSchools.length === availableSchools.length
//                       ? "Remove All"
//                       : "Add All"}
//                   </button>
//                 </div>

//                 <div className={styles.schoolsList}>
//                   {availableSchools.map((school) => (
//                     <div key={school.id} className={styles.schoolItem}>
//                       <span className={styles.schoolName}>{school.name}</span>
//                       <button
//                         className={`${styles.addBtn} ${
//                           selectedSchools.includes(school.id)
//                             ? styles.addBtnActive
//                             : ""
//                         }`}
//                         onClick={() => toggleSchoolSelection(school.id)}
//                       >
//                         {selectedSchools.includes(school.id) ? "Added" : "Add"}
//                       </button>
//                     </div>
//                   ))}

//                   {/* Add New School */}
//                   {showAddSchoolInput ? (
//                     <div className={styles.addSchoolInput}>
//                       <input
//                         type="text"
//                         className="form-control"
//                         placeholder="Enter school name"
//                         value={newSchoolName}
//                         onChange={(e) => setNewSchoolName(e.target.value)}
//                         onKeyPress={(e) =>
//                           e.key === "Enter" && handleAddNewSchool()
//                         }
//                         autoFocus
//                       />
//                       <div className="mt-2">
//                         <button
//                           className="btn btn-sm btn-success me-2"
//                           onClick={handleAddNewSchool}
//                         >
//                           Add
//                         </button>
//                         <button
//                           className="btn btn-sm btn-secondary"
//                           onClick={() => {
//                             setShowAddSchoolInput(false);
//                             setNewSchoolName("");
//                           }}
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   ) : (
//                     <button
//                       className={styles.addNewSchoolBtn}
//                       onClick={() => setShowAddSchoolInput(true)}
//                     >
//                       <i className="bi bi-plus"></i>
//                       Add School
//                     </button>
//                   )}
//                 </div>

//                 <div className="mt-4">
//                   <button
//                     onClick={handleFinalSubmit}
//                     className="btn w-100"
//                     style={{
//                       background: "linear-gradient(to right, #b30000, #660000)",
//                       color: "#fff",
//                       borderRadius: "30px",
//                       padding: "12px",
//                     }}
//                     disabled={selectedSchools.length === 0}
//                   >
//                     Create Tournament ({selectedSchools.length} schools
//                     selected)
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Loading */}
//             {isLoading && (
//               <div className="text-center py-5">
//                 <div
//                   className="spinner-border text-danger"
//                   role="status"
//                   style={{ width: "3rem", height: "3rem" }}
//                 >
//                   <span className="visually-hidden">Loading...</span>
//                 </div>
//                 <p className="mt-3">
//                   Please wait while we prepare your Tournament...
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./dashboard.module.css";

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSchools, setSelectedSchools] = useState([]);
  const [newSchoolName, setNewSchoolName] = useState("");
  const [showAddSchoolInput, setShowAddSchoolInput] = useState(false);
  const [showSchoolForm, setShowSchoolForm] = useState(false);
  const [schoolFormData, setSchoolFormData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    emailAddress: "",
    numberOfRepresentatives: "",
  });
  const router = useRouter();

  // Sample schools data
  const [availableSchools, setAvailableSchools] = useState([
    { id: 1, name: "The Pen College" },
    { id: 2, name: "The Topmost Schools" },
    { id: 3, name: "High school" },
    { id: 4, name: "The Place" },
    { id: 5, name: "The Topmost Schools" },
  ]);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
  }, [showModal]);

  // Toggle school selection
  const toggleSchoolSelection = (schoolId) => {
    setSelectedSchools((prev) =>
      prev.includes(schoolId)
        ? prev.filter((id) => id !== schoolId)
        : [...prev, schoolId]
    );
  };

  // Add all schools
  const addAllSchools = () => {
    const allSchoolIds = availableSchools.map((school) => school.id);
    setSelectedSchools(allSchoolIds);
  };

  // Remove all schools
  const removeAllSchools = () => {
    setSelectedSchools([]);
  };

  // Handle school form input changes
  const handleSchoolFormChange = (field, value) => {
    setSchoolFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle school form submission
  const handleSchoolFormSubmit = (e) => {
    e.preventDefault();

    // Create new school object
    const newSchool = {
      id: availableSchools.length + 1,
      name: schoolFormData.name,
      address: schoolFormData.address,
      phoneNumber: schoolFormData.phoneNumber,
      emailAddress: schoolFormData.emailAddress,
      numberOfRepresentatives: schoolFormData.numberOfRepresentatives,
    };

    // Add to available schools and select it
    setAvailableSchools([...availableSchools, newSchool]);
    setSelectedSchools([...selectedSchools, newSchool.id]);

    // Reset form and close modal
    setSchoolFormData({
      name: "",
      address: "",
      phoneNumber: "",
      emailAddress: "",
      numberOfRepresentatives: "",
    });
    setShowSchoolForm(false);
  };

  // Cancel school form
  const handleCancelSchoolForm = () => {
    setSchoolFormData({
      name: "",
      address: "",
      phoneNumber: "",
      emailAddress: "",
      numberOfRepresentatives: "",
    });
    setShowSchoolForm(false);
  };

  // Add new school (legacy function - now opens form)
  const handleAddNewSchool = () => {
    if (newSchoolName.trim()) {
      const newSchool = {
        id: availableSchools.length + 1,
        name: newSchoolName.trim(),
      };
      setAvailableSchools([...availableSchools, newSchool]);
      setSelectedSchools([...selectedSchools, newSchool.id]);
      setNewSchoolName("");
      setShowAddSchoolInput(false);
    }
  };

  // Simulate loading and navigate
  const handleFinalSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      // Navigate directly without hiding modal first
      router.push("/admin/dashboard/tournament");
      // Clean up after navigation starts
      setIsLoading(false);
      setShowModal(false);
    }, 2000);
  };

  const resetModal = () => {
    setShowModal(false);
    setStep(1);
    setIsLoading(false);
    setSelectedSchools([]);
    setNewSchoolName("");
    setShowAddSchoolInput(false);
    setShowSchoolForm(false);
    setSchoolFormData({
      name: "",
      address: "",
      phoneNumber: "",
      emailAddress: "",
      numberOfRepresentatives: "",
    });
  };

  return (
    <div className="row">
      <div className="col-12">
        {/* Header */}
        <div
          className={`d-flex justify-content-between align-items-center ${styles.contentHeader}`}
        >
          <div className={styles.tournamentSelector}>
            <div
              className="dropdown p-2"
              style={{
                border: "2px solid #f2f2f2",
                borderRadius: "15px",
                backgroundColor: "#fff",
              }}
            >
              <button
                className={`btn  ${styles.tournamentBtn}`}
                type="button"
                data-bs-toggle="dropdown"
              >
                Ekeremgba - Akpauche 2025
                <i className="bi bi-chevron-down ms-2"></i>
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#">
                    Ekeremgba - Akpauche 2025
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Tournament 2024
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Championship 2023
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <button
            className={styles.createBtn}
            onClick={() => setShowModal(true)}
          >
            Create Tournament
          </button>
        </div>

        {/* Empty State */}
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <div className={styles.iconCircle}>
              <i className="bi bi-trophy"></i>
            </div>
          </div>
          <h3 className={styles.emptyTitle}>No Tournament</h3>
          <p className={styles.emptyText}>
            You have not created any competition
          </p>
          <button
            className={styles.startBtn}
            onClick={() => setShowModal(true)}
          >
            Start a Competition
          </button>
        </div>
      </div>

      {/* Main Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div
            className={`${styles.modalPanel} ${
              step === 2 ? styles.modalPanelWide : ""
            }`}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold">Tournament</h5>
              <button onClick={resetModal} className="btn-close"></button>
            </div>

            {/* Step 1 - Tournament Details */}
            {step === 1 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setStep(2);
                }}
              >
                <div className="mb-3">
                  <label className="form-label">
                    Tournament Name<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ekeremgba - Akpauche 2025"
                    required
                  />
                </div>
                <div className="row">
                  <div className="col">
                    <label className="form-label">
                      Number of participants
                      <span className="text-danger">*</span>
                    </label>
                    <select className="form-select shadow-none" required>
                      <option value="">Select</option>
                      <option value="8">8 participants</option>
                      <option value="16">16 participants</option>
                      <option value="32">32 participants</option>
                    </select>
                  </div>
                  <div className="col">
                    <label className="form-label">
                      Number of groups<span className="text-danger">*</span>
                    </label>
                    <select className="form-select shadow-none" required>
                      <option value="">Select</option>
                      <option value="2">2 groups</option>
                      <option value="4">4 groups</option>
                      <option value="8">8 groups</option>
                    </select>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col">
                    <label className="form-label">Date</label>
                    <input type="date" className="form-control" />
                  </div>
                  <div className="col">
                    <label className="form-label">Time</label>
                    <input type="time" className="form-control" />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Location"
                  />
                </div>
                <div className="mt-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Description"
                  ></textarea>
                </div>
                <div className="mt-4">
                  <button
                    type="submit"
                    className="btn w-100"
                    style={{
                      background: "linear-gradient(to right, #b30000, #660000)",
                      color: "#fff",
                      borderRadius: "30px",
                    }}
                  >
                    Continue
                  </button>
                </div>
              </form>
            )}

            {/* Step 2 - Add Schools */}
            {step === 2 && !isLoading && (
              <div className={styles.addSchoolsContainer}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h6 className="fw-bold mb-0">Add Schools</h6>
                  <button
                    className={styles.addAllBtn}
                    onClick={
                      selectedSchools.length === availableSchools.length
                        ? removeAllSchools
                        : addAllSchools
                    }
                  >
                    {selectedSchools.length === availableSchools.length
                      ? "Remove All"
                      : "Add All"}
                  </button>
                </div>

                <div className={styles.schoolsList}>
                  {availableSchools.map((school) => (
                    <div key={school.id} className={styles.schoolItem}>
                      <span className={styles.schoolName}>{school.name}</span>
                      <button
                        className={`${styles.addBtn} ${
                          selectedSchools.includes(school.id)
                            ? styles.addBtnActive
                            : ""
                        }`}
                        onClick={() => toggleSchoolSelection(school.id)}
                      >
                        {selectedSchools.includes(school.id) ? "Added" : "Add"}
                      </button>
                    </div>
                  ))}

                  {/* Add New School */}
                  {showAddSchoolInput ? (
                    <div className={styles.addSchoolInput}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter school name"
                        value={newSchoolName}
                        onChange={(e) => setNewSchoolName(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleAddNewSchool()
                        }
                        autoFocus
                      />
                      <div className="mt-2">
                        <button
                          className="btn btn-sm btn-success me-2"
                          onClick={handleAddNewSchool}
                        >
                          Add
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => {
                            setShowAddSchoolInput(false);
                            setNewSchoolName("");
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className={styles.addNewSchoolBtn}
                      onClick={() => setShowSchoolForm(true)}
                    >
                      <i className="bi bi-plus"></i>
                      Add School
                    </button>
                  )}
                </div>

                <div className="mt-4">
                  <button
                    onClick={handleFinalSubmit}
                    className="btn w-100"
                    style={{
                      background: "linear-gradient(to right, #b30000, #660000)",
                      color: "#fff",
                      borderRadius: "30px",
                      padding: "12px",
                    }}
                    disabled={selectedSchools.length === 0}
                  >
                    Create Tournament ({selectedSchools.length} schools
                    selected)
                  </button>
                </div>
              </div>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="text-center py-5">
                <div
                  className="spinner-border text-danger"
                  role="status"
                  style={{ width: "3rem", height: "3rem" }}
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">
                  Please wait while we prepare your Tournament...
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* School Details Form Modal */}
      {showSchoolForm && (
        <div className={styles.modalOverlay} style={{ zIndex: 1060 }}>
          <div
            className={styles.modalPanel}
            style={{ maxWidth: "500px", width: "90%" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold">Add a School</h5>
              <button
                onClick={handleCancelSchoolForm}
                className="btn-close"
                style={{ fontSize: "1.2rem" }}
              ></button>
            </div>

            <form onSubmit={handleSchoolFormSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted">
                  School name<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="noah concern"
                  value={schoolFormData.name}
                  onChange={(e) =>
                    handleSchoolFormChange("name", e.target.value)
                  }
                  required
                  style={{
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #e9ecef",
                    borderRadius: "8px",
                    padding: "12px",
                  }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted">
                  Address<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="noah@gmail.com"
                  value={schoolFormData.address}
                  onChange={(e) =>
                    handleSchoolFormChange("address", e.target.value)
                  }
                  required
                  style={{
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #e9ecef",
                    borderRadius: "8px",
                    padding: "12px",
                  }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted">
                  Phone number<span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="noah@gmail.com"
                  value={schoolFormData.phoneNumber}
                  onChange={(e) =>
                    handleSchoolFormChange("phoneNumber", e.target.value)
                  }
                  required
                  style={{
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #e9ecef",
                    borderRadius: "8px",
                    padding: "12px",
                  }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted">
                  Email address<span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="noah@gmail.com"
                  value={schoolFormData.emailAddress}
                  onChange={(e) =>
                    handleSchoolFormChange("emailAddress", e.target.value)
                  }
                  required
                  style={{
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #e9ecef",
                    borderRadius: "8px",
                    padding: "12px",
                  }}
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-muted">
                  Number of Representatives
                </label>
                <select
                  className="form-select"
                  value={schoolFormData.numberOfRepresentatives}
                  onChange={(e) =>
                    handleSchoolFormChange(
                      "numberOfRepresentatives",
                      e.target.value
                    )
                  }
                  style={{
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #e9ecef",
                    borderRadius: "8px",
                    padding: "12px",
                  }}
                >
                  <option value="">Select</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                </select>
              </div>

              <div className="d-grid">
                <button
                  type="submit"
                  className="btn"
                  style={{
                    background: "linear-gradient(to right, #b30000, #660000)",
                    color: "#fff",
                    borderRadius: "30px",
                    padding: "12px 0",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  Add School
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
