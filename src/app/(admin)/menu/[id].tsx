import { View, Text, Image, StyleSheet,  Pressable, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams,Link, useRouter } from 'expo-router';
import { defaultPizzaImage } from '@/components/ProductListItem';
import { useState } from 'react';
import { useCart } from '@/providers/CartProvider';
import { PizzaSize } from '@/types';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useProduct } from '@/api/product';
import RemoteImage from '@/components/RemoteImage';


const sizes: PizzaSize[] = ['S', 'M', 'L', 'XL'];

const ProductDetailsScreen = () => {
  const [selectedSize, setselectedSize] = useState<PizzaSize>('M')
  
  const {id: idString} = useLocalSearchParams();
  const id = parseFloat(typeof idString === 'string' ? idString : idString[0])
  
  const {data: product, error, isLoading} = useProduct(id)

  const {addItem} = useCart()
  const router = useRouter();
  
  
  const addToCart = () => {
    if (!product){
      return;
    }
    addItem(product, selectedSize)
    router.push('/cart')
  }

  if (error){
    return <Text>Product not found!</Text>
  }
 
  if(isLoading){
    return <ActivityIndicator/>
  }

  return (
    <View style={styles.container}>
      <Stack.Screen  
      options={{
        title: 'Menu', 
        headerRight: () => (
          <Link href={`/(admin)/menu/create?id=${id}`} asChild>
            <Pressable>
              {({ pressed }) => (
                <FontAwesome
                  name="pencil"
                  size={25}
                  color={Colors.light.tint}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          </Link>
  )}}/>
      
      <Stack.Screen options={{title: product.name }}/>
      <RemoteImage
          fallback={defaultPizzaImage}
          path={product.image}
          style={styles.image}
          resizeMode="contain"
        />
      <Text style={styles.title}>{product.name}</Text>
     <Text style={styles.price}>₦{product.price}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    backgroundColor: '#fff',
    flex: 1,
    padding: 10
  },
  image:{
    width: '100%',
    aspectRatio: 1,
  },
  title: {
    fontSize: 20
  },
  price:{
    fontSize: 18,
    fontWeight: 'bold',
  },
})
export default ProductDetailsScreen;