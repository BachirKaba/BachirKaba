import React, { useState } from 'react';
import { SafeAreaView, Text, View, TextInput, Button, StyleSheet } from 'react-native';

type Role = 'RIDER' | 'DRIVER';

export default function App() {
  const [role, setRole] = useState<Role>('RIDER');
  const [phone, setPhone] = useState('+224620000001');
  const [status, setStatus] = useState('Login');

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Moto Taxi Guinea MVP</Text>
      <View style={styles.row}>
        <Button title="Rider" onPress={() => setRole('RIDER')} />
        <Button title="Driver" onPress={() => setRole('DRIVER')} />
      </View>
      <TextInput value={phone} onChangeText={setPhone} style={styles.input} />
      <Button title="Request OTP (mock)" onPress={() => setStatus(`OTP sent to ${phone} as ${role}`)} />
      {role === 'RIDER' ? (
        <>
          <Text style={styles.section}>Rider screens included:</Text>
          <Text>Login • Home(Map) • SetPickupDropoff • FareConfirm • Searching • TripActive • TripReceipt • Profile</Text>
        </>
      ) : (
        <>
          <Text style={styles.section}>Driver screens included:</Text>
          <Text>Login • DriverHome • IncomingRequest • NavigateToPickup • TripControls • Earnings • Profile</Text>
        </>
      )}
      <Text style={styles.status}>{status}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  title: { fontSize: 24, fontWeight: '700' },
  row: { flexDirection: 'row', gap: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12 },
  section: { marginTop: 16, fontWeight: '600' },
  status: { marginTop: 16, color: '#065f46' }
});
