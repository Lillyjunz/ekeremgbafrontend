// components/CallToAction.js
"use client";

const CallToAction = () => {
  return (
    <section className="py-5" style={{ backgroundColor: "#fafafa" }}>
      <div className="cta-section container">
        <div className="cta-background"></div>
        <div className="cta-overlay"></div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10 text-center">
              <div className="cta-content">
                <h2 className="cta-title">Ready to Join the Game?</h2>
                <button className="btn-register">Register your School</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
