import { ActivityIndicator, FlatList, Text } from 'react-native';
import OrderListItem from '@/components/OrderListItem';
import { Stack } from 'expo-router';
import React from 'react';
import { useAdminOrderList } from '@/api/orders';
import { useInsertOrderSubscription } from '@/api/orders/subscriptions';


export default function OrdersScreen() {
  const {data: orders, isLoading, error } = useAdminOrderList({archived: false})
 
  useInsertOrderSubscription()

  
  if (isLoading){
    return <ActivityIndicator/>
  }
  if (error) {
    return <Text>Failed to fetch</Text>
  }

  return (
    <>
      <Stack.Screen options={{ title: 'ORDERS' }} />
      <FlatList
        data={orders}
        contentContainerStyle={{ gap: 10, padding: 10 }}
        renderItem={({ item }) => <OrderListItem order={item} />}
      />
    </>
  );
}