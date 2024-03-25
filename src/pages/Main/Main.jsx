import React from 'react';
import { useState, useRef, useEffect } from 'react';
import './Main.css';
import chat_logo from '../../images/chat_component.png';
import { Axios } from 'axios';
import user_icon from '../../images/user_icon33.png';
// import { VscSend } from 'react-icons/vsc';
// import { BsSendFill } from 'react-icons/bs';
import { IoMdSend } from 'react-icons/io';

const Main = () => {
  const [userInput, setUserInput] = useState('');
  // const [chatbotInput, setChatBotInput] =  useState('');
  const textAreaRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus consequatur impedit, accusantium totam quidem perspiciatis nihil dolores libero sapiente ea ex eum assumenda corporis nam amet ducimus, unde tenetur similique.Esse deleniti sequi suscipit recusandae beatae, consectetur laborum reiciendis debitis voluptas quidem enim nihil. Libero, voluptatibus. Minima eum deleniti magni est. Blanditiis aperiam velit, dolor vel quidem omnis fuga ullam. Autem neque delectus error aperiam pariatur dolor. Eveniet ea odio vel corporis vitae, recusandae dolores et architecto, est neque, aspernatur aliquam reiciendis quibusdam sequi perspiciatis itaque. Consectetur vitae iusto laborum!',
      id: 'user',
    },
    {
      text: "Salut! Bienvenue à TheMaintainer. Comment puis-je vous aider aujourd'hui ?",
      id: 'chatbot',
    },
  ]);
  useEffect(() => {
    const textareaEle = textAreaRef.current;

    const adjustTextareaHeight = () => {
      textareaEle.style.height = 'auto';
      textareaEle.style.height = `${textareaEle.scrollHeight}px`;
    };

    textareaEle.addEventListener('input', adjustTextareaHeight);

    return () => {
      textareaEle.removeEventListener('input', adjustTextareaHeight);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    textAreaRef.current.style.height = '60px';

    setMessages([...messages, { text: userInput, id: 'user' }]);
    setUserInput('');

    const data = await Axios.post('http://localhost:3000', {
      text: userInput,
      id: 'user',
    });
    try {
      if (data.status === 200) {
        const getRq = await Axios.get('http://localhost:3000');

        try {
          const chatInput = getRq.res;
          //si tu renvoi l'objet directement tu mais l'objet une fois.
          setMessages([...messages, { text: chatInput, id: 'chatbot' }]);
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="main-container">
      <div className="introduction">
        <div className="content column">
          {messages
            .filter((item) => item.id === 'chatbot')
            .map((msg, index) => (
              <div key={index} className="bot-text">
                <div className="default-chat">
                  <div className="img-div">
                    <img className="chat-img" src={chat_logo} alt="" />
                  </div>
                  <div className="default-chat--text">
                    <p className="maintener-text">The Maintainer</p>
                    <p className="hello-text">{msg.text}</p>
                  </div>
                </div>
              </div>
            ))}

          {messages
            .filter((item) => item.id === 'user')
            .map((msg, index) => (
              <div key={index} className="user-text">
                <div className="default-chat">
                  <div className="user-img-div">
                    <img className="user-img" src={user_icon} alt="" />
                  </div>
                  <div className="default-chat--text">
                    <p className="maintener-text">Vous</p>
                    <p className="hello-text">{msg.text}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="input-form">
        <div className="content send">
          <textarea
            placeholder="Posez votre question ici..."
            ref={textAreaRef}
            name=""
            id=""
            onKeyDown={handleKeyDown}
            rows="1"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            style={{ minHeight: '60px' }}
          ></textarea>
          <button type="submit" onClick={handleSubmit} className="btn">
            {userInput.trim() === '' ? (
              <IoMdSend
                className="send-icon"
                style={{ width: '38px', height: '38px', color: '#ccc' }}
              />
            ) : (
              <IoMdSend
                className="send-icon"
                style={{ width: '38px', height: '38px', color: 'white' }}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Main;
