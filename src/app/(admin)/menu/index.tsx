import {Text, FlatList, ActivityIndicator} from 'react-native';
import ProductListItem from '@/components/ProductListItem';
import { useProductList } from '@/api/product';


export default function MenuScreen() {
    const {data: products, error, isLoading} = useProductList()
   
    if (isLoading){
      return <ActivityIndicator size='large'/>
    }
    if (error) {
      return <Text>Failed to fetch products</Text>
    }
  
  
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

