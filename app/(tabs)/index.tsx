import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { Clock, BookOpen, AlertCircle, TrendingUp, Plus } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const ASSIGNMENTS_STORAGE_KEY = 'assignments_data';
const SCHEDULE_STORAGE_KEY = 'schedule_data';
const NOTES_STORAGE_KEY = 'notes_data';

export default function Home() {
  const [assignments, setAssignments] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [notes, setNotes] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadAllData();
    }
  }, [isFocused]);

  const loadAllData = async () => {
    try {
      const assignmentsJson = await AsyncStorage.getItem(ASSIGNMENTS_STORAGE_KEY);
      if (assignmentsJson) setAssignments(JSON.parse(assignmentsJson));

      const scheduleJson = await AsyncStorage.getItem(SCHEDULE_STORAGE_KEY);
      if (scheduleJson) setSchedule(JSON.parse(scheduleJson));

      const notesJson = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
      if (notesJson) setNotes(JSON.parse(notesJson));
    } catch (e) {
      console.error('Failed to load data for home screen', e);
    }
  };

  const today = new Date().toLocaleString('en-us', {  weekday: 'long' });
  const todaySchedule = schedule[today] || [];
  const upcomingAssignments = assignments.filter(a => a.status !== 'completed').slice(0, 3);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#FF3B30';
      case 'medium': return '#FF9500';
      case 'low': return '#34C759';
      default: return '#8E8E93';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={styles.greeting}>Good morning! 👋</Text>
          <Text style={styles.subtitle}>Ready to learn something new today?</Text>
        </Animated.View>

        {/* Quick Stats */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Clock size={24} color="#007AFF" />
            <Text style={styles.statNumber}>{todaySchedule.length}</Text>
            <Text style={styles.statLabel}>Classes Today</Text>
          </View>
          <View style={styles.statCard}>
            <AlertCircle size={24} color="#FF9500" />
            <Text style={styles.statNumber}>{assignments.filter(a => a.status !== 'completed').length}</Text>
            <Text style={styles.statLabel}>Pending Tasks</Text>
          </View>
          <View style={styles.statCard}>
            <BookOpen size={24} color="#34C759" />
            <Text style={styles.statNumber}>{notes.length}</Text>
            <Text style={styles.statLabel}>Total Notes</Text>
          </View>
        </Animated.View>

        {/* Today's Schedule */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Schedule</Text>
          </View>
          {todaySchedule.length > 0 ? todaySchedule.map((item, index) => (
            <Animated.View 
              key={item.id} 
              entering={FadeInRight.duration(400).delay(100 * index)}
              style={styles.scheduleItem}
            >
              <View style={styles.scheduleTime}>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
              <View style={styles.scheduleContent}>
                <Text style={styles.subjectText}>{item.subject}</Text>
              </View>
              <View style={[styles.subjectIndicator, { backgroundColor: item.color }]} />
            </Animated.View>
          )) : <Text style={styles.emptyText}>No classes today. Enjoy your day!</Text>}
        </Animated.View>

        {/* Upcoming Assignments */}
        <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Assignments</Text>
          </View>
          {upcomingAssignments.length > 0 ? upcomingAssignments.map((assignment, index) => (
            <Animated.View 
              key={assignment.id}
              entering={FadeInRight.duration(400).delay(150 * index)}
              style={styles.assignmentItem}
            >
              <View style={styles.assignmentContent}>
                <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                <Text style={styles.assignmentSubject}>{assignment.subject}</Text>
              </View>
              <View style={styles.assignmentMeta}>
                <Text style={styles.dueDateText}>{assignment.dueDate}</Text>
                <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(assignment.priority) }]} />
              </View>
            </Animated.View>
          )) : <Text style={styles.emptyText}>No upcoming assignments. You're all caught up!</Text>}
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
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '400',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
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
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
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
  scheduleItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  scheduleTime: {
    marginRight: 16,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  scheduleContent: {
    flex: 1,
  },
  subjectText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  subjectIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  assignmentItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  assignmentContent: {
    flex: 1,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  assignmentSubject: {
    fontSize: 14,
    color: '#8E8E93',
  },
  assignmentMeta: {
    alignItems: 'flex-end',
  },
  dueDateText: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 8,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyText: {
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 10,
  }
});