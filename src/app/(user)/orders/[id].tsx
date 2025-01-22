import { Text, FlatList, View, StyleSheet, ActivityIndicator} from "react-native"
import { useLocalSearchParams, Stack} from "expo-router"
import OrderListItem from "@/components/OrderListItem";
import OrderItemListItem from "@/components/OrderItemListItem";
import { useOrderDetails } from "@/api/orders";
import { useUpdateOrderSubscription } from "@/api/orders/subscriptions";


export default function OrderDetailScreen () {
   const {id: idString} = useLocalSearchParams();
 
   const id = parseFloat(typeof idString === 'string' ? idString : idString[0] );
   useUpdateOrderSubscription(id)

    const {data: order, isLoading, error } = useOrderDetails(id);
    if (isLoading){
      return <ActivityIndicator/>
    }
  
    if (error || !order) {
      return <Text>Order not found!</Text>;
    }
  
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Order #${order.id}` }} />

      <OrderListItem order={order} />

      <FlatList
        data={order.order_items}
        renderItem={({ item }) => <OrderItemListItem item={item} />}
        contentContainerStyle={{ gap: 10 }}
      /> 
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    gap: 10,
  },
});