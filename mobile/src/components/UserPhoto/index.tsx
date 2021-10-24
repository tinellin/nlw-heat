import React from 'react';
import { Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { styles } from './styles';
import imgAvatar from '../../assets/avatar.png';
import { COLORS } from '../../theme';

const SIZES = {
  SMALL: {
    containerSize: 32,
    avatarSize: 28,
  },
  NORMAL: {
    containerSize: 48,
    avatarSize: 42,
  },
};

type Props = {
  imgUri: string | undefined;
  sizes?: 'SMALL' | 'NORMAL';
};

const DEFAULT_AVATAR = Image.resolveAssetSource(imgAvatar).uri;

export function UserPhoto({ imgUri, sizes = 'NORMAL' }: Props) {
  //Hackzinho
  const { containerSize, avatarSize } = SIZES[sizes];

  return (
    <LinearGradient
      colors={[COLORS.PINK, COLORS.YELLOW]}
      start={{ x: 0, y: 0.8 }}
      end={{ x: 0.9, y: 1 }}
      style={[
        styles.container,
        {
          width: containerSize,
          height: containerSize,
          borderRadius: containerSize / 2,
        },
      ]}
    >
      <Image
        source={{ uri: imgUri || DEFAULT_AVATAR }}
        style={[
          styles.avatar,
          {
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
          },
        ]}
      ></Image>
    </LinearGradient>
  );
}
