import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, TextInput
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function PrestadoresScreen({ route, navigation }) {
  const { cidade, categoria } = route.params;
  const [prestadores, setPrestadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    navigation.setOptions({ title: categoria.nome });
    supabase
      .from('prestadores')
      .select('*')
      .eq('cidade_id', cidade.id)
      .eq('categoria_id', categoria.id)
      .eq('ativo', true)
      .order('premium', { ascending: false })
      .order('cliques_whatsapp', { ascending: false })
      .then(({ data }) => {
        setPrestadores(data || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#1565C0" />;

  const prestadoresFiltrados = prestadores.filter(p => 
    p.nome.toLowerCase().includes(busca.toLowerCase()) || 
    (p.descricao && p.descricao.toLowerCase().includes(busca.toLowerCase()))
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerBusca}>
        <Text style={styles.buscaIcone}>🔍</Text>
        <TextInput
          style={styles.inputBusca}
          placeholder="Buscar profissional ou serviço..."
          placeholderTextColor="#888"
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      {prestadoresFiltrados.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyText}>Nenhum profissional cadastrado</Text>
          <Text style={styles.emptySubtext}>ainda em {cidade.nome} para {categoria.nome}</Text>
        </View>
      ) : (
        <FlatList
          data={prestadoresFiltrados}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, item.premium && styles.cardPremium]}
              onPress={() => navigation.navigate('Prestador', { prestador: item, cidade })}
            >
              {item.premium && <View style={styles.badge}><Text style={styles.badgeText}>⭐ DESTAQUE</Text></View>}
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.descricao} numberOfLines={2}>{item.descricao}</Text>
              <View style={styles.stats}>
                <Text style={styles.stat}>📞 {item.cliques_whatsapp} contatos</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA', minHeight: '100vh' },
  headerBusca: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  buscaIcone: { fontSize: 18, marginRight: 8 },
  inputBusca: { flex: 1, paddingVertical: 12, fontSize: 16, color: '#333' },
  list: { padding: 16 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 14,
    shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
    borderLeftWidth: 4, borderLeftColor: '#E0E0E0',
  },
  cardPremium: { borderLeftColor: '#FFC107', backgroundColor: '#FFFDE7' },
  badge: {
    backgroundColor: '#FFC107', borderRadius: 6, paddingHorizontal: 10,
    paddingVertical: 3, alignSelf: 'flex-start', marginBottom: 8,
  },
  badgeText: { fontSize: 11, fontWeight: '800', color: '#5D4037' },
  nome: { fontSize: 18, fontWeight: '800', color: '#1A237E', marginBottom: 6 },
  descricao: { fontSize: 14, color: '#555', lineHeight: 20 },
  stats: { flexDirection: 'row', marginTop: 10 },
  stat: { fontSize: 12, color: '#888', marginRight: 16 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: '700', color: '#333', textAlign: 'center' },
  emptySubtext: { fontSize: 14, color: '#888', textAlign: 'center', marginTop: 4 },
});
