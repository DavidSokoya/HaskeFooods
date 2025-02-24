import { Text,  StyleSheet, Pressable} from 'react-native'
import Colors from '@/constants/Colors';
import { Link, useSegments } from 'expo-router';

import RemoteImage from './RemoteImage';

import {  Tables } from '@/types';

export const defaultPizzaImage = 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/peperoni.png'

type ProductListItemProps = {
  product: Tables<'products'>;
}

const ProductListItem = ({product}: ProductListItemProps ) => {
  const segments = useSegments();
  
  return (
    <Link href={`/menu/${product.id}`} asChild>
    <Pressable style={styles.container}>
              <RemoteImage
                fallback={defaultPizzaImage}
                path={product.image ?? undefined}
                style={styles.image}
                resizeMode="contain"
              />
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>₦{product.price}</Text>
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
  