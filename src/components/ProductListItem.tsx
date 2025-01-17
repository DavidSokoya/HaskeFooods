import {View, Text, Image, StyleSheet, Pressable} from 'react-native'
import Colors from '@/constants/Colors';
import { Link } from 'expo-router';

import { Product } from '@/types';

export const defaultPizzaimage = 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/peperoni.png'
type ProductListItemProps = {
  product: Product;
}

const ProductListItem = ({product}: ProductListItemProps ) => {
  return (
    <Link href={`/menu/${product.id}`} asChild>
    <Pressable style={styles.container}>
        <Image resizeMode='contain' source={{uri: product.image || defaultPizzaimage}} style={styles.image}/>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>${product.price}</Text>
      </Pressable>
      </Link>
    )
  }
  
  export default ProductListItem;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 10,
      flex: 1, 
      maxWidth: '50%',
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      marginVertical: 10,
    },
    price: {
      color: Colors.light.tint,
      fontWeight: 'bold'
    },
    image:{
      width: '100%',
      aspectRatio: 1
    }
  });
  