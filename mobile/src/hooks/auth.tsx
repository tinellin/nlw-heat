import React, { useEffect } from 'react';
import { createContext, useContext, useState, ReactNode } from 'react';
import * as AuthSessions from 'expo-auth-session';

import { api } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Credenciais do Github
const CLIENT_ID = '8abd0b6b2660cf958b45';
const SCOPE = 'user';

//Chaves do AsyncStorage
const USER_STG = '@nwlheatmobile:user';
const TOKEN_STG = '@nwlheatmobile:token';

type User = {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
};

type AuthContextData = {
  user: User | null;
  isSigningIn: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext({} as AuthContextData);

type AuthProviderProps = { children: ReactNode };

type AuthResponse = {
  token: string;
  user: User;
};

type AuthorizationResponse = {
  params: { code?: string; error?: string };
  type?: string;
};

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(true);

  async function signIn() {
    try {
      setIsSigningIn(true);
      const url = `http://github.com/login/oauth/authorize?scope=${SCOPE}&client_id=${CLIENT_ID}`;

      //Fazer conexão com uma URL externa (no caso o OAuth do GitHub)
      const authSessionResponse = (await AuthSessions.startAsync({
        authUrl: url,
      })) as AuthorizationResponse;

      if (
        authSessionResponse.type == 'success' &&
        authSessionResponse.params.error != 'access_denied'
      ) {
        const authResponse = await api.post<AuthResponse>('authenticate', {
          code: authSessionResponse.params.code,
        });

        const { token, user } = authResponse.data;

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        await AsyncStorage.setItem(TOKEN_STG, token);
        await AsyncStorage.setItem(USER_STG, JSON.stringify(user));

        setUser(user);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsSigningIn(false);
    }
  }

  async function signOut() {
    setUser(null);
    await AsyncStorage.removeItem(TOKEN_STG);
    await AsyncStorage.removeItem(USER_STG);
  }

  useEffect(() => {
    async function loadUserStorageData() {
      const userStg = await AsyncStorage.getItem(USER_STG);
      const tokenStg = await AsyncStorage.getItem(TOKEN_STG);

      if (userStg && tokenStg) {
        api.defaults.headers.common['Authorization'] = `Bearer ${tokenStg}`;
        setUser(JSON.parse(userStg));
      }

      setIsSigningIn(false);
    }

    loadUserStorageData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isSigningIn, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };
