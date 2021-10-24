import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { io } from 'socket.io-client';

import { styles } from './styles';

import { api } from '../../services/api';

import { Message, MessageProps } from '../Message';

const socket = io(String(api.defaults.baseURL));
let messageQueue: MessageProps[] = [];

socket.on('new_message', (message) => {
  messageQueue.push(message);
});

export function MessageList() {
  const [currentMessages, setCurrentMessages] = useState<MessageProps[]>();

  useEffect(() => {
    const timer = setInterval(() => {
      if (messageQueue.length > 0) {
        setCurrentMessages((prevState) => [
          messageQueue[0],
          prevState![0],
          prevState![1],
        ]);

        messageQueue.shift();
      }
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchMessages() {
      const msgRes = await api.get<MessageProps[]>('messages/last3');
      setCurrentMessages(msgRes.data);
    }

    fetchMessages();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="never"
    >
      {currentMessages?.map((message) => {
        return (
          <View key={message.id}>
            <Message data={message} />
          </View>
        );
      })}
    </ScrollView>
  );
}
