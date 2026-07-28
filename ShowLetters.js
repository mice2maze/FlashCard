import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar,
  Dimensions,
  Platform
} from 'react-native';
import { Languages, Info, Volume2, BookOpen, X } from 'lucide-react-native';
import { SEION, DAKUON, YOUON } from './constants';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 5; // Default for 5 columns

export default function ShowLetters() {
  const [mode, setMode] = useState('hiragana');
  const [selectedKana, setSelectedKana] = useState(null);

  const transpose = (data) => {
    const maxCols = Math.max(...data.map(row => row.length));
    return Array.from({ length: maxCols }, (_, colIndex) =>
      data.map(row => row[colIndex] ?? null)
    );
  };

  const renderGrid = (data, columns) => {
    const transposedData = transpose(data);
    return (
      <View style={styles.grid}>
        {transposedData.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((kana, colIndex) => (
              <View 
                key={`col-${rowIndex}-${colIndex}`} 
                style={[styles.cell, { width: (width - 48) / columns }]}
              >
                {kana ? (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setSelectedKana(kana)}
                    style={[
                      styles.kanaCard,
                      selectedKana?.r === kana.r && styles.selectedCard
                    ]}
                  >
                    <Text style={styles.kanaText}>
                      {mode === 'hiragana' ? kana.h : kana.k}
                    </Text>
                    <Text style={styles.romajiText}>{kana.r}</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.emptyCard} />
                )}
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Languages size={20} color="#FFF" />
          </View>
          <View>
            <Text style={styles.headerTitle}>五十音圖表</Text>
            <Text style={styles.headerSubtitle}>Japanese Syllabary</Text>
          </View>
        </View>

        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            onPress={() => setMode('hiragana')}
            style={[styles.toggleButton, mode === 'hiragana' && styles.toggleActive]}
          >
            <Text style={[styles.toggleText, mode === 'hiragana' && styles.toggleTextActive]}>平</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setMode('katakana')}
            style={[styles.toggleButton, mode === 'katakana' && styles.toggleActive]}
          >
            <Text style={[styles.toggleText, mode === 'katakana' && styles.toggleTextActive]}>片</Text>
          </TouchableOpacity>
        </View>
      </View>
<ScrollView contentContainerStyle={styles.scrollContent} horizontal={true}>
      <ScrollView contentContainerStyle={styles.scrollContent} >
        {/* Seion */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <BookOpen size={14} color="#6366F1" />
            <Text style={styles.sectionTitle}>清音 (Seion)</Text>
            <View style={styles.sectionLine} />
          </View>
          {renderGrid(SEION, 5)} 
          {/* Note: Seion is 10 cols in web, but 5 is better for mobile portrait */}
        </View>

        {/* Dakuon */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Volume2 size={14} color="#6366F1" />
            <Text style={styles.sectionTitle}>濁音 (Dakuon)</Text>
            <View style={styles.sectionLine} />
          </View>
          {renderGrid(DAKUON, 5)}
        </View>

        {/* Youon */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={14} color="#6366F1" />
            <Text style={styles.sectionTitle}>拗音 (Youon)</Text>
            <View style={styles.sectionLine} />
          </View>
          {renderGrid(YOUON, 4)}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Designed for mobile learning.</Text>
          <Text style={styles.footerText}>Tap a character for details.</Text>
        </View>
      </ScrollView>
</ScrollView>
      {/* Detail Modal */}
      {selectedKana && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalLabel}>SELECTED CHARACTER</Text>
                <Text style={styles.modalChar}>
                  {mode === 'hiragana' ? selectedKana.h : selectedKana.k}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedKana(null)} style={styles.closeButton}>
                <X size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalStats}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>ROMAJI</Text>
                <Text style={styles.statValue}>{selectedKana.r}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>OPPOSITE</Text>
                <Text style={styles.statValue}>
                  {mode === 'hiragana' ? selectedKana.k : selectedKana.h}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
    ...Platform.select({
      ios: {
        marginTop: "10%",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      }
    }),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    backgroundColor: '#6366F1',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F1F1',
    padding: 3,
    borderRadius: 8,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  toggleActive: {
    backgroundColor: '#FFF',
    ...Platform.select({
      web: { boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
    })
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  toggleTextActive: {
    color: '#6366F1',
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#AAA',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 8,
    marginRight: 8,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#EEE',
  },
  grid: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  cell: {
    padding: 4,
  },
  kanaCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F1F1',
    ...Platform.select({
      web: { transition: 'all 0.2s ease' }
    })
  },
  selectedCard: {
    borderColor: '#6366F1',
    borderWidth: 2,
    backgroundColor: '#F5F6FF',
  },
  emptyCard: {
    height: 60,
  },
  kanaText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E1B4B',
  },
  romajiText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 4,
    textTransform: 'uppercase',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  modalOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#1E1B4B',
    borderRadius: 24,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      web: {
        boxShadow: '0 -10px 40px rgba(0,0,0,0.3)',
      }
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  modalLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#818CF8',
    letterSpacing: 1,
  },
  modalChar: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 4,
  },
  closeButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  modalStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 16,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#818CF8',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  footer: {
    marginTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#AAA',
    textAlign: 'center',
    lineHeight: 18,
  }
});
