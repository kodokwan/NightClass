import React from 'react';

export default class Countdown extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        remainingTime: this.calculateRemainingTime(), // 초기 남은 시간 계산
      };
    }
  
    componentDidMount() {
      // 컴포넌트가 마운트된 후, 매초마다 남은 시간을 업데이트하는 타이머를 설정합니다.
      this.timerID = setInterval(
        () => this.updateRemainingTime(),
        1000 // 1000ms = 1초
      );
    }
  
    componentWillUnmount() {
      // 컴포넌트가 언마운트되면 타이머를 정리합니다.
      clearInterval(this.timerID);
    }
  
    calculateRemainingTime() {
      const now = new Date();
      const targetTime = new Date();
      targetTime.setHours(0, 0, 0, 0); // 목표 시간을 오늘 11시로 설정
        
      // 목표 시간이 현재 시간보다 이전이면, 내일 11시로 설정
      if (now > targetTime) {
        
        targetTime.setDate(targetTime.getDate() + 1);
      }

  
      const difference = targetTime - now; // 남은 시간(밀리초)
      
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  
      return { hours, minutes, seconds };
    }
  
    updateRemainingTime() {
      const remainingTime = this.calculateRemainingTime()
      this.setState({
        remainingTime: remainingTime // 남은 시간 업데이트
      });
    }
  
    render() {
      const { hours, minutes, seconds } = this.state.remainingTime;
      return (
        <div className='Counter'>
          <h1>남은 시간:</h1>
          <p>{hours}시간 {minutes}분 {seconds}초</p>
          <h1> 예약 시간 </h1>
          <p> 예약하고 싶은 날 기준으로 <br></br>  전전날 0시부터 전날 23시 59분 59초까지 </p>
        </div>
      );
    }
  }
  