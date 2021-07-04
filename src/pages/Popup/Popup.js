import React from 'react';

import CSVReader from 'react-csv-reader';

import Spinner from '../Spinner/Spinner';
// import DomApp from '../Background/index.js';

import './Popup.css';

const Popup = () => {
  const [csvData, setCsvData] = React.useState([]);
  const [csvRows, setCsvRows] = React.useState([]);
  const [showBtn, setShowBtn] = React.useState(false);
  const [counter, setCounter] = React.useState(0);
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [socialPlatforms, setSocialPlatforms] = React.useState(null);

  const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.toLowerCase().replace(/\W/g, '_'),
  };

  const opneNewTabLinkedin = (userData) => {
    const { name, companyname } = userData;
    const linkedinUrl = `https://www.linkedin.com/search/results/all/?keywords=${name}%20${companyname}&origin=GLOBAL_SEARCH_HEADER`;
    return linkedinUrl;
  };

  const opneNewTabTumblr = (userData) => {
    const { companyname } = userData;
    const tumblrUrl = `https://www.tumblr.com/search/${companyname}`;
    return tumblrUrl;
  };

  const opneNewTabPinterest = (userData) => {
    const { companyname } = userData;
    const Pinterest = `https://www.pinterest.com/search/pins/?q=${companyname}&rs=typed&term_meta[]=${companyname}`;
    return Pinterest;
  };

  const openTabBy = (userData) => {
    if (socialPlatforms === 'tumblr') {
      return opneNewTabTumblr(userData);
    }
    if (socialPlatforms === 'pinterest') {
      return opneNewTabPinterest(userData);
    }
    if (socialPlatforms === 'linkedin') {
      return opneNewTabLinkedin(userData);
    }
    return [];
  };
  const perChunk = () => {
    const spitedCsv = csvData.reduce((all, one, i) => {
      const perChunk = 10;
      const ch = Math.floor(i / perChunk);
      all[ch] = [].concat(all[ch] || [], one);
      return all;
    }, []);
    setCsvRows(spitedCsv);
    setShowBtn(spitedCsv.length > 1);
  };

  //1. show btn only if i have more then 10 rows
  //2. btn should triggered a new function that takeing the next 10 rows (next cell value [[10],[10]] )
  //3.if the array is equal to the array length the btn should be disabled.

  const handleOpenLinkedin = () => {
    const rowsByCounter = csvRows[counter];
    const tabUrls = [];
    for (let index = 0; index < rowsByCounter.length; index++) {
      const { name, companyname } = rowsByCounter[index];
      const url = openTabBy({ name, companyname });
      tabUrls.push(url);
    }

    chrome.windows.create({
      // Just use the full URL if you need to open an external page
      url: tabUrls,
    });
  };

  React.useEffect(() => {
    perChunk();
    CsvNames();
  }, [csvData]);

  React.useEffect(() => {
    CsvNames();
  }, [csvRows]);
  React.useEffect(() => {
    // const data = DomApp(document);
  }, [document.readyState === 'complete']);

  React.useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [loading]);

  const helloHandeler = () => {
    setLoading(!loading);
    setTimeout(() => {
      setLoading(!loading);
      setShow(!show);
    }, 2000);
  };

  if (loading) return <Spinner />;

  const handleDarkSideForce = () => {};
  const CsvNames = () => {
    const data = csvRows[counter];
    return data ? (
      <table>
        <tbody>
          {data.map((item, i) => {
            return (
              <tr key={i} value={item}>
                <td>{item.name} </td>
                <td>{item.CompanyName} </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    ) : (
      []
    );
  };
  return (
    // <div className="App">
    //   <button id="start">Start</button>
    //   <button id="stop">Stop</button>

    //   {!socialPlatforms ? (
    //     <div className="App-header">
    //       <div className="Social-Platforms-Logos">
    //         <div
    //           className="Social-Btn"
    //           onClick={() => {
    //             helloHandeler();
    //             setSocialPlatforms('tumblr');
    //           }}
    //         >
    //           <img
    //             src="https://cdn.worldvectorlogo.com/logos/tumblr-icon-1.svg"
    //             alt="tumblr"
    //             width="100px"
    //             height="100px"
    //           />
    //         </div>
    //         <div
    //           className="Social-Btn"
    //           onClick={() => {
    //             helloHandeler();
    //             setSocialPlatforms('pinterest');
    //           }}
    //         >
    //           <img
    //             src="https://cdnlogo.com/logos/p/77/pinterest.svg"
    //             alt="pinterest"
    //             width="100px"
    //             height="100px"
    //           />
    //         </div>
    //         <div
    //           className="Social-Btn"
    //           onClick={() => {
    //             helloHandeler();
    //             setSocialPlatforms('linkedin');
    //           }}
    //         >
    //           <img
    //             src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Linkedin.svg/1200px-Linkedin.svg.png"
    //             alt="linkedin"
    //             width="100px"
    //             height="100px"
    //           />
    //         </div>
    //       </div>
    //     </div>
    //   ) : (
    //     <div style={{ height: '400px' }}>
    //       <div className="nameRow">
    //         <CSVReader
    //           cssClass="csv-reader-input"
    //           label="Select CSV with secret Death Star statistics"
    //           onFileLoaded={(data) => {
    //             setCsvData((prevCsvs) => [...prevCsvs, ...data]);
    //           }}
    //           onError={handleDarkSideForce}
    //           parserOptions={papaparseOptions}
    //           inputStyle={{ color: 'red' }}
    //         />
    //         {<CsvNames />}
    //         <button
    //           onClick={() => {
    //             handleOpenLinkedin();
    //           }}
    //         >
    //           open Tabs
    //         </button>
    //         {showBtn && (
    //           <>
    //             <button
    //               onClick={() => {
    //                 setCounter(counter + 1);
    //               }}
    //             >
    //               next
    //             </button>
    //             <button
    //               onClick={() => {
    //                 setCounter(counter - 1);
    //               }}
    //             >
    //               back
    //             </button>
    //           </>
    //         )}
    //       </div>
    //     </div>
    //   )}
    <div></div>
  );
};

export default Popup;
