import { FlatList, ActivityIndicator, Text } from 'react-native';
import OrderListItem from '@/components/OrderListItem';
import { Stack } from 'expo-router';
import React from 'react';
import { useAdminOrderList } from '@/api/orders';

export default function OrdersScreen() {

    const {data: orders, isLoading, error } = useAdminOrderList({archived: true})
    if (isLoading){
      return <ActivityIndicator size='large'/>
    }
    if (error) {
      return <Text>Failed to fetch</Text>
    }
  return (
    <>
      <Stack.Screen options={{ title: 'ARCHIVE' }} />
      <FlatList
        data={orders}
        contentContainerStyle={{ gap: 10, padding: 10 }}
        renderItem={({ item }) => <OrderListItem order={item} />}
      />
    </>
  );
}