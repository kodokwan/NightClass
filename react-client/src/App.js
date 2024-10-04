
import './App.css';
import Reservation from "./reservation.js";
import Countdown from "./due_time.js";
import "./seatStatus.css"
function App() {
  return (
    <div className="App">
      <Reservation></Reservation>
      <Countdown></Countdown>
    </div>
  );
}

export default App;
