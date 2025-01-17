import { View, FlatList, StyleSheet } from 'react-native';
import ProductListItem from '@/components/ProductListItem';
import products from 'assets/data/products';


export default function MenuScreen() {
  return (
   
    <FlatList
      numColumns={2}
      data={products}
      renderItem={({item}) => <ProductListItem product={item}/>}
      contentContainerStyle={{gap:5, padding: 5}}
      columnWrapperStyle={{gap:5}}
    />
  );
}

