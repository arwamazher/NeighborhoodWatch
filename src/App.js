import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Navbar, Nav, Form } from 'react-bootstrap';
import { BsSearch, BsHouseDoor, BsGlobeAmericas, BsExclamationTriangle, BsFillExclamationTriangleFill, BsGear, BsGeoAltFill, 
         BsSend, BsFillPersonFill, BsBellFill, BsFillLockFill, BsHeartFill, BsHandThumbsUp, BsFillHandThumbsUpFill } from 'react-icons/bs';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import chicago_crime_data from './chicago_crime_data.json';
import "./App.css";

function ReportButton({ onClick }) {
  return (
    <a href="#" onClick={onClick} className="report-button">
      <BsFillExclamationTriangleFill className="report-icon-fill" />
      <span className="button-text">Click here to fill out a report</span>
    </a>
  );
}

function SearchContainer({ onFavLocationsClick, searchQuery, setSearchQuery }) {
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value); // Update the search query state
  };
  return (
    <div className='search-container'>
      <BsSearch className='search-icon'/>
      <input 
        type="text" 
        className='search-input' 
        placeholder="Search (e.g. 123 S Sesame St)" 
        value={searchQuery} // Bind the input value to the search query state
        onChange={handleSearchInputChange}
      />
      <FavoriteLocationsButton onClick={onFavLocationsClick} />
    </div>
  );
}

function FavoriteLocationsButton({ onClick }) {
  return (
    <a href="#" onClick={onClick}>
      <BsHeartFill style={{color:'#DF6E6E'}} />
    </a>
  );
}

function Title({ title, style }) {
  return (
    <Container fluid>
      <Row>
        <Col xs={8} className='text-center'>
          <h1 className='title' style={style}>{title}</h1>
        </Col>
      </Row>
    </Container>
  );
}

function NavigationBar({ onHouseIconClick, onExclamationIconClick, onMapIconClick, onSettingsIconClick}) {
  return (
    <Navbar className="navigation-bar" fixed="bottom">
      <Container>
        <Nav className="justify-content-center">
          <NavItem icon={<BsHouseDoor />} onClick={onHouseIconClick} />
          <NavItem icon={<BsGlobeAmericas onClick={onMapIconClick} />} />
          <NavItem icon={<BsExclamationTriangle />} onClick={onExclamationIconClick} />
          <NavItem icon={<BsGear onClick={onSettingsIconClick} />} />
        </Nav>
      </Container>
    </Navbar>
  );
}

function NavItem({ icon, onClick }) {
  return (
    <Nav.Item className="mx-4">
      <Nav.Link href="#" onClick={onClick}>
        {React.cloneElement(icon, { className: 'nav-icon' })}
      </Nav.Link>
    </Nav.Item>
  );
}

// function RecentActivityPage({ reports, onSeeDetails, onReportButtonClick, favLocations }) {
//   const [scene, setScene] = useState('recentActivity'); // Manage current scene
//   const [selectedReport, setSelectedReport] = useState(null); // Store the selected report
//   const [thumbsUpFilled, setThumbsUpFilled] = useState({}); // Track filled status of thumbs-up buttons

//   // Function to handle thumbs-up button click
//   const handleThumbsUpClick = (index) => {
//     setThumbsUpFilled((prevState) => ({
//       ...prevState,
//       [index]: !prevState[index], // Toggle the filled status for the clicked thumbs-up button
//     }));
//   }

