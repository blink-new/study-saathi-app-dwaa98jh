import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { Plus, Search, BookOpen, FileText, Image, Video, Filter } from 'lucide-react-native';

export default function Notes() {
  const subjects = [
    { id: 1, name: 'Mathematics', color: '#007AFF', noteCount: 15, lastUpdated: '2 hours ago' },
    { id: 2, name: 'Physics', color: '#34C759', noteCount: 12, lastUpdated: '1 day ago' },
    { id: 3, name: 'Chemistry', color: '#FF3B30', noteCount: 8, lastUpdated: '3 hours ago' },
    { id: 4, name: 'History', color: '#AF52DE', noteCount: 10, lastUpdated: '2 days ago' },
    { id: 5, name: 'English', color: '#FF9500', noteCount: 6, lastUpdated: '5 hours ago' },
    { id: 6, name: 'Biology', color: '#00C7BE', noteCount: 9, lastUpdated: '1 day ago' },
  ];

  const recentNotes = [
    {
      id: 1,
      title: 'Quadratic Equations - Chapter 4',
      subject: 'Mathematics',
      type: 'text',
      preview: 'A quadratic equation is a polynomial equation of degree 2. The general form is ax² + bx + c = 0...',
      lastModified: '2 hours ago',
      color: '#007AFF'
    },
    {
      id: 2,
      title: 'Newton\'s Laws of Motion',
      subject: 'Physics',
      type: 'text',
      preview: 'First Law: An object at rest stays at rest and an object in motion stays in motion...',
      lastModified: '1 day ago',
      color: '#34C759'
    },
    {
      id: 3,
      title: 'Periodic Table Elements',
      subject: 'Chemistry',
      type: 'image',
      preview: 'Periodic table diagram with electron configurations',
      lastModified: '3 hours ago',
      color: '#FF3B30'
    },
    {
      id: 4,
      title: 'World War II Timeline',
      subject: 'History',
      type: 'text',
      preview: '1939-1945: Major events and turning points of the Second World War...',
      lastModified: '2 days ago',
      color: '#AF52DE'
    },
  ];

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
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={styles.title}>Notes</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => console.log('Filter notes pressed')}
            >
              <Filter size={20} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => console.log('Add note pressed')}
            >
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
            />
          </View>
        </Animated.View>

        {/* Subjects Grid */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.section}>
          <Text style={styles.sectionTitle}>Subjects</Text>
          <View style={styles.subjectsGrid}>
            {subjects.map((subject, index) => (
              <Animated.View 
                key={subject.id}
                entering={FadeInRight.duration(400).delay(50 * index)}
                style={styles.subjectCard}
              >
                <TouchableOpacity 
                  style={styles.subjectButton}
                  onPress={() => console.log('Subject pressed:', subject.name)}
                >
                  <View style={[styles.subjectIcon, { backgroundColor: subject.color }]}>
                    <BookOpen size={24} color="#FFFFFF" />
                  </View>
                  <Text style={styles.subjectName}>{subject.name}</Text>
                  <View style={styles.subjectMeta}>
                    <Text style={styles.noteCount}>{subject.noteCount} notes</Text>
                    <Text style={styles.lastUpdated}>{subject.lastUpdated}</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Recent Notes */}
        <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Notes</Text>
            <TouchableOpacity 
              onPress={() => console.log('See all notes pressed')}
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {recentNotes.map((note, index) => {
            const TypeIcon = getTypeIcon(note.type);
            return (
              <Animated.View 
                key={note.id}
                entering={FadeInRight.duration(400).delay(100 * index)}
                style={styles.noteCard}
              >
                <TouchableOpacity 
                  style={styles.noteContent}
                  onPress={() => console.log('Note pressed:', note.title)}
                >
                  <View style={styles.noteHeader}>
                    <View style={[styles.noteTypeIcon, { backgroundColor: note.color + '20' }]}>
                      <TypeIcon size={16} color={note.color} />
                    </View>
                    <View style={styles.noteInfo}>
                      <Text style={styles.noteTitle}>{note.title}</Text>
                      <Text style={styles.noteSubject}>{note.subject}</Text>
                    </View>
                    <Text style={styles.noteTime}>{note.lastModified}</Text>
                  </View>
                  <Text style={styles.notePreview} numberOfLines={2}>
                    {note.preview}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.duration(600).delay(600)} style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => console.log('Text note pressed')}
          >
            <View style={styles.actionIcon}>
              <FileText size={24} color="#007AFF" />
            </View>
            <Text style={styles.actionTitle}>Text Note</Text>
            <Text style={styles.actionSubtitle}>Create a new text note</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => console.log('Photo note pressed')}
          >
            <View style={styles.actionIcon}>
              <Image size={24} color="#34C759" />
            </View>
            <Text style={styles.actionTitle}>Photo Note</Text>
            <Text style={styles.actionSubtitle}>Capture or upload image</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Study Tips */}
        <Animated.View entering={FadeInDown.duration(600).delay(700)} style={styles.tipCard}>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>💡 Study Tip</Text>
            <Text style={styles.tipText}>
              Organize your notes by color-coding subjects. This helps with quick visual recognition and better retention!
            </Text>
          </View>
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
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
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
  lastUpdated: {
    fontSize: 12,
    color: '#8E8E93',
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
  noteTime: {
    fontSize: 12,
    color: '#8E8E93',
  },
  notePreview: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  actionCard: {
    flex: 1,
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
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  tipCard: {
    marginHorizontal: 20,
    backgroundColor: '#E8F5E8',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  tipContent: {
    gap: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  tipText: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
});