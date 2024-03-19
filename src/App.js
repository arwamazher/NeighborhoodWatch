import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Navbar, Nav, Form } from 'react-bootstrap';
import { BsSearch, BsHouseDoor, BsGlobeAmericas, BsExclamationTriangle, BsFillExclamationTriangleFill, BsGear, BsGeoAltFill, BsSend } from 'react-icons/bs';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

function ReportButton({ onClick }) {
  return (
    <a href="#" onClick={onClick} className="report-button">
      <BsFillExclamationTriangleFill className="report-icon-fill" />
      <span className="button-text">Click here to fill out a report</span>
    </a>
  );
}

function SearchContainer() {
  return (
    <div className='search-container'>
      <BsSearch className='search-icon'/>
      <input type="text" className='search-input' placeholder="Search..." />
    </div>
  );
}

function Title({ title }) {
  return (
    <Container fluid>
      <Row>
        <Col xs={8} className='text-center'>
          <h1 className='title'>{title}</h1>
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

function RecentActivityPage({ onClick }) {
  return (
    <>
      <Title title='RECENT ACTIVITY'/>
      <div className="scrollable-textbox">
        <div className="text-content">
          Put recent activity stuff here.
        </div>
      </div>
      <div className="report-icon-fill">
        <ReportButton onClick={onClick} />
      </div>
    </>
  );
}

function ReportDetailsPage() {
  return (
    <>
      <Title title='REPORT DETAILS'/>
      <div className="report-details-container">
        {/* Add your report details UI here */}
      </div>
    </>
  );
}

function SendReportPage({ onClick }) {
  const [formData, setFormData] = useState({
    locationType: 'current',
    reportCategory: 'crime',
    details: '',
    time: getCurrentTime(),
    ampm: 'AM'
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
    return '${hours}:${minutes}';
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
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
        </Form>
      </div>
    </>
  );
}

function LocationSection({ formData, onInputChange }) {
  return (
    <Form.Group controlId="locationType">
      <Form.Label className="form-label-custom">Location</Form.Label>
      <Form.Check className="form-check-custom"
        type="radio"
        id="currentLocation"
        label="Current"
        name="locationType"
        value="current"
        checked={formData.locationType === 'current'}
        onChange={onInputChange}
      />
      <Form.Check className="form-check-custom"
        type="radio"
        id="otherLocation"
        label="Other:"
        name="locationType"
        value="other"
        checked={formData.locationType === 'other'}
        onChange={onInputChange}
      />
      {formData.locationType === 'other' && (
        <Form.Control className="form-check-custom"
          type="text"
          placeholder="Enter location"
          name="location"
          value={formData.location}
          onChange={onInputChange}
        />
      )}
    </Form.Group>
  );
}

function ReportCategorySection({ formData, onInputChange }) {
  return (
    <Form.Group controlId="reportCategory">
      <Form.Label className="form-label-custom">Report Category</Form.Label>
      <Form.Check className="form-check-custom"
        type="radio"
        id="crimeCategory"
        label="Crime"
        name="reportCategory"
        value="crime"
        checked={formData.reportCategory === 'crime'}
        onChange={onInputChange}
      />
      <Form.Check className="form-check-custom"
        type="radio"
        id="hazardCategory"
        label="Hazard"
        name="reportCategory"
        value="hazard"
        checked={formData.reportCategory === 'hazard'}
        onChange={onInputChange}
      />
      <Form.Check className="form-check-custom"
        type="radio"
        id="otherCategory"
        label="Other:"
        name="reportCategory"
        value="other"
        checked={formData.reportCategory === 'other'}
        onChange={onInputChange}
      />
      {formData.reportCategory === 'other' && (
        <Form.Control className="form-check-custom"
          type="text"
          placeholder="Enter category"
          name="category"
          value={formData.category}
          onChange={onInputChange}
        />
      )}
    </Form.Group>
  );
}

function DetailsSection({ formData, onInputChange }) {
  return (
    <Form.Group controlId="details">
      <Form.Label className="form-label-custom">Details</Form.Label>
      <Form.Control className="form-check-custom details-box"
        as="textarea"
        rows={3}
        name="details"
        value={formData.details}
        onChange={onInputChange}
      />
    </Form.Group>
  );
}

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
  // return (
  //   <Form.Group controlId="time" className='details-time-spacing'>
  //     <Form.Label className="form-label-custom">Time</Form.Label>
  //     <div className="time-dropdowns">
  //       <Form.Control
  //         className="form-check-custom time-dropdown"
  //         as="select"
  //         name="time"
  //         value={formData.time}
  //         onChange={onInputChange}
  //       >
  //         {hoursOptions.map((option, index) => (
  //           <option key={index}>{option}</option>
  //         ))}
  //       </Form.Control>
  //     </div>
  //     <div className="time-dropdowns">
  //       <Form.Control
  //         className="form-check-custom time-dropdown-ampm"
  //         as="select"
  //         name="ampm"
  //         value={formData.ampm}
  //         onChange={onInputChange}
  //       >
  //         <option>AM</option>
  //         <option>PM</option>
  //       </Form.Control>
  //     </div>
  //   </Form.Group>
  // );
}

function MapPage() {
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
      </MapContainer>
      <div className="swipe-to-scroll">
        Swipe to scroll
      </div>
    </>
  );
}

function ThankYouPage({ onClick }) {
  return (
    <>
      <h1>Thank You Page</h1>
      {/* Add your thank you message or UI here */}
    </>
  );
}

function SettingsPage() {
  return (
    <>
      <Title title='SETTINGS'/>
      <div className="settings-container">
        {/* Add your report details UI here */}
      </div>
    </>
  );
}

function App() {
  const [scene, setScene] = useState('recentActivity');

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

  return (
    <div className='phone-screen'>
      <SearchContainer />
      {scene === 'recentActivity' && <RecentActivityPage onClick={handleReportButtonClick} />}
      {scene === 'reportDetails' && <ReportDetailsPage />}
      {scene === 'sendReport' && <SendReportPage onClick={handleSubmitReportClick} />}
      {scene === 'thankyou' && <ThankYouPage onClick={handleBackToActivityClick}/>}
      {scene === 'map' && <MapPage />}
      {scene === 'settings' && <SettingsPage />}
      <NavigationBar onHouseIconClick={handleHouseIconClick} onExclamationIconClick={handleExclamationIconClick}
                     onMapIconClick={handleMapIconClick} onSettingsIconClick={handleSettingsIconClick} />
    </div>
  );
}

export default App;