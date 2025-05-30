const TopSchools = () => {
  const schoolsData = [
    { rank: 1, name: "The Pen College", score: 1056 },
    { rank: 2, name: "The Topmost Schools", score: 1040 },
    { rank: 4, name: "The Excel Schools", score: 1030 },
    { rank: 5, name: "The Topmost Schools", score: 1040 },
    { rank: 6, name: "The Topmost Schools", score: 1040 },
  ];

  const getOrdinalSuffix = (num) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const remainder = num % 100;
    return (
      suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0]
    );
  };

  return (
    <div className="top-schools-container">
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-8">
            <h1 className="top-schools-title text-center mb-5">
              Top schools from Our Last Competition
            </h1>

            <div className="schools-table-wrapper">
              <div className="table-responsive">
                <table className="table schools-table">
                  <thead>
                    <tr>
                      <th scope="col" className="rank-header">
                        #
                      </th>
                      <th scope="col" className="school-header">
                        School Name
                      </th>
                      <th scope="col" className="score-header">
                        Scores
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {schoolsData.map((school, index) => (
                      <tr key={index} className="school-row">
                        <td className="rank-cell">
                          {school.rank}
                          <sup className="ordinal-suffix">
                            {getOrdinalSuffix(school.rank)}
                          </sup>
                        </td>
                        <td className="school-name-cell">{school.name}</td>
                        <td className="score-cell">{school.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopSchools;
