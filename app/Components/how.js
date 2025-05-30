"use client";

const HowItWorks = () => {
  return (
    <section className="hiw-section">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="hiw-title hiw-fade-in">How it works</h2>
          </div>
        </div>

        <div className="row g-4">
          {/* Step 1: Register Your School */}
          <div className="col-lg-4 col-md-6">
            <div className="hiw-card hiw-fade-in">
              <div className="hiw-icon-container">
                <svg className="hiw-icon" viewBox="0 0 24 24">
                  <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
                </svg>
              </div>
              <h3 className="hiw-card-title">Register Your School</h3>
              <p className="hiw-card-description">
                Sign up your school and select which competitions to join—Math,
                Debate, Science, or more.
              </p>
            </div>
          </div>

          {/* Step 2: Compete */}
          <div className="col-lg-4 col-md-6">
            <div className="hiw-card hiw-fade-in">
              <div className="hiw-icon-container">
                <svg className="hiw-icon" viewBox="0 0 24 24">
                  <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
                </svg>
              </div>
              <h3 className="hiw-card-title">Compete</h3>
              <p className="hiw-card-description">
                Students represent their schools in scheduled rounds, judged
                live or scored in real-time with full transparency.
              </p>
            </div>
          </div>

          {/* Step 3: Earn Points & Get Recognition */}
          <div className="col-lg-4 col-md-12">
            <div className="hiw-card hiw-fade-in">
              <div className="hiw-icon-container">
                <svg className="hiw-icon" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h3 className="hiw-card-title">Earn Points & Get Recognition</h3>
              <p className="hiw-card-description">
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