//   // Function to handle see details button click
//   return (
//     <>
//       <Title title='RECENT ACTIVITY'/>
//       <div className="scrollable-textbox">
//         <div className="text-content">
//           <ul className="recent-activity-list">
//             {/* Map over reports array to generate list dynamically */}
//             {reports.map((report, index) => (
//               <li key={report.case_}>
//                 {favLocations.includes(report.block) ? (
//                   <>
//                     <span className='report-category-activity-list'>{report.Category}</span> reported near {report.block} <BsHeartFill style={{color:'#DF6E6E'}} />
//                     <button onClick={() => onSeeDetails(report)}> &gt;&gt; See Details</button>
//                   </>
//                 ) : (
//                   <>
//                     <span className='report-category-activity-list'>{report.Category}</span> reported near {report.block}
//                     <button onClick={() => onSeeDetails(report)}> &gt;&gt; See Details</button>
//                   </>
//                 )} 
//                 {/* Thumbs-up button */}
//                 <button onClick={() => handleThumbsUpClick(index)} className="thumbs-up-button">
//                   {thumbsUpFilled[index] ? <BsFillHandThumbsUpFill className='thumbs-up' /> : <BsHandThumbsUp className='thumbs-up' style={{ color: '#69A031' }}/>}
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//       {/* Shortcut on recentActivityPage to fill out a report*/}
//       <div className="report-icon-fill">
//         <ReportButton onClick={onReportButtonClick} />
//       </div>
//     </>
//   );
// }
function RecentActivityPage({ reports, onSeeDetails, onReportButtonClick, favLocations }) {
  const [scene, setScene] = useState('recentActivity'); // Manage current scene
  const [selectedReport, setSelectedReport] = useState(null); // Store the selected report
  const [thumbsUpFilled, setThumbsUpFilled] = useState({}); // Track filled status of thumbs-up buttons
  const [userReports, setUserReports] = useState([]);

  useEffect(() => {
    const userReportsData = JSON.parse(sessionStorage.getItem('chicago_crime_data')) || [];
    // Sort the user reports from descending to ascending
    const sortedReports = [...userReportsData].sort((a, b) => new Date(b.date) - new Date(a.date));
    setUserReports(sortedReports);
  }, []);

  // Function to handle thumbs-up button click
  const handleThumbsUpClick = (index) => {
    setThumbsUpFilled((prevState) => ({
      ...prevState,
      [index]: !prevState[index], // Toggle the filled status for the clicked thumbs-up button
    }));
  }

  // Function to handle see details button click
  return (
    <>
      <Title title='RECENT ACTIVITY'/>
      <div className="scrollable-textbox">
        <div className="text-content">
          <ul className="recent-activity-list">
            {/* Map over reports array to generate list dynamically */}
             {userReports.map((report, index) => (
              <li key={report.case_}>
                {favLocations.includes(report.block) ? (
                  <>
                    <span className='report-category-activity-list'>{report.Category}</span> reported near {report.block} <BsHeartFill style={{color:'#DF6E6E'}} />
                    <button onClick={() => onSeeDetails(report)}> &gt;&gt; See Details</button>
                  </>
                ) : (
                  <>
                    <span className='report-category-activity-list'>{report.Category}</span> reported near {report.block}
                    <button onClick={() => onSeeDetails(report)}> &gt;&gt; See Details</button>
                  </>
                )} 
                {/* Thumbs-up button */}
                <button onClick={() => handleThumbsUpClick(index)} className="thumbs-up-button">
                  {thumbsUpFilled[index] ? <BsFillHandThumbsUpFill className='thumbs-up' /> : <BsHandThumbsUp className='thumbs-up' style={{ color: '#69A031' }}/>}
                </button>
              </li>
            ))}
            {reports.map((report, index) => (
              <li key={report.case_}>
                {favLocations.includes(report.block) ? (
                  <>
                    <span className='report-category-activity-list'>{report.Category}</span> reported near {report.block} <BsHeartFill style={{color:'#DF6E6E'}} />
                    <button onClick={() => onSeeDetails(report)}> &gt;&gt; See Details</button>
                  </>
                ) : (
                  <>
                    <span className='report-category-activity-list'>{report.Category}</span> reported near {report.block}
                    <button onClick={() => onSeeDetails(report)}> &gt;&gt; See Details</button>
                  </>
                )} 
                {/* Thumbs-up button */}
                <button onClick={() => handleThumbsUpClick(index)} className="thumbs-up-button">
                  {thumbsUpFilled[index] ? <BsFillHandThumbsUpFill className='thumbs-up' /> : <BsHandThumbsUp className='thumbs-up' style={{ color: '#69A031' }}/>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Shortcut on recentActivityPage to fill out a report*/}
      <div className="report-icon-fill">
        <ReportButton onClick={onReportButtonClick} />
      </div>
    </>
  );
}
function ReportDetailsPage({report}) {
  return (
    <>
      <Title title='REPORT DETAILS'/>
      {/* Display the description reported near the address */}
      <p className="description-address"><span className='description-category'>{report.Category}</span> reported near {report.block}</p>

      <p className="description">Description</p>
      
      <div className="report-details-container">
        {/* Display the report details */}
        <p>Date: {report.date}, {report.time}</p>
        <p>Type: {report.details}</p>
        <p>Arrest: {report.arrest}</p>
        <p>Place: {report._location_description}</p>
        <p>Coordinates: {report.latitude + ', ' + report.longitude}</p>
      </div>
      </>
  );
}

// function SendReportPage({ onClick }) {
//   function getCurrentTime() {
//     const currentDate = new Date();
//     let hours = currentDate.getHours().toString().padStart(2, '0');
//     let minutes = currentDate.getMinutes().toString().padStart(2, '0');
//     // Round minutes to nearest 30-minute increment
//     minutes = Math.round(minutes / 30) * 30;
//     if (minutes === 60) {
//       hours = String(Number(hours) + 1).padStart(2, '0');
//       minutes = '00';
//     }
//     return `${hours}:${minutes}`;
//   }

//   {/* Set default values for formData */}
//   const [formData, setFormData] = useState({
//     locationType: '',
//     reportCategory: '',
//     details: '',
//     time: getCurrentTime(),
//     ampm: ''
//   });

//   {/* Update form according to user input */}
//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     if (name === 'locationType' && value === 'current') {
//       // If the user selects "Current", get the current location
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             const { latitude, longitude } = position.coords;
//             // Update the formData with the current latitude and longitude
//             setFormData({
//               ...formData,
//               [name]: value,
//               latitude,
//               longitude
//             });
//           },
//           (error) => {
//             console.error('Error getting current location:', error);
//           }
//         );
//       } else {
//         console.error('Geolocation is not supported by this browser.');
//       }
//     } else {
//       // For other inputs, update the formData as usual
//       setFormData({
//         ...formData,
//         [name]: value
//       });
//     }
//   };  

//   const handleSubmit = () => {
//     onClick(); // Trigger the onClick function passed from the parent component
//   };

//   return (
//     <>
//       <Title title='SEND REPORT'/>
//       <div className='form-container'>
//         <Form>
//           <LocationSection formData={formData} onInputChange={handleInputChange} />
//           <ReportCategorySection formData={formData} onInputChange={handleInputChange} />
//           <div className='details-time-inline'>
//             <DetailsSection formData={formData} onInputChange={handleInputChange} />
//             <TimeSection formData={formData} onInputChange={handleInputChange} />
//           </div>
//           <div 
//             className="send-button" 
//             onClick={handleSubmit} // Call handleSubmit function when the button is clicked
//           >
//             <span className="send-text">SEND</span>
//             <BsSend className="send-icon" />
//           </div>
//         </Form>
//       </div>
//     </>
//   );
// }

function SendReportPage({ onClick }) {
  const [formData, setFormData] = useState({
    locationType: '',
    Category: '',
    latitude: '0.0',
    longitude: '0.0',
    arrest: 'N',
    details: '',
    time: getCurrentTime(),
    date: getCurrentDate(),
    ampm: 'AM',
    block: '',
    _location_description: ''
  });

  function getCurrentTime() {
    const currentDate = new Date();
    let hours = currentDate.getHours().toString().padStart(2, '0');
    let minutes = currentDate.getMinutes().toString().padStart(2, '0');

    // Round minutes to nearest 30-minute increment
    minutes = Math.round(minutes / 30) * 30;
    if (minutes === 60) {
      hours = String(Number(hours) + 1).padStart(2, '0');
      minutes = '00';
    }
    return `${hours}:${minutes.toString().padStart(2,'0')}`;
  }
  function getCurrentDate() {
    const currentDate = new Date();
    let month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based, so we add 1
    let date = currentDate.getDate().toString().padStart(2, '0');
    let year = currentDate.getFullYear().toString();
  
    return `${month}/${date}/${year}`;
  }
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'locationType' && value === 'Current') {
      // If the user selects "Current", retrieve the current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            // Update the formData with the current latitude and longitude
            setFormData({
              ...formData,
              [name]: value,
              latitude: latitude.toString(),
              longitude: longitude.toString()
            });
          },
          (error) => {
            console.error('Error getting current location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    } else {
      // For other inputs, update the formData as usual
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  const [address, setAddress] = useState({});
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${formData.latitude}&lon=${formData.longitude}&zoom=18&addressdetails=1`);
          
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
  
          const data = await response.json();
          setAddress(data);
        } catch (error) {
          console.error('Error fetching address:', error);
        }
      };
  
      fetchData();
    }, [formData.latitude, formData.longitude]);

  console.log(address)
  
  const handleSubmit = () => {
    const newEntry = {
      locationType: formData.locationType,
      Category: formData.Category,
      details: formData.details,
      arrest: formData.arrest,
      time: formData.time + ' ' + formData.ampm,
      ampm: formData.ampm,
      latitude: formData.latitude,
      longitude: formData.longitude,
      date: formData.date,
      block: `${address.address.house_number} ${address.address.road}`,
      _location_description: `${address.type}`
    };
  
    // Fetch existing data from local storage or initialize as an empty array
    const existingData = JSON.parse(sessionStorage.getItem('chicago_crime_data')) || [];
  
    // Add new entry to existing data
    const newData = [...existingData, newEntry];
  
    // Store updated data back to local storage
    sessionStorage.setItem('chicago_crime_data', JSON.stringify(newData));
  
    // Trigger the onClick function passed from the parent component
    onClick();
  };

  return (
    <>
      <Title title='SEND REPORT'/>
      <div className='form-container'>
        <Form>
          <LocationSection formData={formData} onInputChange={handleInputChange} />
          <ReportCategorySection formData={formData} onInputChange={handleInputChange} />
          <div className='details-time-inline'>
            <DetailsSection formData={formData} onInputChange={handleInputChange} />
            <TimeSection formData={formData} onInputChange={handleInputChange} />
          </div>
          <div 
            className="send-button" 
            onClick={handleSubmit} // Call handleSubmit function when the button is clicked
          >
            <span className="send-text">SEND</span>
            <BsSend className="send-icon" />
          </div>
        </Form>
      </div>
    </>
  );
}

// Location section on SendReportPage
// function LocationSection({ formData, onInputChange }) {
//   return (
//     <Form.Group controlId="locationType">
//       <Form.Label className="form-label-custom">Location</Form.Label>
//       <div className="location-options">
//         <div className="location-option">
//           <Form.Check
//             className="form-check-custom"
//             type="radio"
//             id="currentLocation"
//             label="Current"
//             name="locationType"
//             value="current"
//             checked={formData.locationType === 'current'}
//             onChange={onInputChange}
//           />
//         </div>
//         <div className="location-option">
//           <Form.Check
//             className="form-check-custom"
//             type="radio"
//             id="otherLocation"
//             label="Other:"
//             name="locationType"
//             value="other"
//             checked={formData.locationType === 'other'}
//             onChange={onInputChange}
//           />
//           {formData.locationType === 'other' && (
//             <Form.Control
//               className="form-check-custom other-input"
//               style={{ visibility: formData.locationType === 'other' ? 'visible' : 'hidden' }}
//               type="text"
//               placeholder="Enter location"
//               name="location"
//               value={formData.location}
//               onChange={onInputChange}
//             />
//           )}
//         </div>
//       </div>
//       {/* Uncomment the following code to display the coordinates so you know they're working */}
//       {/* {formData.latitude && formData.longitude && (
//         <div>
//           Latitude: {formData.latitude}, Longitude: {formData.longitude}
//         </div>
//       )} */}
//     </Form.Group>
//   );
// }
function LocationSection({ formData, onInputChange }) {
  return (
    <Form.Group controlId="locationType">
      <Form.Label className="form-label-custom">Location</Form.Label>
      <div className="location-options">
        <div className="location-option">
          <Form.Check
            className="form-check-custom"
            type="radio"
            id="currentLocation"
            label="Current"
            name="locationType"
            value="Current"
            checked={formData.locationType === 'Current'}
            onChange={onInputChange}
          />
        </div>
        <div className="location-option">
          <Form.Check
            className="form-check-custom"
            type="radio"
            id="otherLocation"
            label="Other:"
            name="locationType"
            value="Other"
            checked={formData.locationType === 'Other'}
            onChange={onInputChange}
          />
          {formData.locationType === 'Other' && (
            <Form.Control
              className="form-check-custom other-input"
              // style={{ display: formData.locationType === 'other' ? 'block' : 'none' }}
              style={{ visibility: formData.locationType === 'Other' ? 'visible' : 'hidden' }}
              type="text"
              placeholder="Enter location"
              name="location"
              value={formData.location}
              onChange={onInputChange}
            />
          )}
        </div>
      </div>
      {/* Uncomment the following code to display the coordinates so you know they're working */}
      {/* {formData.latitude && formData.longitude && (
        <div>
          Latitude: {formData.latitude}, Longitude: {formData.longitude}
        </div>
      )} */}
    </Form.Group>
  );
}
// Report category section on SendReportPage
// function ReportCategorySection({ formData, onInputChange }) {
//   return (
//     <div className="report-category-container">
//       <Form.Group controlId="reportCategory">
//         <Form.Label className="form-label-custom">Report Category</Form.Label>
//         <div className="report-category-options">
//           <div className="report-category-option">
//             <Form.Check
//               className="form-check-custom"
//               type="radio"
//               id="crimeCategory"
//               label="Crime"
//               name="reportCategory"
//               value="crime"
//               checked={formData.reportCategory === 'crime'}
//               onChange={onInputChange}
//             />
//           </div>
//           <div className="report-category-option">
//             <Form.Check
//               className="form-check-custom"
//               type="radio"
//               id="otherCategory"
//               label="Other:"
//               name="reportCategory"
//               value="other"
//               checked={formData.reportCategory === 'other'}
//               onChange={onInputChange}
//             />
//             {formData.reportCategory === 'other' && (
//               <Form.Control
//                 className="form-check-custom other-input"
//                 // style={{ display: formData.reportCategory === 'other' ? 'block' : 'none' }}
//                 style={{ visibility: formData.reportCategory === 'other' ? 'visible' : 'hidden' }}
//                 type="text"
//                 placeholder="Enter category"
//                 name="category"
//                 value={formData.category}
//                 onChange={onInputChange}
//               />
//             )}
//           </div>
//         </div>
//         <div className="report-category-option">
//           <Form.Check
//             className="form-check-custom"
//             type="radio"
//             id="hazardCategory"
//             label="Hazard"
//             name="reportCategory"
//             value="hazard"
//             checked={formData.reportCategory === 'hazard'}
//             onChange={onInputChange}
//           />
//         </div>
//       </Form.Group>
//     </div>
//   );
// }
function ReportCategorySection({ formData, onInputChange }) {
  return (
    <div className="report-category-container">
      <Form.Group controlId="Category">
        <Form.Label className="form-label-custom">Report Category</Form.Label>
        <div className="report-category-options">
          <div className="report-category-option">
            <Form.Check
              className="form-check-custom"
              type="radio"
              id="crimeCategory"
              label="Crime"
              name="Category"
              value="Crime"
              checked={formData.Category === 'Crime'}
              onChange={onInputChange}
            />
          </div>
          <div className="report-category-option">
            <Form.Check
              className="form-check-custom"
              type="radio"
              id="otherCategory"
              label="Other:"
              name="Category"
              value="Other"
              checked={formData.Category === 'Other'}
              onChange={onInputChange}
            />
            {formData.Category === 'Other' && (
              <Form.Control
                className="form-check-custom other-input"
                style={{ visibility: formData.Category === 'Other' ? 'visible' : 'hidden' }}
                type="text"
                placeholder="Enter category"
                name="category"
                value={formData.category}
                onChange={onInputChange}
              />
            )}
          </div>
        </div>
        <div className="report-category-option">
          <Form.Check
            className="form-check-custom"
            type="radio"
            id="hazardCategory"
            label="Hazard"
            name="Category"
            value="Hazard"
            checked={formData.Category === 'Hazard'}
            onChange={onInputChange}
          />
        </div>
      </Form.Group>
    </div>
  );
}
// Details section on SendReportPage
// function DetailsSection({ formData, onInputChange }) {
//   return (
//     <Form.Group controlId="details">
//       <Form.Label className="form-label-custom">Details</Form.Label>
//       <Form.Control className="form-check-custom details-box"
//         as="textarea"
//         rows={3}
//         name="details"
//         placeholder="Enter details"
//         value={formData.details}
//         onChange={onInputChange}
//       />
//     </Form.Group>
//   );
// }
function DetailsSection({ formData, onInputChange }) {
  return (
    <Form.Group controlId="details">
      <Form.Label className="form-label-custom">Details</Form.Label>
      <Form.Control className="form-check-custom details-box"
        as="textarea"
        rows={3}
        name="details"
        placeholder="Enter details"
        value={formData.details}
        onChange={onInputChange}
      />
    </Form.Group>
  );
}
// Time section on SendReportPage
// function TimeSection({ formData, onInputChange }) {
//   const hoursOptions = [];
//   const minutesOptions = ["00", "30"];

//   for (let hour = 1; hour <= 12; hour++) {
//     for (const minute of minutesOptions) {
//       const time = `${hour}:${minute}`;
//       hoursOptions.push(time);
//     }
//   }

//   return (
//     <Form.Group controlId="time" className='details-time-spacing'>
//       <Form.Label className="form-label-custom">Time</Form.Label>
//       <div className="details-time-inline"> {/* Flex container */}
//         <div className="time-dropdowns"> {/* Flex item 1 */}
//           <Form.Control
//             className="form-check-custom time-dropdown"
//             as="select"
//             name="time"
//             value={formData.time}
//             onChange={onInputChange}
//           >
//             {hoursOptions.map((option, index) => (
//               <option key={index}>{option}</option>
//             ))}
//           </Form.Control>
//         </div>
//         <div className="time-dropdowns"> {/* Flex item 2 */}
//           <Form.Control
//             className="form-check-custom time-dropdown-ampm"
//             as="select"
//             name="ampm"
//             value={formData.ampm}
//             onChange={onInputChange}
//           >
//             <option>AM</option>
//             <option>PM</option>
//           </Form.Control>
//         </div>
//       </div>
//     </Form.Group>
//   );
// }
function TimeSection({ formData, onInputChange }) {
  const hoursOptions = [];
  const minutesOptions = ["00", "30"];

  for (let hour = 1; hour <= 12; hour++) {
    for (const minute of minutesOptions) {
      const time = `${hour}:${minute}`;
      hoursOptions.push(time);
    }
  }

  return (
    <Form.Group controlId="time" className='details-time-spacing'>
      <Form.Label className="form-label-custom">Time</Form.Label>
      <div className="details-time-inline"> {/* Flex container */}
        <div className="time-dropdowns"> {/* Flex item 1 */}
          <Form.Control
            className="form-check-custom time-dropdown"
            as="select"
            name="time"
            value={formData.time}
            onChange={onInputChange}
          >
            {hoursOptions.map((option, index) => (
              <option key={index}>{option}</option>
            ))}
          </Form.Control>
        </div>
        <div className="time-dropdowns"> {/* Flex item 2 */}
          <Form.Control
            className="form-check-custom time-dropdown-ampm"
            as="select"
            name="ampm"
            value={formData.ampm}
            onChange={onInputChange}
          >
            <option>AM</option>
            <option>PM</option>
          </Form.Control>
        </div>
      </div>
    </Form.Group>
  );
}
function MapPage({ reports }) {
  const [currentLocation, setCurrentLocation] = useState([0, 0]);

  // Create icons for currentLocation and reports
  const currLocIcon = new Icon({
    iconUrl: require('./icons8-location-50.png'),
    iconSize: [40, 40]
  });
  const reportIcon = new Icon({
    iconUrl: require('./icons8-warning-30.png'),
    iconSize: [30, 30]
  });

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation([latitude, longitude]);
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  return (
    <>
      <div className="map-legend">
        <div className="icon-text-container">
          <BsGeoAltFill className="map-icon" />
          <span className="legend-text">Your Location</span>
        </div>
        <div className="icon-text-container">
          <BsFillExclamationTriangleFill className="report-icon-fill" style={{ fontSize: '24px' }} />
          <span className="legend-text">Report</span>
        </div>
      </div>
      {/* Centered on Chicago */}
      <MapContainer center={[41.8781, -87.6298]} zoom={13} scrollWheelZoom={true} className="map-container">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Marker for Current Location */}
        {currentLocation && (
          <Marker position={currentLocation} icon={currLocIcon}>
            <Popup>Your Current Location</Popup>
          </Marker>
        )}

        {/* Markers for Reports */}
        {reports.map((report) => {
          // Parse coordinates from string "(latitude, longitude)"
          // const coordinates = report.location.replace(/[()]/g, '').split(',').map(coord => parseFloat(coord.trim()));
          return (
            <Marker key={report.case_} position={[report.latitude, report.longitude]} icon={reportIcon}>
              <Popup>
                <div>
                  <h3>{report.details}</h3>
                  <p>{report._location_description}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      <div className="swipe-to-scroll">
        Swipe to scroll
      </div>
    </>
  );
}

function ThankYouPage({ onClick }) {
  const handleBackToActivityClick = () => {
    onClick(); // Navigate back to the Recent Activity page
  };

  return (
    <>
      <Title 
        title='THANK YOU FOR SENDING YOUR REPORT'
        style={{
          whiteSpace: 'pre-wrap',
          position: 'absolute',
          top: '40%',
          margin: 'auto',
          width: '400px'
        }}
      />
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button 
          className="back-to-activity-button" 
          onClick={handleBackToActivityClick}
        >
          BACK TO ACTIVITY
        </button>
      </div>
    </>
  );
}

function SettingsPage({ onFavLocationsClick} ) {
  const handleFavLocationsButtonClick = () => {
    onFavLocationsClick();
  };

  return (
    <>
      <Title title='SETTINGS' style={{ top: '100px' }}/>
      <div className="settings-container" style={{ width: '80%', marginLeft:'18px' }}>
        <div className="settings-tab" style={{ top: '150px' }}>
          <BsFillPersonFill className='settings-icons' style={{ color: '#A0C8BB' }}></BsFillPersonFill>
          <button className='settings-buttons'>Account Information</button>
        </div>
        <div className="settings-tab" style={{ background: '#67B29C', top: '250px' }}>
          <BsBellFill className='settings-icons' style={{ color: '#ADEAD8' }}></BsBellFill >
          <button className="settings-buttons" style={{ background: '#67B29C' }}>Notifications</button>
        </div>
        <div className="settings-tab" style={{ background: '#7BA154', top: '350px' }}>
          <BsFillLockFill className='settings-icons' style={{ color: '#C6E8A2' }}></BsFillLockFill>
          <button className="settings-buttons" style={{ background: '#7BA154' }}>Privacy</button>
        </div>
        <div className="settings-tab" style={{ background: '#9BB580', top: '450px' }}>
          <BsHeartFill className='settings-icons' style={{ color: '#D3EABB' }}></BsHeartFill>
          <button className="settings-buttons" style={{ background: '#9BB580' }} onClick={handleFavLocationsButtonClick}>Favorite Locations</button>
        </div>
      </div>
    </>
  );
}

function FavLocationsPage({ favLocations, onAddLocation }) {
  const [streetAddress, setStreetAddress] = useState('');

  const [newLocation, setNewLocation] = useState('');

  const handleChange = (event) => {
    setNewLocation(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newLocation.trim() !== '') {
      // Call the onAddLocation function passed from the parent component
      onAddLocation(newLocation.trim());
      // Clear the input field after adding the location
      setNewLocation('');
    }
  };

  return (
    <>
      <Title title='FAVORITE LOCATIONS' style={{
          whiteSpace: 'pre-wrap',
          position: 'absolute',
          top:'20%',
          width: '400px'
        }}/>
      <div>
        <ul className='list-of-favs'>
          {favLocations.map((location, index) => (
            <li key={index}>{location}</li>
          ))}
        </ul>
        <form onSubmit={handleSubmit}>
          <label className="fav-locations-search">
            <span className='description-category'>Add New Location:</span>
            <input
              type="text"
              value={newLocation}
              onChange={handleChange}
              placeholder="Enter new location"
            />
          </label>
          <button type="submit" className='fav-submit'>Add</button>
        </form>
      </div>
    </>
  );
}

function App() {
  const [scene, setScene] = useState('recentActivity'); // Manage scenes
  const [selectedReport, setSelectedReport] = useState(null); // Manage reports for SeeDetails
  const [reports, setReports] = useState([]); // Manage all reports
  const [favLocations, setFavLocations] = useState([]); // Manage favorited locations
  const [searchQuery, setSearchQuery] = useState(''); // Manage search query

  // Fetch data from imported JSON data
  useEffect(() => {
    // Define function to fetchData
    const fetchData = () => {
      try {
        setReports(chicago_crime_data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    // Call function
    fetchData();
  }, []);

  // Define function handlers
  const handleReportButtonClick = () => {
    setScene('sendReport');
  };

  const handleHouseIconClick = () => {
    setScene('recentActivity');
  };

  const handleExclamationIconClick = () => {
    setScene('sendReport');
  };

  const handleSubmitReportClick = () => {
    setScene('thankyou');
  };

  const handleMapIconClick = () => {
    setScene('map');
  };

  const handleSettingsIconClick = () => {
    setScene('settings');
  };

  const handleBackToActivityClick = () => {
    setScene('recentActivity');
  };

  const handleFavLocationsClick = () => {
    setScene('favLocations');
  };

  const handleAddLocation = (newLocation) => {
    setFavLocations([...favLocations, newLocation]);
  };

  function handleSeeDetails(report) {
    // Set the scene to 'reportDetails' to render the report details page
    setScene('reportDetails');
    // Set the selected report
    setSelectedReport(report);
  }

  // Filter reports based on search query
  const filteredReports = reports.filter((report) =>
    report.block.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return ( /* Return based off scene selected */
    <div className='phone-screen'>
      {scene !== 'settings' && scene !== 'thankyou' && scene !== 'favLocations' && 
        <SearchContainer 
            onFavLocationsClick={handleFavLocationsClick}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
        />
      }
      {scene === 'recentActivity' && 
        (<RecentActivityPage 
            reports={filteredReports} 
            onSeeDetails={handleSeeDetails} 
            onReportButtonClick={handleReportButtonClick} 
            favLocations={favLocations}
        />)
      }
      {scene === 'reportDetails' && <ReportDetailsPage report={selectedReport} />}
      {scene === 'sendReport' && <SendReportPage onClick={handleSubmitReportClick} />}
      {scene === 'thankyou' && <ThankYouPage onClick={handleBackToActivityClick}/>}
      {scene === 'map' && <MapPage reports = {reports}/>}
      {scene === 'settings' && <SettingsPage onFavLocationsClick={handleFavLocationsClick}/>}
      {scene === 'favLocations' && 
        <FavLocationsPage 
            favLocations={favLocations} 
            onAddLocation={handleAddLocation} 
        />
      }
      <NavigationBar 
        onHouseIconClick={handleHouseIconClick} 
        onExclamationIconClick={handleExclamationIconClick}
        onMapIconClick={handleMapIconClick} 
        onSettingsIconClick={handleSettingsIconClick} 
      />
    </div>
  );
}

export default App;