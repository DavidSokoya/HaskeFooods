import { View, Text, Pressable, StyleSheet } from 'react-native'
import Colors from '@/constants/Colors'
import React,{forwardRef} from 'react'

type ButtonProps ={
  text: string;
} & React.ComponentPropsWithoutRef<typeof Pressable>;

const Button = forwardRef<View | null, ButtonProps> (
  
  ({text, ...PressableProps}, ref) => {
  return (
    <Pressable ref={ref} {...PressableProps} style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
}
)

const styles = StyleSheet.create({
  container:{
    backgroundColor: Colors.light.tint,
    padding: 15,
    alignItems: 'center',
    borderRadius: 100,
    marginVertical: 10,
  },
  text:{
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
export default Button