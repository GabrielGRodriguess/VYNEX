import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function CidadeScreen({ navigation }) {
  const [cidades, setCidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCidades() {
      const { data } = await supabase
        .from('cidades')
        .select('*')
        .eq('ativo', true)
        .order('nome');
      setCidades(data || []);
      setLoading(false);
    }
    fetchCidades();
  }, []);

  if (loading) return <ActivityIndicator style={styles.loading} size="large" color="#1565C0" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>📍 Guia da Cidade</Text>
        <Text style={styles.subtitle}>Selecione sua cidade</Text>
      </View>
      <FlatList
        data={cidades}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Home', { cidade: item })}
          >
            <Text style={styles.cardText}>📍 {item.nome}</Text>
            <Text style={styles.cardEstado}>{item.estado}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA', minHeight: '100vh' },
  loading: { flex: 1, justifyContent: 'center' },
  header: {
    backgroundColor: '#1565C0',
    padding: 32,
    alignItems: 'center',
    paddingTop: 48,
  },
  logo: { fontSize: 28, fontWeight: '900', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)' },
  list: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardText: { fontSize: 18, fontWeight: '700', color: '#1A237E' },
  cardEstado: { fontSize: 14, color: '#666', fontWeight: '600' },
});
