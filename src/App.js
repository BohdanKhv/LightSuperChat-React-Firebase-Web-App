import './style.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData, useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { useEffect, useState, useRef } from 'react';

firebase.initializeApp({
})

const auth = firebase.auth();
const firestore = firebase.firestore();


const App = () => {

  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState([]);

  function SignIn () {
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
    }
    return (
      <div className="btn-container">
        <button
            onClick={signInWithGoogle}
            className='btn-danger'>
            Sign in with Google
        </button>
      </div>
    )
  }

  function SignOut () {
    return auth.currentUser && (
      <div className="">
          <button
              onClick={() => auth.signOut()}
              className='btn-outline'>
              Sign Out
          </button>
      </div>
    )
  }

  async function getMessagesOnce () {
    const messagesArr = [];
    await firebase.firestore().collection('messages').orderBy('createdAt').limit(25).get()
      .then(querySnapshot => {
        querySnapshot.docs.forEach(doc => {
        messagesArr.push(doc.data());
      });
    });
    return setMessages(messagesArr);
  }

  function ChatRoom () {

    // Too much reads because of loop 
    const messagesRef = firestore.collection('messages')
    // const query = messagesRef.orderBy('createdAt').limit(25)
    // messages == null && ([messages] = useCollectionDataOnce(query, {idField: 'id'}))
    // console.log(auth.currentUser.uid)

    const [formValue, setFormValue] = useState('');
    const bottom = useRef(null)

    const sendMessage = async (e) => {

      e.preventDefault()

      const { uid, photoURL } = auth.currentUser;

      await messagesRef.add({
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL
      })

      setFormValue('');
      getMessagesOnce();
      bottom.current.scrollIntoView();

    }

    messages.length === 0 && getMessagesOnce()

    return (
      <div>
        <header className="header"> 
          <h6>&#128512; Light Super Chat</h6>
          <SignOut/>
        </header>
        <main className="main">
          <div className="container">
            { messages.length !== 0 && messages.map( msg => <Message key={msg.createdAt.seconds} message={msg}/> ) }
            { messages.length !== 0 && messages.map( msg => <Message key={msg.createdAt.seconds} message={msg}/> ) }
            { messages.length !== 0 && messages.map( msg => <Message key={msg.createdAt.seconds} message={msg}/> ) }
            { messages.length !== 0 && messages.map( msg => <Message key={msg.createdAt.seconds} message={msg}/> ) }
            { messages.length !== 0 && messages.map( msg => <Message key={msg.createdAt.seconds} message={msg}/> ) }
            { messages.length !== 0 && messages.map( msg => <Message key={msg.createdAt.seconds} message={msg}/> ) }
            
            <div ref={bottom}></div>
          </div>
          <form onSubmit={sendMessage} className="form">
            <input value={formValue} onChange={(e) => setFormValue(e.target.value)} className="text-input" type="text" placeholder="Message &#x1F447; &#x1F447; &#x1F447;" />
            <input className="btn-input" type="submit" value="&#128036;" />
          </form>
        </main>
      </div>
    )
  }

  function Message (props) {
    const {text, uid, photoURL} = props.message;

    return (
      <div className={ uid === auth.currentUser.uid ? "message-container user" : "message-container" }>
        <img src={photoURL}/>
        <div className={ uid === auth.currentUser.uid ? "message message-user" : "message" }>
          <p>
            { text }
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='App'>
      { user ? <ChatRoom /> : <SignIn />}
      {/* <SignOut /> */}
    </div>
  )
}

export default App