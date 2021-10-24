import { useContext } from 'react';
import { VscGithubInverted } from 'react-icons/vsc';
import styles from './styles.module.scss';

import { useAuth } from '../../hooks/auth';

export function LoginBox() {
  const { signUrl } = useAuth();

  return (
    <div className={styles.loginBoxWrapper}>
      <strong>Entre e compartilhe sua mensagem</strong>
      <a href={signUrl} className={styles.github}>
        <VscGithubInverted size={24} />
        Entrar com o GitHub
      </a>
    </div>
  );
}
