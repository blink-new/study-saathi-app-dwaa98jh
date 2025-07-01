import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { Plus, Search, BookOpen, FileText, Image, Video, Filter, Trash2 } from 'lucide-react-native';
import { useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddNoteModal from '@/components/AddNoteModal';

const NOTES_STORAGE_KEY = 'notes_data';

const initialNotes = [
  {
    id: 1,
    title: 'Quadratic Equations - Chapter 4',
    subject: 'Mathematics',
    type: 'text',
    content: 'A quadratic equation is a polynomial equation of degree 2. The general form is ax² + bx + c = 0...',
    lastModified: '2 hours ago',
    color: '#007AFF'
  },
  {
    id: 2,
    title: 'Newton\'s Laws of Motion',
    subject: 'Physics',
    type: 'text',
    content: 'First Law: An object at rest stays at rest and an object in motion stays in motion...',
    lastModified: '1 day ago',
    color: '#34C759'
  },
];

export default function Notes() {
  const [notes, setNotes] = useState(initialNotes);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    saveNotes();
  }, [notes]);

  const loadNotes = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
      if (jsonValue != null) {
        setNotes(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Failed to load notes', e);
    }
  };

  const saveNotes = async () => {
    try {
      const jsonValue = JSON.stringify(notes);
      await AsyncStorage.setItem(NOTES_STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Failed to save notes', e);
    }
  };

  const handleSaveNote = (noteData) => {
    if (editingNote) {
      setNotes(prev => prev.map(n => n.id === editingNote.id ? { ...n, ...noteData, lastModified: 'Just now' } : n));
    } else {
      const newNote = {
        id: Date.now(),
        type: 'text',
        ...noteData,
        lastModified: 'Just now',
        color: '#007AFF' // Default color for new notes
      };
      setNotes(prev => [newNote, ...prev]);
    }
    setEditingNote(null);
  };

  const handleDeleteNote = (id) => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        setNotes(prev => prev.filter(n => n.id !== id));
      } }
    ]);
  };

  const filteredNotes = useMemo(() => {
    return notes.filter(note => 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [notes, searchQuery]);

  const subjects = useMemo(() => {
    const subjectMap = new Map();
    notes.forEach(note => {
      if (!subjectMap.has(note.subject)) {
        subjectMap.set(note.subject, { name: note.subject, noteCount: 0, color: note.color || '#8E8E93' });
      }
      subjectMap.get(note.subject).noteCount++;
    });
    return Array.from(subjectMap.values());
  }, [notes]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return FileText;
      case 'image': return Image;
      case 'video': return Video;
      default: return FileText;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AddNoteModal 
        visible={modalVisible} 
        onClose={() => { setModalVisible(false); setEditingNote(null); }} 
        onSave={handleSaveNote}
        editingNote={editingNote}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={styles.title}>Notes</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={20} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
              <Plus size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Search Bar */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={18} color="#8E8E93" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search notes..."
              placeholderTextColor="#8E8E93"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </Animated.View>

        {/* Subjects Grid */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.section}>
          <Text style={styles.sectionTitle}>Subjects</Text>
          <View style={styles.subjectsGrid}>
            {subjects.map((subject, index) => (
              <Animated.View 
                key={index}
                entering={FadeInRight.duration(400).delay(50 * index)}
                style={styles.subjectCard}
              >
                <TouchableOpacity style={styles.subjectButton}>
                  <View style={[styles.subjectIcon, { backgroundColor: subject.color }]}>
                    <BookOpen size={24} color="#FFFFFF" />
                  </View>
                  <Text style={styles.subjectName}>{subject.name}</Text>
                  <View style={styles.subjectMeta}>
                    <Text style={styles.noteCount}>{subject.noteCount} notes</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Recent Notes */}
        <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Notes</Text>
          </View>
          {filteredNotes.map((note, index) => {
            const TypeIcon = getTypeIcon(note.type);
            return (
              <Animated.View 
                key={note.id}
                entering={FadeInRight.duration(400).delay(100 * index)}
                style={styles.noteCard}
              >
                <TouchableOpacity 
                  style={styles.noteContent}
                  onPress={() => {
                    setEditingNote(note);
                    setModalVisible(true);
                  }}
                >
                  <View style={styles.noteHeader}>
                    <View style={[styles.noteTypeIcon, { backgroundColor: note.color + '20' }]}>
                      <TypeIcon size={16} color={note.color} />
                    </View>
                    <View style={styles.noteInfo}>
                      <Text style={styles.noteTitle}>{note.title}</Text>
                      <Text style={styles.noteSubject}>{note.subject}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteNote(note.id)} style={{ padding: 4 }}>
                      <Trash2 size={18} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.notePreview} numberOfLines={2}>
                    {note.content}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  subjectCard: {
    width: '48%',
  },
  subjectButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  subjectIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
    textAlign: 'center',
  },
  subjectMeta: {
    alignItems: 'center',
  },
  noteCount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
    marginBottom: 4,
  },
  noteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  noteContent: {
    padding: 16,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  noteTypeIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  noteInfo: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  noteSubject: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  notePreview: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
});