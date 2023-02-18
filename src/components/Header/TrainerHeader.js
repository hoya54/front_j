// 라이브러리
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
// CSS
import styles from './Header.module.css'
import Chat from '../Chat/Chat'
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { etcActions } from '../../store/etc';
import { authActions } from '../../store/auth';
import logo from '../../assets/img/MPTIlogo.png'
// 트레이너NavBar 리턴 함수
export default function TrainerHeader(){
	const dispatch = useDispatch();
	const {image} = useSelector((state) => state.auth)
	console.log(image)
	// const {role}=useSelector(state=> state.auth);
	const {roleToken} = useSelector((state)=>state.auth)
	const navigate= useNavigate();

	const [view, setView] = useState(false);
	// 채팅 온
	const {chatOn} = useSelector(state=>state.etc)
	// 선택한 메뉴
	const [menuselect, setMenuSelect] = useState(null);
	// 메시지 개수
	const [messagecount, setMessageCount] = useState(99);
	//채팅 끄기

	if(roleToken!=="trainer" ){
		Navigate({to:"/"})
	}

	useEffect(() =>{
		const LINK_LIST=['/home', '/trainermyreservation','/trainermyclient', '/trainermypage']
		LINK_LIST.forEach((link) => {
			if(window.location.pathname.startsWith(link)){
				setMenuSelect(link.slice(1));
				return 0;
			};
		})
	} , [])

	const logout = () => {
		dispatch(authActions.logout())
		sessionStorage.clear()
		localStorage.clear()
		navigate("/login")
		console.log('로그아웃')
	}

	return(
		// nav_box 스타일 지정
		<div className={styles.Header}>
			{chatOn && <Chat />}
			{/* home 이동버튼 */}
			<div className={styles.head_logo} onClick={()=>{setMenuSelect('home')}}>
				<Link to={'home'} >
				<img src={logo} style={{width: "200px", height: "70px",marginTop:-8.5}} alt=""/></Link>	
			</div>
			
			{/* head menu담는 박스 */}
			<div className = {styles.head_menu}>
					{/* 예약현황 클릭시 /trainermyreservation로 라우팅 */}
					<div><Link id='trainermyreservation' className={styles.head_text} to={'myreservation'} style={menuselect === 'trainermyreservation'?{color:"#C9FD61"}:null} onClick={()=>{setMenuSelect('trainermyreservation')}}>
						예약현황</Link></div>
					{/* 고객관리 클릭시 /trainermyclient 라우팅 */}
					<div><Link id='trainermyclient'className={styles.head_text} to={'myclient'}  style={menuselect === 'trainermyclient'?{color:"#C9FD61"}:null} onClick={()=>{setMenuSelect('trainermyclient')}}>
						고객관리</Link></div>

					{/* 메일 + 프로필 담는 박스 */}
					<div className={styles.mail_profile_box}>
						{/* 메시지 */}
						<div className={styles.mail_box} onClick={()=>{dispatch(etcActions.chatToggle())}}>
						{/* 메시지 개수
						<div className={styles.mail_count_box}> {messagecount}+ </div> */}
						{/* 메시지 이미지 */}
						<img className={styles.mail_img} alt="chatmail" src='/chatmail.png'></img>
					</div>
					{/* 가장 오른쪽 프로필 그림 클릭시 /trainermypage 라우팅 */}
					<div className={styles.mypage_box}>
						<img className={styles.profile_img} alt="/profile_base.png" src={image?`${image}?${Math.random()}`:"/profile_base.png"} onClick={() => setView((prev)=>!prev)}></img>
						{
							view &&
							<div className={styles.dropdown}>
								<div className={styles.dropdown_content}><Link to={'mypage/myinfo'} onClick={()=>{setMenuSelect('trainermypage'); setView(false);}}>마이페이지</Link></div>
								<div className={styles.dropdown_content} onClick={()=>logout()}>로그아웃</div>
							</div>
						}
					</div>
					
				</div>
			</div>
		</div>
  )
}
