import React from 'react';
import { useLocalSearchParams } from 'expo-router';

export default function EditProduct() {
  const { id } = useLocalSearchParams();

  return (
    <div>
      Edit Product Page for ID: {id}
    </div>
  );
}