"use client";

const HowItWorks = () => {
  return (
    <section className="how-it-works py-5">
      <div className="container">
        <h2 className="section-title mb-5">How it works</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="how-card p-4 h-100">
              <div className="icon-wrapper mb-3">
                <i className="bi bi-mortarboard"></i>
              </div>
              <h5 className="fw-bold">Register Your School</h5>
              <p className="mb-0">
                Sign up your school and select which competitions to join—Math,
                Debate, Science, or more.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="how-card p-4 h-100">
              <div className="icon-wrapper mb-3">
                <i className="bi bi-mic"></i>
              </div>
              <h5 className="fw-bold">Compete</h5>
              <p className="mb-0">
                Students represent their schools in scheduled rounds, judged
                live or scored in real-time with full transparency.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="how-card p-4 h-100">
              <div className="icon-wrapper mb-3">
                <i className="bi bi-award"></i>
              </div>
              <h5 className="fw-bold">Earn Points & Get Recognized</h5>
              <p className="mb-0">
                Top performers move up the leaderboard. Winners receive awards,
                certificates, and national recognition.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
