import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { api } from '../services/api';

type User = {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
};

type AuthProviderData = {
  user: User | null;
  signUrl: string;
  signOut: () => void;
};

type AuthProvider = {
  children: ReactNode;
};

type AuthResponse = {
  token: string;
  user: User;
};

const AuthContext = createContext({} as AuthProviderData);

function AuthProvider(props: AuthProvider) {
  const [user, setUser] = useState<User | null>(null);

  const CLIENT_ID = '41cf2631880202b56d39';
  const signUrl = `http://github.com/login/oauth/authorize?scope=user&client_id=${CLIENT_ID}`;

  async function signIn(githubCode: string) {
    const res = await api.post<AuthResponse>('authenticate', {
      code: githubCode,
    });

    const { token, user } = res.data;

    localStorage.setItem('@dowhile:token', token);

    api.defaults.headers.common.authorization = `Bearer ${token}`;

    setUser(user);
  }

  function signOut() {
    setUser(null);
    localStorage.removeItem('@dowhile:token');
  }

  useEffect(() => {
    //Pegar URL
    const url = window.location.href;

    //Verificar se URL têm o código de auth do usuário
    const hasGithubCode = url.includes('?code=');

    //Se sim, pegar este código e redirecionar o usuário
    if (hasGithubCode) {
      const [urlWithGithubCode, githubCode] = url.split('?code=');
      window.history.pushState({}, '', urlWithGithubCode);

      signIn(githubCode);
    }
  }, []);

  useEffect(() => {
    async function verifyUser() {
      const token = localStorage.getItem('@dowhile:token');

      api.defaults.headers.common.authorization = `Bearer ${token}`;

      const { data } = await api.get<User>('profile');

      setUser(data);
    }

    verifyUser();
  }, []);

  return (
    <AuthContext.Provider value={{ signUrl, user, signOut }}>
      {props.children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };
