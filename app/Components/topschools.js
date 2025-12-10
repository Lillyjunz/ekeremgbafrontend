const TopSchools = () => {
  const schoolsData = [
    { rank: 1, name: "St. Mary Major College Abayi Ariria, Aba" },
    { rank: 2, name: "St. Paul Secondary School Abaukwu, Aba" },
    { rank: 3, name: "St. Peter Model Secondary School, Aba" },
    { rank: 4, name: "Resurrection Model Academy, Aba" },
    { rank: 5, name: "St. Martin Early Learning Academy, Aba" },
    { rank: 6, name: "Our Lady of Lourdes Model Secondary School, Aba" },
    { rank: 7, name: "St. Peter Secondary School Egbelu Ntigha" },
    { rank: 8, name: "Mercy Girls Secondary, Aba" },
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
            <h1
              className="top-schools-title text-center mb-5"
              data-aos="fade-up"
              data-aos-duration="800"
            >
              Top schools from Our Last Competition
            </h1>

            <div
              className="schools-table-wrapper"
              data-aos="fade-up"
              data-aos-delay="100"
              data-aos-duration="800"
            >
              <div className="table-responsive">
                <table className="table schools-table">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="rank-header"
                        data-aos="fade-right"
                        data-aos-delay="200"
                        data-aos-duration="600"
                      >
                        #
                      </th>
                      <th
                        scope="col"
                        className="school-header"
                        data-aos="fade-left"
                        data-aos-delay="200"
                        data-aos-duration="600"
                      >
                        School Name
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {schoolsData.map((school, index) => (
                      <tr
                        key={index}
                        className="school-row"
                        data-aos="fade-up"
                        data-aos-delay={300 + index * 50}
                        data-aos-duration="600"
                      >
                        <td className="rank-cell">
                          {school.rank}
                          <sup className="ordinal-suffix">
                            {getOrdinalSuffix(school.rank)}
                          </sup>
                        </td>
                        <td className="school-name-cell">{school.name}</td>
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
