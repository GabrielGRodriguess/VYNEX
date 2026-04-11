import React, { useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Linking, Alert, ScrollView
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function PrestadorScreen({ route }) {
  const { prestador, cidade } = route.params;

  useEffect(() => {
    // Registrar visualização
    supabase.from('prestadores')
      .update({ visualizacoes: (prestador.visualizacoes || 0) + 1 })
      .eq('id', prestador.id);
  }, []);

  async function handleWhatsApp() {
    try {
      // Registrar lead no banco
      await supabase.rpc('registrar_lead', {
        p_prestador_id: prestador.id,
        p_cidade_id: cidade.id,
      });

      // Formatar telefone (remover não numéricos)
      const tel = prestador.telefone.replace(/\D/g, '');
      const msg = encodeURIComponent(`Olá, encontrei você pelo app Guia da Cidade e gostaria de um orçamento!`);
      const url = `https://wa.me/55${tel}?text=${msg}`;

      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Erro', 'Não foi possível abrir o WhatsApp.');
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{prestador.nome.charAt(0).toUpperCase()}</Text>
          </View>
          {prestador.premium && (
            <View style={styles.badge}><Text style={styles.badgeText}>⭐ PROFISSIONAL DESTAQUE</Text></View>
          )}
          <Text style={styles.nome}>{prestador.nome}</Text>
        </View>

        {/* Descrição */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre o profissional</Text>
          <Text style={styles.descricao}>{prestador.descricao || 'Sem descrição.'}</Text>
        </View>

        {/* Estatísticas */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{prestador.cliques_whatsapp}</Text>
            <Text style={styles.statLabel}>Contatos</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{prestador.visualizacoes}</Text>
            <Text style={styles.statLabel}>Visualizações</Text>
          </View>
        </View>

        {/* Contato */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Telefone</Text>
          <Text style={styles.telefone}>📞 {prestador.telefone}</Text>
        </View>
      </ScrollView>

      {/* Botão WhatsApp fixo */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnWA} onPress={handleWhatsApp}>
          <Text style={styles.btnWAText}>💬 Chamar no WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scroll: { paddingBottom: 100 },
  header: { backgroundColor: '#1565C0', alignItems: 'center', padding: 32, paddingTop: 40 },
  avatar: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  avatarText: { fontSize: 36, fontWeight: '900', color: '#1565C0' },
  badge: {
    backgroundColor: '#FFC107', borderRadius: 20, paddingHorizontal: 14,
    paddingVertical: 4, marginBottom: 8,
  },
  badgeText: { fontSize: 11, fontWeight: '800', color: '#5D4037' },
  nome: { fontSize: 24, fontWeight: '900', color: '#fff', textAlign: 'center' },
  section: { backgroundColor: '#fff', margin: 16, borderRadius: 14, padding: 20, elevation: 2 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#888', marginBottom: 8, textTransform: 'uppercase' },
  descricao: { fontSize: 15, color: '#444', lineHeight: 24 },
  telefone: { fontSize: 18, fontWeight: '700', color: '#1565C0' },
  statsRow: { flexDirection: 'row', gap: 12, marginHorizontal: 16 },
  statBox: {
    flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 20,
    alignItems: 'center', elevation: 2,
  },
  statNum: { fontSize: 28, fontWeight: '900', color: '#1565C0' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 4 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', padding: 16, paddingBottom: 28,
    borderTopWidth: 1, borderTopColor: '#eee',
  },
  btnWA: {
    backgroundColor: '#2E7D32', borderRadius: 14, padding: 18,
    alignItems: 'center', shadowColor: '#2E7D32', shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
  },
  btnWAText: { color: '#fff', fontSize: 18, fontWeight: '900' },
});
