import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import io from 'socket.io-client';

import styles from './styles.module.scss';
import logoImg from '../../assets/logo.svg';

import { api } from '../../services/api';

type Message = {
  id: string;
  text: string;
  user: {
    name: string;
    avatar_url: string;
  };
};

const socket = io('http://localhost:4000');

const messageQueue: Message[] = [];

socket.on('new_message', (message: Message) => {
  messageQueue.push(message);
});

export function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (messageQueue.length > 0) {
        setMessages((prevState) =>
          [messageQueue[0], prevState[0], prevState[1]].filter(Boolean)
        );

        messageQueue.shift();
      }
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    api.get<Message[]>('messages/last3').then((res) => {
      setMessages(res.data);
    });
  }, []);

  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt="DoWhile 2021" />

      <ul className={styles.messageList}>
        {messages.map((message) => {
          return (
            <motion.li
              initial={{ opacity: 0, translateY: -60 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              key={message.id}
              className={styles.message}
            >
              <p className={styles.messageContent}>{message.text}</p>
              <div className={styles.messageUser}>
                <div className={styles.userImage}>
                  <img src={message.user.avatar_url} alt={message.user.name} />
                </div>
                <span>{message.user.name}</span>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
