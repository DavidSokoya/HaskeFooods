import { View, Text, StyleSheet,  Image, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useState,useEffect } from 'react';
import { defaultPizzaImage } from '@/components/ProductListItem';
import Colors from '../../../constants/Colors';
import Button from '../../../components/Button';
import * as ImagePicker from 'expo-image-picker';
import {Stack, useLocalSearchParams, useRouter} from 'expo-router'
import { useInsertProduct, useUpdateProduct, useProduct, useDeleteProduct } from '@/api/product';
import * as FileSystem from 'expo-file-system';
import { randomUUID } from 'expo-crypto';
// import { v4 as uuidv4 } from 'uuid';
import { decode } from 'base64-arraybuffer';
import { supabase } from '@/lib/supabase';

const CreateScreen = () => {
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter()

  const {id: idString} = useLocalSearchParams();
  const id = parseFloat(typeof idString === 'string' ? idString : idString?.[0])
  const isUpdating = !!id ;

  const {mutate: insertProduct} = useInsertProduct();
  const {mutate: updateProduct} = useUpdateProduct();
  const {mutate: deleteProduct} = useDeleteProduct();
  const {data: updatingProduct} = useProduct(id);

  

  useEffect( () => {
    if (updatingProduct) {
      setName(updatingProduct.name);
      setPrice(updatingProduct.price.toString());
      setImage(updatingProduct.image);
    }
  }, [updatingProduct]) 


  const validateInput = () => {
    setErrors('');
    if (!name) {
      setErrors('Name is required');
      return false;
    }
    if (!price) {
      setErrors('Price is required');
      return false;
    }
    if (isNaN(parseFloat(price))) {
      setErrors('Price should be a number');
      return false;
    }
    return true;
  };
  
  const resetFields = () => {
    setName('');
    setPrice('');
  }

  const onSubmit = () => {
    if (isUpdating) {
      onUpdate();
    }else{
      onCreate()
    }
  }

  const onCreate = async () => {
    if (!validateInput()) {
      return;
    }
    setIsLoading(true);
  
      const imagePath = image ? await uploadImage() : null

      insertProduct(
        {name, price: parseFloat(price), image: imagePath},
        {
        onSuccess: () => {
          resetFields();
          router?.back();
        },
        }
    );
    setIsLoading(true);
};


 const onUpdate = async () => {
    if (!validateInput()) {
      return
    }
    setIsLoading(true);

     const imagePath = image ? await uploadImage() : null

    updateProduct(
      {id, name, price: parseFloat(price), image: imagePath},
      {
      onSuccess: () => {
        resetFields();
        router.back();
      },
    }
  );
   setIsLoading(true);
}





const onDelete = () => {
  deleteProduct(id,
  {
    onSuccess: () => {
      resetFields()
      router.replace('/(admin)');
    }
  });
}

const confirmDelete = () => {
  Alert.alert('Confirm', 'Are you sure you want to delete this product?', [
    {
      text: 'Cancel'
    },{
      text: 'Delete',
      style: 'destructive',
      onPress: onDelete,
    }
    ])
}

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
 

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // const uploadImage = async () => {
  //   if (!image?.startsWith('file://')) {
  //     return;
  //   }
  
  //   const base64 = await FileSystem.readAsStringAsync(image, {
  //     encoding: 'base64',
  //   });
  //     const filePath = `${randomUUID()}.png`;
  //     const contentType = 'image/png';

  //     const { data, error } = await supabase.storage.from('product-images').upload(filePath, decode(base64), { contentType });

  //     if (error) {
  //       console.error('Error uploading image:', error.message);
  //       return;
  //     }
  //     if (data) {
  //     return data?.path;
  //   }
  // };

  const uploadImage = async () => {
    if (!image?.startsWith('file://')) {
      return;  // No image to upload, return early
    }
  
    try {
      // Read the file as a base64 string
      const base64 = await FileSystem.readAsStringAsync(image, { encoding: FileSystem.EncodingType.Base64 });
  
      // Convert the base64 string into a binary array buffer
      const buffer = decode(base64);
  
      // Generate a unique filename
      const filePath = `${randomUUID()}.png`;
  
      // Upload the image as a Blob
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, buffer, {
          contentType: 'image/png', // Adjust content type accordingly
        });
  
      if (error) {
        throw new Error(error.message);
      }
  
      // Return the path if the upload is successful
      return data?.path;
  
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };


  return (
    <View style={styles.container}>
      <Stack.Screen options={{title: isUpdating? 'Update Product' : 'Create Product'}} />
      <Image style={styles.image}source={{uri:image || defaultPizzaImage}}/>
      <Text onPress={pickImage}style={styles.textButton}>Select Image</Text>
      <Text style={styles.label}>Name</Text>
      <TextInput 
        value={name}
        onChangeText={setName}
        placeholder='Name' 
        style={styles.input}
      />
      <Text style={styles.label}>Price</Text>
      <TextInput 
        value={price}
        onChangeText={setPrice}
        placeholder='N800' 
        style={styles.input} keyboardType='numeric'
      />
    <Text style={styles.error}>{errors}</Text>
    {isLoading ? (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={Colors.light.tint} />
    <Text style={styles.loadingText}>
      {isUpdating ? 'Updating...' : 'Creating...'}
    </Text>
  </View>
) : (
  <Button text={isUpdating ? 'Update' : 'Create'} onPress={onSubmit} />
)}
    {isUpdating &&<Text style={styles.textButton} onPress={confirmDelete}>Delete</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  image: {
    width: '50%',
    aspectRatio: 1,
    alignSelf: 'center',
  },
  textButton: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginVertical: 10,
  },
  label: {
    color: 'gray',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  loadingText: {
    marginTop: 10,
    color: Colors.light.tint,
  },
});

export default CreateScreen;

