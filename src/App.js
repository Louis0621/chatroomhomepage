
import './App.css';
import video from "./media/Dynamicbackground.mp4"
import video2 from "./media/Fixedbackground.mp4"
import video3 from "./media/Coffe.mp4";
import video4 from "./media/Pullinglist.mp4";
import React, {useEffect, useRef, useState} from 'react';
import {useAuthState} from 'react-firebase-hooks/auth';
//firebase import
import {db, googleProvider, auth} from './Auth.js';
import {signInWithPopup, signOut} from 'firebase/auth';
//firestore
import {doc,addDoc, collection, deleteDoc, getDocs} from 'firebase/firestore';
function App() {
  
  //Sign up
  //confirm
  const [confirmUser] = useAuthState(auth);
  
  const signUp = async()=>{
    await signInWithPopup(auth, googleProvider);
  }
  const logOut = async()=>{
    await signOut(auth, googleProvider);
  }
  const videoList = [video, video2, video3, video4];
  const title = ["Dynamic", "Fixed Background", "Grid Iframe Wall", "Pulling Menu"];
  //Navigationbar
  let curPage = 0;
  const barRef = [useRef(null), useRef(null), useRef(null)];
  const navRef = [useRef(null), useRef(null), useRef(null)];
  const handleNav = (e)=>{
    const dir = Math.sign(e.deltaY);
    if(dir > 0){

      curPage = Math.min(curPage + 1, navRef.length - 1)
    }
    else{
      curPage = Math.max(curPage - 1, 0)
    }
    manipulate(curPage);
  
     
  }
  //Manipulate
  const manipulate = (curr)=>{
    navRef[curr].current.scrollIntoView({behavior: 'smooth'});
    for(let i = 0; i < navRef.length; ++i){
        if(i !== curr){
         barRef[i].current.style.backgroundColor = 'transparent';
          barRef[i].current.style.opacity = '0.5';
          barRef[i].current.style.color = 'white';
          
          
        }
    }
    barRef[curr].current.style.backgroundColor = 'white';
    barRef[curr].current.style.opacity = '1';
    barRef[curr].current.style.color = 'black';
  }
  
  //Playing video
  const videoRef = [useRef(), useRef(), useRef(), useRef()];
  const BtnRef = [useRef()];
  let cfm = false;
  const handleOnClickVideo = ()=>{
    BtnRef.current.classList.toggle('active');
    if(cfm === false){
      videoRef.forEach((ref) =>{
        ref.current.play();
      })
      cfm = !cfm;
    }
    else{
      
      videoRef.forEach((ref) =>{
        ref.current.pause();
      })
      cfm = !cfm;
    }
  }
  //Gallery
  const galleryRef = useRef(null);
  const handleOnWheel = (e)=>{
    const container = galleryRef.current;
    const containerScrollPosition = container.scrollLeft;
    const scrollDelta = Math.sign(e.deltaY) * 700;
    //When something in Math.sign is greater than 0, it will be 1.
    //Otherwise, it will be -1.
    container.scrollTo({
      left: containerScrollPosition + scrollDelta,
      behavior: 'smooth'
    })
  }
  
  //MouseEnter
  const NewRef = useRef();
  const handleOnMounseEnter = (e)=>{
    const title = e.target.className;
    let find = document.querySelector('.span');
    if(find){
      find.remove();
    }
    const sp = document.createElement('span');
    sp.setAttribute('class', 'span')
    const parent = NewRef.current.appendChild(sp);
    parent.textContent = title;
  }

  //windowListener
  useEffect(() => {
    getContentList();
    manipulate(0);
    try{
      document.createEvent("TouchEvent");
      document.querySelector('body').style.overflowY = 'scroll';
      document.querySelector('.guide').style.display = 'none';
    }catch(e){
      console.error('not a cellphone');
    }
  }, []);

  const [message, setMessage] = useState('');
  const chatRef = collection(db, 'chat2');
  const [chatList, setChatList] = useState([]);
  const handleOnClick = async()=>{
    if(message !== '' && message.length < 70){
      const curr = new Date();

      const wholetime = [curr.getFullYear(), (curr.getMonth() + 1), curr.getDate(), curr.getHours(), curr.getMinutes(), curr.getSeconds()]
      for(let i = 0; i < wholetime.length; ++i){
        if(i > 0)
          if(wholetime[i] < 10){
            wholetime[i] = "0" + wholetime[i];
          }
      }
      const string = await wholetime[0] + "/" + wholetime[1] +"/" + wholetime[2] + " " + wholetime[3] + ":" + wholetime[4];
      
      await addDoc(chatRef, {
        content: message,
        user: auth.currentUser.displayName,
        createdAt: string,
        realtime: wholetime.join('')
      });
    }
    else if(message.length >= 70){
      alert("Your input can only contain at most 70 characters");
    }
    else if(message === ''){
      alert("You didn't type anything");
    }
    getContentList();
    setMessage('');
  }
  const getContentList = async ()=>{
    
    const chattingContent = await getDocs(chatRef);
    let data = chattingContent.docs.map((doc)=>({
      ...doc.data(),
      id: doc.id,
    }))
    data.sort((a, b)=>a.realtime - b.realtime);
    setChatList(data);
  }
  const handleDelete = async(id)=>{
    const data = doc(db, 'chat2', id);
    await deleteDoc(data);
    getContentList();
  }
  return (
    <div className="App">
       <ul className="guide" onWheel={(e)=>handleNav(e)}>
          <div className="guideline" ></div>
          <li id="1" ref={barRef[0]}>1</li>
          <li id="2" ref={barRef[1]}>2</li>
          <li id="3" ref={barRef[2]}>3</li>
       </ul>
   
      {/* <header className="App-header">
      
      </header>
       */}
        <div className="container desti" ref={navRef[0]}>
          <div className="main">
              <div className="image"></div>
                <div className="header">
                    <div className ="decoration"></div>
                    <div className="left" style={{cursor:"default"}}>
                        <h1>Louis's WebPage</h1>

                    </div>
                    <div className='right'>  
                      {confirmUser ? <h2 onClick = {logOut}>Sign out</h2> :<h2 onClick = {signUp}>Sign up</h2>}
                    </div>
                </div>
              <article>
                <div className="Btn" ref = {BtnRef} onClick={handleOnClickVideo} ><span> </span></div>
                <div className="News" ref={NewRef}><span> </span></div>
                <div className="gallery" ref = {galleryRef} onWheel={(e)=>handleOnWheel(e)}>
                  {videoRef.map((Ref, i)=>(
                    <video key = {i} ref={Ref} onMouseEnter={(e)=>handleOnMounseEnter(e)} className = {title[i]} src={videoList[i]}  muted loop/>
                  ))}
                  
                </div>
              </article>
          
          </div>

        </div>

        <section  id='aboutme' className="desti" ref={navRef[1]}>
          <div className="image_2"></div>
          <div className="sub_section">
              <h1>About me</h1>
              <h2>Who am I?</h2>
              <p>
                  &nbsp;&nbsp;
                  I'm currently studying in college and pursuing bachelor's degree. About this website, I has been learning HTML for some time.
                  Since wanting to create my own project, I made this website to demonstrate my ability in this area.
              </p>
              <h2>What kind of ability do I have?</h2>
              <p>
                  &nbsp;&nbsp;
                  I have been learning English speaking for months, and have excellent scores in TOEIC reading and listening tests.
              </p>
          </div>
          <h2 style={{paddingBottom: "30px"}}>Where do I study</h2>
          <div className="map">
              <iframe title= 'map'src={"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3641.372532314484!2d120.6731373150669!3d24.123551984406784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34693cfcecffe9d9%3A0xe28afadc0dad203a!2z5ZyL56uL5Lit6IiI5aSn5a24!5e0!3m2!1szh-TW!2stw!4v1676365214758!5m2!1szh-TW!2stw"} loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>    
        </section>
        <section className='desti back' ref={navRef[2]}>
          <div className='final'></div>
          <div className='chatRoom'>
            { confirmUser ? 
            <div className='user'>
              
              <img className = 'profile'  src={auth.currentUser?.photoURL} alt = 'none'/>
              <h4 className='profileName'>{auth.currentUser?.displayName}</h4>
              <div style={{display: 'flex'}}>
                <input value = {message} className = "inputContent"type='text' onChange={(e)=>setMessage(e.target.value)}/>
                <button className = "submit" onClick={handleOnClick}>Submit</button>
                
              </div>
            </div>
            : <h1>Not logged in</h1>
            }
            <div>
              {chatList.map((ele, i)=>(
                <div key={i} className='chatbox'>
                  <p >{ele.user + ' said: '} {ele.content}
                  <br/>
                  <span style={{fontSize:'0.5rem', opacity:".6", width: '100px'}}>{ele.createdAt ? ele.createdAt: ''}</span>
                  </p>
                  
                  {confirmUser ? <button className = 'delete submit'onClick={()=>handleDelete(ele.id)}>Delete</button>: ''}
                
                </div>
                ))}
            </div>
          </div>
          <br/>
          <a className = "link" href={'https://chatroom-9e07f.web.app'} target="_blank" rel="noopener noreferrer">另一個聊天網站(用來demo):<br/>https://chatroom-9e07f.web.app</a>
          <a className = "link" href={'./download/app-release.apk'} download>Download my timer app for Android mobile devices</a>
        </section>
    </div>
  );
}

export default App;
