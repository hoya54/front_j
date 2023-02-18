import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useLocation, useNavigate } from "react-router";
import TopTitle from "../../components/Common/TopTitle";
import styles from "./ClientRealReservation.module.css";
import Calendar from "../../components/Calendar/Calendar";
import axios from "axios";

const ClientRealReservation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formatToday = format(new Date(), "yyyy-MM-dd");
  const intFormatToday = formatToday.split("-").map((item) => parseInt(item));

  const [clickDay, setClickDay] = useState(intFormatToday); // 클릭한 날짜 [2023, 2, 11]
  const [clickIdArray, setClickIdArray] = useState([]); // 유저가 클릭한 시간들의 데이터 id 배열 (post로 보냄)

  const [openedData, setOpenedData] = useState([]); // 최초 렌더링시 이미 예약된 시간 제외, 예약 가능한 데이터만 담음
  const [time, setTime] = useState([]); // 특정 트레이너의 특정 날짜 데이터 받아와서 시간만 담은 배열 => 그 날 타임 박스에 띄움
  const [timeArray, setTimeArray] = useState([]); // 클릭한 날짜의 데이터 중 클릭한 시간들만 담은 배열
  const [clickTimeArray, setClickTimeArray] = useState([]);
  const [dayReservation, setDayReservation] = useState([]); // 특정 트레이너의 특정 날짜 데이터
  const [reservedHour, setReservedHour] = useState([]); // 특정 트레이너의 특정 날짜 데이터 중 예약이 된 시간들 배열


  const trainerId = location.state.id;
  console.log(trainerId)

  const getDaySchedule = (intDate) => {
    setClickDay(intDate);
  };

  const handleClickTime = (event, time) => {
    const newTime = [clickDay[0], clickDay[1], clickDay[2], time].join(" ");
    const newReservation = dayReservation.filter((item) => item.hour === time);
    if (reservedHour.includes(time)) {
      event.preventDefault();
    } else if (
      clickIdArray.includes(newReservation[0].id) &&
      timeArray.includes(newTime)
    ) {
      setClickIdArray(
        clickIdArray.filter((item) => item !== newReservation[0].id)
      );
      setTimeArray(timeArray.filter((item) => item !== newTime));
    } else if (
      !clickIdArray.includes(newReservation[0].id) &&
      !timeArray.includes(newTime)
    ) {
      setClickIdArray((prev) => [...prev, newReservation[0].id]);
      setTimeArray((prev) => [...prev, newTime]);
    }
  };
  
  const kakaoPay = () => {
    axios
      .post("/api/business/pay/order/request", {
        totalAmount: 1 * clickIdArray.length,             // 결제할 금액
      })
      .then((res) => {
        console.log(res);
        window.location.replace(res.data.next_redirect_pc_url);
      });
    localStorage.setItem("reservationId", JSON.stringify(clickIdArray));
  };
  
  console.log("clickIdArray", clickIdArray);
  


  useEffect(() => {
    async function getReservation() {
      const data = await axios.get(
        `/api/business/reservation/trainer/list/${trainerId}`
      );
      setOpenedData(data.data.filter((item) => item.userId === null));
      const todayData = data.data.filter(
        (item) =>
          item.year === intFormatToday[0] &&
          item.month === intFormatToday[1] &&
          item.day === intFormatToday[2]
      );
      
      setTime(
        todayData
          .map((item) => item.hour)
          .sort(function (a, b) {
            return a - b;
          })
      );
    }
    getReservation();
  }, []);

  useEffect(() => {
    async function getDayReservation(clickDay) {
      const data = await axios.get(
        `/api/business/reservation/list/${trainerId}/${clickDay[0]}/${clickDay[1]}/${clickDay[2]}`
      );
      setDayReservation(data.data);
      const filterReservedData = data.data.filter(
        (item) => item.userId !== null
      );
      const reservedDataTime = filterReservedData.map((item) => item.hour);
      setReservedHour(reservedDataTime);
    }
    getDayReservation(clickDay);
  }, [clickDay]);

  useEffect(() => {
    setTime(
      dayReservation
        .map((item) => item.hour)
        .sort(function (a, b) {
          return a - b;
        })
    );
    const splitTimeArray = timeArray.map((item) => item.split(" "));
    const clickDayTimes = splitTimeArray.filter(
      (item) =>
        item[0] === clickDay[0].toString() &&
        item[1] === clickDay[1].toString() &&
        item[2] === clickDay[2].toString()
    );
    setClickTimeArray(clickDayTimes.map((item) => parseInt(item[3])));
  }, [dayReservation, timeArray]);

  return (
    <div className={styles.real_reservation_container}>
      <TopTitle
        title="예약하기▼"
        content="수업 날짜와 시간을 선택해 예약해보세요!"
      />
      <div className={styles.date_time_box}>
        <div className={styles.calendar_picker}>
          <Calendar getDaySchedule={getDaySchedule} allData={openedData} />
        </div>
        <div className={styles.time_picker}>
          <div className={styles.date_info}>
            날짜 : {clickDay[0]}년 {clickDay[1]}월 {clickDay[2]}일
          </div>
          {time.length !== 0 ? (
            time.map((item) => (
              <div
                className={`${styles.time_item} ${
                  reservedHour.includes(item)
                    ? `${styles.reserved_time}`
                    : `${styles.not_reserved_time}`
                } ${
                  clickTimeArray.includes(item)
                    ? `${styles.clicked_time}`
                    : null
                }`}
                key={item}
                onClick={(event) => {
                  handleClickTime(event, item);
                }}
              >
                {item}:00 ~ {item + 1}:00
              </div>
            ))
          ) : (
            <div className={styles.no_reservation}>
              예약 가능한 시간이 없습니다.
            </div>
          )}
        </div>
      </div>
      <div className={styles.btn_wrapper}>
        <button className={styles.payment_btn} onClick={() => kakaoPay()}>
          결제하기
        </button>
        <button className={styles.back_btn} onClick={() => navigate(-1)}>돌아가기</button>
      </div>
    </div>
  );
};

export default ClientRealReservation;
