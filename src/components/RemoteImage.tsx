// import { Image } from 'react-native';
// import React, { ComponentProps, useEffect, useMemo, useState } from 'react';
// import { supabase } from '../lib/supabase';

// type RemoteImageProps = {
//   path?: string;
//   fallback: string;
// } & Omit<ComponentProps<typeof Image>, 'source'>;

// const RemoteImage = ({ path, fallback, ...imageProps }: RemoteImageProps) => {
//   const [image, setImage] = useState('');

//   useEffect(() => {
//     if (!path) return;
//     (async () => {
//       setImage('');
//       const { data, error } = await supabase.storage
//         .from('product-images')
//         .download(path,{transform: {width: 50, height: 50}});

//       if (error) {
//         console.log(error);
//       }

//       if (data) {
//         const fr = new FileReader();
//         fr.readAsDataURL(data);
//         fr.onload = () => {
//           setImage(fr.result as string);
//         };
//       }
//     })();
//   }, [path]);

//   if (!image) {
//   }

//   return <Image source={{ uri: image || fallback }} {...imageProps} />;
// };

// export default RemoteImage;

import { Image } from 'react-native';
import React, { ComponentProps, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type RemoteImageProps = {
  path?: string;
  fallback: string;
  onError?: (error: Error) => void;
} & Omit<ComponentProps<typeof Image>, 'source'>;

const RemoteImage = ({ 
  path, 
  fallback, 
  onError,
  ...imageProps 
}: RemoteImageProps) => {
  const [image, setImage] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    
    const loadImage = async () => {
      if (!path) return;
      
      try {
        setImage(''); // Clear existing image while loading
        
        // Check if the path is a local file URI
        if (path.startsWith('file://')) {
          // For local files, we can use the URI directly
          if (mounted) {
            setImage(path);
          }
          return;
        }

        // For Supabase storage files
        const { data, error } = await supabase.storage
          .from('product-images')
          .download(path);

        if (error) {
          throw error;
        }

        if (data && mounted) {
          const fr = new FileReader();
          
          fr.onload = () => {
            if (mounted) {
              setImage(fr.result as string);
            }
          };

          fr.onerror = () => {
            throw new Error('Failed to read file');
          };

          fr.readAsDataURL(data);
        }
      } catch (error) {
        console.error('Error loading image:', error);
        onError?.(error as Error);
      }
    };

    loadImage();

    return () => {
      mounted = false;
    };
  }, [path, onError]);

  return (
    <Image 
      source={{ uri: image || fallback }}
      {...imageProps} 
    />
  );
};

export default RemoteImage;