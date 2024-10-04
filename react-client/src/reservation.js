import React from 'react';

export default class Reservation extends React.Component {


  state = {
    reservation:{
      seatNumber: 'A1',
      name: '',
      grade: 'G7',
    }, seat_status:{
      data: []
    }
};

  handleSeatNumberChange = (e) => {
    
    this.setState({
      reservation:{
        ...this.state.reservation,
        seatNumber: e.target.value,
      } 
    });
  };

  handleNameChange = (e) => {
    this.setState({
      reservation:{
        ...this.state.reservation,
        name: e.target.value,
      } 
    });
  };

  handleGradeChange = (e) => {
    this.setState({
      reservation:{
        ...this.state.reservation,
        grade: e.target.value,
      } 
    });
  };

  handleSubmit = (e) => {

    fetch('http://localhost:8000/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state.reservation),
    })
    .then((res) => res.text())  // `res.text()`로 응답 텍스트를 반환
    .then((data) => {
        console.log(data); // 서버에서 반환한 데이터를 콘솔에 출력
        if (data === 'Success'){
          alert('성공적으로 추가되었습니다.');
        } else if (data === 'Fail'){
          alert('누군가가 이미 사용하고 있습니다.');
        } else {
          alert('Undefined Error occurred.');
        }
    })
    .catch((error) => {
      console.error('Error:', error);
      alert(error);
    });
};
 // seat_status
  componentDidMount() {
    document.title = 'SKIS 야간자율 학습';
    this.checkSeatStatus();
  }

  checkSeatStatus = () => {
    fetch('http://localhost:8000/getAllData')
      .then(response => response.json())
      .then(data => {
        this.setState({ seat_status: { data } });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    };

    easyReservation = (value) => {
      
    
      this.setState({
        reservation: {
          ...this.state.reservation,
          seatNumber: value
        }
      });
    };


  render() {
    const seatOptions = Array.from({ length: 40 }, (_, i) => `A${i + 1}`);
    const gradeOptions = ['G7', 'G8', 'G9', 'G10', 'G11', 'G12'];

    return (
      <div style={{ fontFamily: 'Arial, sans-serif', margin: '20px' }}>
        <h1>예약 정보 입력</h1>
        <form
          onSubmit={this.handleSubmit}
          style={{
            maxWidth: '400px',
            margin: 'auto',
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '5px',
          }}
        >
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="seatNumber" style={{ display: 'block', marginBottom: '5px' }}>
              좌석번호
            </label>
            <select
              id="seatNumber"
              name="seatNumber"
              value={this.state.reservation.seatNumber}
              onChange={this.handleSeatNumberChange}
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            >
              {seatOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {/* <p>Selected Seat: {this.state.reservation.seatNumber}</p> */}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>
              이름
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={this.state.reservation.name}
              onChange={this.handleNameChange}
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="grade" style={{ display: 'block', marginBottom: '5px' }}>
              학년
            </label>
            <select
              id="grade"
              name="grade"
              value={this.state.reservation.grade}
              onChange={this.handleGradeChange}
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            >
              {gradeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <button
              type="submit"
              style={{
                padding: '10px 15px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              제출
            </button>
          </div>
        </form>
        <div className="container">
        <h1>내일 예약 좌석 정보</h1>
        <div className='seat available'>
          <span className="seat-number">available</span>
        </div>
        <div className='seat occupied'>
          <span className="seat-number">occupied</span>
        </div>
        
        <div className="seat-grid">
        {Array.from({ length: 4 }, (_, rowIndex) => (
          <div className='row' key={rowIndex}>
          {this.state.seat_status.data
          .slice(rowIndex * 10, rowIndex * 10 + 10)
          .map((item, seatIndex) => {
            const seatNumber = rowIndex * 10 + seatIndex + 1;
            
            return(
            <div
              key={seatNumber}
              className={`seat ${item.grade === -1 ? 'available' : 'occupied'}`}
              onClick={() => this.easyReservation(`A${seatNumber}`)}
            >
              <span className="seat-number">{seatNumber}</span>
              <span className="seat-status">{item.status}</span>
            </div>
            )
          })}
          </div>
        ))}
        </div>

        </div>
      </div>
      
    );
  }
}