import { useContext, useState, useEffect, FormEvent, ReactNode } from 'react';
import { VscGithubInverted, VscSignOut } from 'react-icons/vsc';

import styles from './styles.module.scss';

import { useAuth } from '../../hooks/auth';
import { api } from '../../services/api';

import { Toast } from '../Toast';

export function SendMessageForm() {
  const { user, signOut } = useAuth();
  const [message, setMessage] = useState('');
  const [toast, setToast] = useState<ReactNode>();

  const maxLength = 200;
  let bg: string;

  async function handleSendMessage(e: FormEvent) {
    e.preventDefault();

    //Lançar a animação de volta do toast
    if (!toast) {
      setTimeout(() => {
        setToast(
          <Toast
            style={{ background: bg }}
            initial={{ opacity: 1, translateY: 0 }}
            animate={{ opacity: 0, translateY: -500 }}
          />
        );
      }, 5000);

      setTimeout(() => setToast(undefined), 5100);
    }

    if (!message.trim()) {
      bg = '#bb2124';

      //Lançar a animação de ida do toast (na situação de erro)
      setToast(
        <Toast
          text="Erro: Você deve digitar uma mensagem!"
          style={{ background: bg }}
          initial={{ opacity: 0, translateY: -100 }}
          animate={{ opacity: 1, translateY: 0 }}
        />
      );
      return;
    }

    await api.post('messages', { text: message });
    bg = '#1b873f';

    //Lançar a animação de ida do toast (na situação de sucesso)
    setToast(
      <Toast
        text="Mensagem enviada com sucesso!"
        style={{ background: bg }}
        initial={{ opacity: 0, translateY: -100 }}
        animate={{ opacity: 1, translateY: 0 }}
      />
    );

    setMessage('');
  }

  return (
    <>
      {toast}
      <div className={styles.sendMessageFormWrapper}>
        <button className={styles.signOutButton} onClick={signOut}>
          <VscSignOut size={32} />
        </button>

        <header className={styles.userInformation}>
          <div className={styles.userImage}>
            <img src={user?.avatar_url} alt={user?.name} />
          </div>
          <strong className={styles.userName}>{user?.name}</strong>
          <span className={styles.userGithub}>
            <VscGithubInverted size={16} />
            {user?.login}
          </span>
        </header>

        <form
          onSubmit={(e) => handleSendMessage(e)}
          className={styles.sendMessageForm}
        >
          <label htmlFor="message">Mensagem</label>
          <textarea
            name="message"
            id="message"
            placeholder="Qual sua expectativa para o evento?"
            maxLength={maxLength}
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />

          <div className={styles.sendMessageFooter}>
            <div className={styles.counter}>
              <p>
                {message.length}/{maxLength}
              </p>
            </div>
            <button type="submit">Enviar Mensagem</button>
          </div>
        </form>
      </div>
    </>
  );
}
