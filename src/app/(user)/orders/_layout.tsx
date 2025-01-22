import { Stack } from 'expo-router';


const MenuStack = () => {
  return (
    <Stack>
      <Stack.Screen  name='index' options={{title: 'Order'}}/>
    </Stack>
  )
}

export default MenuStack;