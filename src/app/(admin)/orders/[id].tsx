import { Text, FlatList, View, StyleSheet, Pressable, ActivityIndicator} from "react-native"
import { useLocalSearchParams, Stack} from "expo-router"
import OrderListItem from "@/components/OrderListItem";
import OrderItemListItem from "@/components/OrderItemListItem";
import { OrderStatusList } from "@/types";
import Colors from "@/constants/Colors";
import { useOrderDetails, useUpdateOrder } from "@/api/orders";



export default function OrderDetailScreen () {
 const {id: idString} = useLocalSearchParams();
  const id = parseFloat(typeof idString === 'string' ? idString : idString[0] );

  const {mutate: updateOrder} = useUpdateOrder() 
  const {data: order, isLoading, error } = useOrderDetails(id);
  
  const updateStatus = (status) => {
    updateOrder({id: id, updatedFields: {status}});
  }
  
  
  if (isLoading){
    return <ActivityIndicator/>
  }

  if (error || !order) {
    return <Text>Order not found!</Text>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Order #${id}` }} />

      <OrderListItem order={order} />

      <FlatList
        data={order.order_items}
        renderItem={({ item }) => <OrderItemListItem item={item} />}
        contentContainerStyle={{ gap: 10 }}
        ListFooterComponent={ () => 

     <View>
      <Text style={{ fontWeight: 'bold' }}>Status</Text>
      <View style={{ flexDirection: 'row', gap: 5 }}>
        {OrderStatusList.map((status) => (
          <Pressable
            key={status}
            onPress={() => updateStatus(status)}
            style={{
              borderColor: Colors.light.tint,
              borderWidth: 1,
              padding: 10,
              borderRadius: 5,
              marginVertical: 10,
              backgroundColor:
                order.status === status
                  ? Colors.light.tint
                  : 'transparent',
            }}
          >
        <Text
          style={{
            color:
              order.status === status ? 'white' : Colors.light.tint,
          }} >
          {status}
        </Text>
      </Pressable>
    ))}
  </View>
</View>
      }
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