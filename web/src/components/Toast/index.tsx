import { animate, motion } from 'framer-motion';

import styles from './styles.module.scss';

type animationProps = {
  opacity: number;
  translateY: number;
};

type ToastProps = {
  text?: string;
  style: { background: string };
  initial: animationProps;
  animate: animationProps;
};

export function Toast(props: ToastProps) {
  return (
    <motion.div
      {...props}
      transition={{
        type: 'spring',
        stiffness: 180,
        damping: 12,
      }}
      className={styles.toastWrapper}
    >
      <p className={styles.toastContent}>{props.text}</p>
    </motion.div>
  );
}
