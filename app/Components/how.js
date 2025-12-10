"use client";

const HowItWorks = () => {
  return (
    <section className="how-it-works py-5">
      <div className="container">
        <h2
          className="section-title mb-5"
          data-aos="fade-up"
          data-aos-duration="800"
        >
          How it works
        </h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div
              className="how-card p-4 h-100"
              data-aos="fade-up"
              data-aos-delay="100"
              data-aos-duration="800"
            >
              <div className="icon-wrapper mb-3">
                <i className="bi bi-mortarboard"></i>
              </div>
              <h5 className="fw-bold">Register Your School</h5>
              <p className="mb-0">
                Schools can register directly through our online form or by
                contacting the organisers. You&apos;ll receive full
                participation guidelines, category lists, and rehearsal tips.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className="how-card p-4 h-100"
              data-aos="fade-up"
              data-aos-delay="200"
              data-aos-duration="800"
            >
              <div className="icon-wrapper mb-3">
                <i className="bi bi-mic"></i>
              </div>
              <h5 className="fw-bold">Compete</h5>
              <p className="mb-0">
                Dozens of schools have joined the Ekeremgba Akpauche journey,
                each contributing to the colourful showcase of Igbo excellence.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className="how-card p-4 h-100"
              data-aos="fade-up"
              data-aos-delay="300"
              data-aos-duration="800"
            >
              <div className="icon-wrapper mb-3">
                <i className="bi bi-award"></i>
              </div>
              <h5 className="fw-bold">Rules and Guidelines</h5>
              <p className="mb-0">
                Participation is open to registered schools. Each team is guided
                by clear rules promoting fairness, teamwork, and cultural
                accuracy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
