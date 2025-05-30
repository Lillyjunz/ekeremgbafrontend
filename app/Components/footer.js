import Image from "next/image";

const Footer = () => {
  return (
    <div>
      <div
        className="container-fluid footer  "
        style={{ backgroundColor: "#FAFAFA" }}
      >
        <div className="container pt-5 pb-4">
          <div className="row g-5">
            <div className="col-lg-3 col-md-6">
              <div>
                <Image
                  src="/images/logo.png"
                  width={130}
                  height={80}
                  alt="logo"
                ></Image>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 align-items-center">
              <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                <h3 className="fw-bold foot-link">Contact</h3>

                <div className="mt-4 d-flex flex-column help-link">
                  <a href="#" className="py-3foot-link ">
                    <i className="fas fa-phone-alt foot-link me-2"></i>
                    +234 803 381 8511
                  </a>
                  <a href="#" className="py-3 foot-linkt">
                    <i className="fas fa-envelope foot-link me-2"></i>{" "}
                    ekeremgba@gmail.com
                  </a>
                </div>
              </ul>
            </div>

            <div className="col-lg-3 col-md-6">
              <a href="" className="h3 fw-bold foot-link">
                Help Link
              </a>
              <div className="mt-4 d-flex flex-column help-link">
                <a href="" className="mb-2 ">
                  <i className="fas fa-angle-right foot-link me-2"></i>Terms Of
                  use
                </a>
                <a href="" className="mb-2 ">
                  <i className="fas fa-angle-right foot-link me-2"></i>
                  Privacy Policy
                </a>
                <a href="/about" className="mb-2 ">
                  <i className="fas fa-angle-right foot-link me-2"></i>
                  About
                </a>
                <a href="#Faq" className="mb-2 ">
                  <i className="fas fa-angle-right foot-link me-2"></i>FQAs
                </a>
                <a href="/contact" className="mb-2 ">
                  <i className="fas fa-angle-right foot-link me-2"></i>
                  Contact
                </a>
              </div>
            </div>

            <div className="col-lg-2 col-md-6">
              <div className="d-flex hightech-link">
                <div className=" nav-fill btn btn-sm-square rounded-circle top me-2">
                  <i className="bi bi-facebook" style={{ color: "white" }}></i>
                </div>

                <div className=" nav-fill btn btn-sm-square rounded-circle top me-2">
                  <i className="bi bi-instagram" style={{ color: "white" }}></i>
                </div>
                <div className="nav-fill btn btn-sm-square rounded-circle me-0 top">
                  <i className="bi bi-linkedin" style={{ color: "white" }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
