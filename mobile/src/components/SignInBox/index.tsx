import React from 'react';

import { View } from 'react-native';

import { styles } from './styles';

import { Button } from '../../components/Button';
import { COLORS } from '../../theme';
import { useAuth } from '../../hooks/auth';

export function SignInBox() {
  const { signIn, isSigningIn } = useAuth();

  return (
    <View style={styles.container}>
      <Button
        text="Entrar com o GitHub"
        color={COLORS.BLACK_PRIMARY}
        backgroundColor={COLORS.YELLOW}
        icon="github"
        onPress={signIn}
        isLoading={isSigningIn}
      />
    </View>
  );
}
