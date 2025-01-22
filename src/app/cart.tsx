import { View,Text,  Platform, FlatList } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import {useCart} from '../providers/CartProvider'
import CartListItem from '@/components/CardListItem';
import Button from '@/components/Button';


const CartScreen = () => {
  const {items, total, checkout} = useCart()
  return (
    <View style = {{padding: 10}}>
      <FlatList 
        data={items} 
        renderItem={({item}) => <CartListItem cartItem={item}/>}
        contentContainerStyle={{padding: 10, gap: 5}}
      />
      <Text style={{marginTop: 20, fontSize: 20, fontWeight: '600' }}>Total: ₦{total}</Text>
      <Button  onPress={checkout}text='Checkout'/>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'}/>
    </View>
  )
}

export default CartScreen;