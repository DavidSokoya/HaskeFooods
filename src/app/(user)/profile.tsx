import { View, Text, Button } from 'react-native';
import React from 'react';
import { supabase } from '@/lib/supabase';

const ProfileScreen = () => {

  const signOut = async () => {
    await supabase.auth.signOut();
  }
  return (
    <View>
      <Button
        onPress={signOut}
        title="Sign out"
      />
    </View>
  );
};

export default ProfileScreen;