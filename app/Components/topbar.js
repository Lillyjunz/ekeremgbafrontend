const Topbar = () => {
  return (
    <>
      <div
        className="container-fluid py-2 d-none d-md-flex"
        style={{ backgroundColor: "black" }}
      >
        <div className="container">
          <div className="d-flex justify-content-between topbar align-items-center">
            <div className="top-info">
              <small className="me-5" style={{ color: "#7D7D7F" }}>
                <i
                  className="bi bi-telephone me-2"
                  style={{ color: "#C71D12" }}
                ></i>
                <i className="uis uis-envelope-search"></i>
                +234 803 381 8511
              </small>
              <small className="me-3 text-white-50">
                <i
                  className="bi bi-envelope me-2"
                  style={{ color: "#C71D12" }}
                ></i>
                enquiries@codedextersacademy.com
              </small>
            </div>
            <div></div>

            <div className="top-link d-flex gap-2">
              <div className=" nav-fill btn btn-sm-square rounded-circle top">
                <i className="bi bi-facebook" style={{ color: "white" }}></i>
              </div>
              <div className=" nav-fill btn btn-sm-square rounded-circle top">
                <i className="bi bi-instagram" style={{ color: "white" }}></i>
              </div>
              <div className="nav-fill btn btn-sm-square rounded-circle me-0 top">
                <i className="bi bi-linkedin" style={{ color: "white" }}></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Topbar;
