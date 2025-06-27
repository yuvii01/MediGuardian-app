import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Modal, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { dbToCart } from '../reducers/cartSlice';
import { Context } from '../context/MainContext';
import axios from 'axios';
// import { Audio } from 'expo-av'; // For notification sound
// import * as Notifications from 'expo-notifications'; // For notifications
import { Ionicons } from '@expo/vector-icons'; // For icons
import { FaLanguage } from "react-icons/fa"; // You may need to use @expo/vector-icons or similar

export default function Home() {
  const { fetchProduct, fetchCategory, fetchMedi, medicine } = useContext(Context);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const router = useRouter();
  const dispatch = useDispatch();
  // const [sound, setSound] = useState();
  const [currentReminder, setCurrentReminder] = useState(null);
  const [filteredMedicine, setFilteredMedicine] = useState([]);
  const user = useSelector(store => store.user);
  const [language, setLanguage] = useState('en');
  const [val, setVal] = useState(null);
  const [open, setOpen] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetchCategory();
    fetchProduct();
    fetchMedi();
    dispatch(dbToCart());
    // Notifications.requestPermissionsAsync();
  }, []);

  const filterMedicinesByDate = () => {
    const medicines = medicine.filter((med) => formatDate(med.date) === formatDate(selectedDate) && med?.user_id == user?.data?._id);
    setFilteredMedicine(medicines);
  };

  useEffect(() => {
    filterMedicinesByDate();
  }, [selectedDate, medicine]);

  // Reminder check logic (simplified, no sound/notification for now)
  useEffect(() => {
    const interval = setInterval(() => {
      // ...implement timer logic if needed...
    }, 3000);
    return () => clearInterval(interval);
  }, [filteredMedicine]);

  const handleTaken = (med) => {
    const id = med._id;
    axios
      .post(`http://localhost:5000/api/medi_status/${id}`)
      .then((success) => {
        if (success.data.status === 1) {
          fetchMedi();
          router.replace('/');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getNearbyDates = (createdAt) => {
    const currentDate = new Date(createdAt);
    return Array.from({ length: 5 }, (_, index) => {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + index - 2);
      return date;
    });
  };

  const dates = getNearbyDates(new Date());

  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === 'en' ? 'hi' : 'en'));
  };
  console.log("Language is");
  const text = {
    en: {
      reminderTitle: "⏰ Reminder",
      reminderMessage: "It's time to take your medicine:",
      quantity: "Quantity:",
      takenButton: "I have taken this Medicine",
      downloadPDF: "Today's Medical Report",
      scanPDF: "Scan Prescription",
      toTake: "To Take",
    },
    hi: {
      reminderTitle: "⏰ अनुस्मारक",
      reminderMessage: "यह आपकी दवा लेने का समय है:",
      quantity: "मात्रा:",
      takenButton: "मैंने यह दवा ले ली है",
      downloadPDF: "पीडीएफ डाउनलोड करें",
      scanPDF: "पीडीएफ स्कैन करें",
      toTake: "लेने के लिए",
    },
  };

  // Chatbot form handler (simplified)
  const formhandler = async () => {
    if (!val) return;
    try {
      const response = await axios.post(`http://localhost:5000/api/chat_bot/${val}`);
      setVal(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      {/* Floating Phone Button */}
      <TouchableOpacity
        style={{
          position: 'absolute', left: 160, bottom: 30, zIndex: 100, width: 100, height: 100,
          backgroundColor: 'red', borderRadius: 50, alignItems: 'center', justifyContent: 'center'
        }}
      >
        <Ionicons name="call-outline" size={48} color="white" />
      </TouchableOpacity>

      {/* Language Toggle */}
      <TouchableOpacity
        style={{
          position: 'absolute', left: 50, bottom: 80, zIndex: 100, backgroundColor: '#f3f4f6', borderRadius: 50, padding: 8
        }}
        onPress={toggleLanguage}
      >
        <Ionicons name="language-outline" size={32} color="#333" />
      </TouchableOpacity>

      {/* Doctors Banner */}
      <TouchableOpacity
        style={{ borderRadius: 16, marginTop: 12, marginBottom: 20, overflow: 'hidden', elevation: 4 }}
        onPress={() => router.push('/doctors')}
      >
        {/* <Image source={require('../assets/1.png')} style={{ width: '100%', height: 180, resizeMode: 'cover' }} /> */}
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        <Button title={text[language].downloadPDF} onPress={() => Alert.alert('PDF generation not implemented in RN')} />
        <Button title={text[language].scanPDF} onPress={() => router.push('/scan')} />
      </View>

      {/* Date Selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
        {dates.map((date, index) => (
          <TouchableOpacity
            key={index}
            style={{
              alignItems: 'center', width: 64, paddingVertical: 8, borderRadius: 12,
              backgroundColor: formatDate(date) === formatDate(selectedDate) ? '#336D82' : '#f3f4f6',
              marginRight: 8
            }}
            onPress={() => setSelectedDate(date)}
          >
            <Text style={{ color: formatDate(date) === formatDate(selectedDate) ? '#fff' : '#333' }}>
              {date.toLocaleDateString('en-US', { weekday: 'short' })}
            </Text>
            <Text style={{ fontWeight: 'bold', color: formatDate(date) === formatDate(selectedDate) ? '#fff' : '#333' }}>
              {date.getDate()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Medicine List */}
      <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 100, elevation: 2 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333' }}>{text[language].toTake}</Text>
          <TouchableOpacity onPress={() => router.push('/create_medi')}>
            <Ionicons name="add-circle-outline" size={28} color="#336D82" />
          </TouchableOpacity>
        </View>
        {filteredMedicine.map((med, index) => (
          <View key={index} style={{ backgroundColor: '#f3f4f6', borderRadius: 8, padding: 12, marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Image
                source={{ uri: `http://localhost:5000/image/medi/${med.image}` }}
                style={{ width: 64, height: 64, borderRadius: 8, marginRight: 12 }}
              />
              <View>
                <Text style={{ fontWeight: 'bold', color: '#333' }}>{med.name}</Text>
                <Text style={{ color: '#666' }}>{text[language].quantity}: {med.qty}</Text>
              </View>
              <View style={{ flex: 1 }} />
              <Text style={{ color: '#666' }}>{med.timing} | {formatDate(med.date)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              {med.isTrue ? (
                <Button title="I have Taken this medicine" color="#336D82" disabled />
              ) : (
                <Button title="Take this medicine" color="#9ACBD0" onPress={() => handleTaken(med)} />
              )}
            </View>
          </View>
        ))}
      </View>

      {/* Chatbot Floating Button */}
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={{
          position: 'absolute', bottom: 70, right: 20, backgroundColor: '#fff', padding: 16,
          borderRadius: open ? 16 : 50, width: open ? 320 : 75, height: open ? 380 : 75,
          alignItems: 'center', justifyContent: 'center', elevation: 4
        }}
      >
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{open ? 'Med-Life Chatbot' : 'Medi Bot'}</Text>
        {open && (
          <>
            <View style={{ flex: 1, marginVertical: 8 }}>
              {val ? <Text style={{ color: '#333' }}>{val}</Text> : null}
            </View>
            <TextInput
              placeholder="Enter prompt here..."
              value={val}
              onChangeText={setVal}
              style={{
                borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 8, width: '100%'
              }}
            />
            <Button title="Submit" onPress={formhandler} />
            <TouchableOpacity onPress={() => { setOpen(false); setVal(null); }} style={{ position: 'absolute', top: 8, right: 8 }}>
              <Text style={{ fontSize: 18 }}>❌</Text>
            </TouchableOpacity>
          </>
        )}
      </TouchableOpacity>

      {/* Reminder Modal */}
      <Modal visible={!!currentReminder} transparent animationType="slide">
        <View style={{
          flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center'
        }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, width: 320 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 }}>
              {text[language].reminderTitle}
            </Text>
            <Text style={{ textAlign: 'center', marginBottom: 8 }}>
              {text[language].reminderMessage} <Text style={{ fontWeight: 'bold' }}>{currentReminder?.name}</Text>
            </Text>
            <Text style={{ textAlign: 'center', marginBottom: 8 }}>
              {text[language].quantity} {currentReminder?.qty}
            </Text>
            <View style={{ alignItems: 'center', marginBottom: 12 }}>
              <Image
                source={{ uri: `http://localhost:5000/image/medi/${currentReminder?.image}` }}
                style={{ width: 128, height: 128, borderRadius: 12 }}
              />
            </View>
            <Button title={text[language].takenButton} color="#e53e3e" onPress={() => setCurrentReminder(null)} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}