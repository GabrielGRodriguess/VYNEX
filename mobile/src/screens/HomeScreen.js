import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, TextInput, ActivityIndicator
} from 'react-native';
import { supabase } from '../lib/supabase';

const ICONS = {
  'Eletricista': '⚡', 'Encanador': '🔧', 'Pedreiro': '🏗️',
  'Pintor': '🎨', 'Diarista': '🧹', 'Mecânico': '🔩',
  'Chaveiro': '🔑', 'Jardineiro': '🌿', 'Desentupidora': '🚿',
  'Assistência Técnica': '🛠️',
};

export default function HomeScreen({ route, navigation }) {
  const { cidade } = route.params;
  const [categorias, setCategorias] = useState([]);
  const [busca, setBusca] = useState('');
  const [destaques, setDestaques] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({ title: `📍 ${cidade.nome}` });
    
    // Buscar categorias e destaques em paralelo
    Promise.all([
      supabase.from('categorias').select('*').order('nome'),
      supabase.from('prestadores')
        .select('*, categoria:categorias(nome)')
        .eq('cidade_id', cidade.id)
        .eq('premium', true)
        .eq('ativo', true)
        .limit(5)
    ]).then(([resCat, resDest]) => {
      setCategorias(resCat.data || []);
      setDestaques(resDest.data || []);
      setLoading(false);
    });
  }, []);

  const filtradas = categorias.filter(c => c.nome.toLowerCase().includes(busca.toLowerCase()));

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#1565C0" />;

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder="🔍  Buscar serviço..."
          value={busca}
          onChangeText={setBusca}
          placeholderTextColor="#999"
        />
      </View>

      {/* Carrossel de Destaques VIP */}
      {destaques.length > 0 && busca === '' && (
        <View style={styles.destaquesContainer}>
          <Text style={styles.sectionTitle}>⭐ Em Destaque</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={destaques}
            keyExtractor={item => String(item.id)}
            contentContainerStyle={styles.destaquesList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.destaqueCard}
                onPress={() => navigation.navigate('Prestador', { prestador: item, cidade })}
              >
                <View style={styles.destaqueBadge}><Text style={styles.destaqueBadgeText}>PREMIUM</Text></View>
                <Text style={styles.destaqueNome} numberOfLines={1}>{item.nome}</Text>
                <Text style={styles.destaqueCategoria}>{item.categoria?.nome || 'Profissional'}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <Text style={styles.sectionTitle}>Conte com a nossa rede</Text>
      <FlatList
        data={filtradas}
        keyExtractor={item => String(item.id)}
        numColumns={2}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Prestadores', { cidade, categoria: item })}
          >
            <Text style={styles.cardIcon}>{ICONS[item.nome] || '🔧'}</Text>
            <Text style={styles.cardText}>{item.nome}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA', minHeight: '100vh' },
  searchBox: { padding: 16, backgroundColor: '#1565C0' },
  input: {
    backgroundColor: '#fff', borderRadius: 10, padding: 14,
    fontSize: 15, color: '#333',
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#555', padding: 16, paddingBottom: 8 },
  grid: { paddingHorizontal: 8, paddingBottom: 24 },
  card: {
    flex: 1, margin: 8, backgroundColor: '#fff', borderRadius: 16,
    padding: 20, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
    minHeight: 110,
  },
  cardIcon: { fontSize: 36, marginBottom: 8 },
  cardText: { fontSize: 13, fontWeight: '700', color: '#1A237E', textAlign: 'center' },
  destaquesContainer: { paddingTop: 12 },
  destaquesList: { paddingHorizontal: 16, paddingBottom: 12 },
  destaqueCard: {
    backgroundColor: '#303F9F',
    borderRadius: 14,
    padding: 16,
    marginRight: 12,
    width: 220,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, elevation: 5,
  },
  destaqueBadge: {
    backgroundColor: '#FFC107', borderRadius: 4, alignSelf: 'flex-start',
    paddingHorizontal: 6, paddingVertical: 2, marginBottom: 8,
  },
  destaqueBadgeText: { fontSize: 10, fontWeight: '800', color: '#3E2723' },
  destaqueNome: { fontSize: 16, fontWeight: '700', color: '#FFF', marginBottom: 4 },
  destaqueCategoria: { fontSize: 12, color: '#C5CAE9' },
});
