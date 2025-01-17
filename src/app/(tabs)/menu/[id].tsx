import { View, Text, Image, StyleSheet, Pressable } from 'react-native'
import { Stack, useLocalSearchParams } from 'expo-router'
import products from 'assets/data/products';
import { defaultPizzaimage } from '@/components/ProductListItem';
import Button from '@/components/Button';
import { useState } from 'react';

const sizes = ['S', 'M', 'L', 'XL'];

const ProductDetailsScreen = () => {
  const [selectedSize, setselectedSize] = useState('M')
  const {id} = useLocalSearchParams();

  const product = products.find(p => p.id.toString() === id)
  const addToCart = () => {
    console.warn('Adding to Cart', selectedSize)
  }
  if (!product){
    return <Text>Product not found!</Text>
  }
  return (
    <View style={styles.container}>
      <Stack.Screen options={{title: product.name }}/>
      <Image source={{uri: product.image || defaultPizzaimage}} style={styles.image}/>
      
      <Text>Select size</Text>
      <View  style={styles.sizes}>
      {sizes.map((size) => (
        <Pressable onPress={() =>{setselectedSize(size)}} style={[styles.size, {backgroundColor: selectedSize === size? 'gainsboro':'white'}]} key={size}>
          <Text style={[styles.sizeText, {color: selectedSize === size? 'green': 'black'}]} >{size}</Text>
        </Pressable>
     ))}
     </View>
     <Text style={styles.price}>${product.price}</Text>
     <Button onPress={addToCart} text='Add to cart'/>
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
  price:{
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 'auto'
  },
  sizes:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  size:{
    backgroundColor: 'gainsboro',
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sizeText:{
    fontSize: 20,
    fontWeight: '500'
  }
})
export default ProductDetailsScreen;