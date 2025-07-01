import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { Clock, BookOpen, AlertCircle, TrendingUp, Plus, ArrowRight, CheckCircle2 } from 'lucide-react-native';
import { useStudy } from '@/contexts/StudyContext';
import { useRouter } from 'expo-router';

export default function Home() {
  const { 
    stats, 
    getTodayClasses, 
    getUpcomingAssignments, 
    updateAssignment,
    addAssignment,
    addNote 
  } = useStudy();
  const router = useRouter();

  const todayClasses = getTodayClasses();
  const upcomingAssignments = getUpcomingAssignments(3);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#FF3B30';
      case 'medium': return '#FF9500';
      case 'low': return '#34C759';
      default: return '#8E8E93';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#34C759';
      case 'in-progress': return '#FF9500';
      case 'pending': return '#8E8E93';
      default: return '#8E8E93';
    }
  };

  const handleAssignmentPress = (assignmentId: string, currentStatus: string) => {
    const statusOrder = ['pending', 'in-progress', 'completed'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    
    updateAssignment(assignmentId, { status: nextStatus as any });
    
    if (nextStatus === 'completed') {
      Alert.alert(
        '🎉 Congratulations!',
        'Assignment completed successfully!',
        [{ text: 'Great!', style: 'default' }]
      );
    }
  };

  const handleAddNote = () => {
    Alert.alert(
      'Add New Note',
      'Choose a subject for your note:',
      [
        { text: 'Mathematics', onPress: () => createNote('Mathematics') },
        { text: 'Physics', onPress: () => createNote('Physics') },
        { text: 'Chemistry', onPress: () => createNote('Chemistry') },
        { text: 'History', onPress: () => createNote('History') },
        { text: 'English', onPress: () => createNote('English') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const createNote = (subject: string) => {
    const noteTitle = `${subject} Notes - ${new Date().toLocaleDateString()}`;
    addNote({
      title: noteTitle,
      subject: subject,
      content: `New ${subject} note created. Start typing your notes here...`,
      type: 'text'
    });
    
    Alert.alert(
      '✅ Note Created!',
      `New ${subject} note has been created successfully.`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleAddAssignment = () => {
    Alert.alert(
      'Add New Assignment',
      'Choose a subject for your assignment:',
      [
        { text: 'Mathematics', onPress: () => createAssignment('Mathematics') },
        { text: 'Physics', onPress: () => createAssignment('Physics') },
        { text: 'Chemistry', onPress: () => createAssignment('Chemistry') },
        { text: 'History', onPress: () => createAssignment('History') },
        { text: 'English', onPress: () => createAssignment('English') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const createAssignment = (subject: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    addAssignment({
      title: `${subject} Assignment`,
      subject: subject,
      dueDate: 'Tomorrow',
      dueDateTime: tomorrow,
      priority: 'medium',
      status: 'pending',
      description: `New ${subject} assignment`
    });
    
    Alert.alert(
      '✅ Assignment Added!',
      `New ${subject} assignment has been added successfully.`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning! 🌅';
    if (hour < 17) return 'Good afternoon! ☀️';
    return 'Good evening! 🌆';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.subtitle}>Ready to learn something new today?</Text>
        </Animated.View>

        {/* Quick Stats */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Clock size={24} color="#007AFF" />
            <Text style={styles.statNumber}>{stats.classesToday}</Text>
            <Text style={styles.statLabel}>Classes Today</Text>
          </View>
          <View style={styles.statCard}>
            <AlertCircle size={24} color="#FF9500" />
            <Text style={styles.statNumber}>{stats.dueSoon}</Text>
            <Text style={styles.statLabel}>Due Soon</Text>
          </View>
          <View style={styles.statCard}>
            <TrendingUp size={24} color="#34C759" />
            <Text style={styles.statNumber}>{stats.overallProgress}%</Text>
            <Text style={styles.statLabel}>Progress</Text>
          </View>
        </Animated.View>

        {/* Today's Schedule */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Schedule</Text>
            <TouchableOpacity 
              onPress={() => router.push('/schedule')}
              style={styles.seeAllButton}
            >
              <Text style={styles.seeAllText}>See All</Text>
              <ArrowRight size={14} color="#007AFF" />
            </TouchableOpacity>
          </View>
          
          {todayClasses.length > 0 ? (
            todayClasses.map((item, index) => (
              <Animated.View 
                key={item.id} 
                entering={FadeInRight.duration(400).delay(100 * index)}
                style={styles.scheduleItem}
              >
                <View style={styles.scheduleTime}>
                  <Text style={styles.timeText}>{item.time}</Text>
                  <Text style={styles.durationText}>{item.duration}</Text>
                </View>
                <View style={styles.scheduleContent}>
                  <Text style={styles.subjectText}>{item.subject}</Text>
                  {item.room && <Text style={styles.roomText}>{item.room}</Text>}
                </View>
                <View style={[styles.subjectIndicator, { backgroundColor: item.color }]} />
              </Animated.View>
            ))
          ) : (
            <Animated.View entering={FadeInDown.duration(400)} style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No classes scheduled for today</Text>
              <Text style={styles.emptyStateSubtext}>Enjoy your free day! 🎉</Text>
            </Animated.View>
          )}
        </Animated.View>

        {/* Upcoming Assignments */}
        <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Assignments</Text>
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={handleAddAssignment}
            >
              <Plus size={18} color="#007AFF" />
            </TouchableOpacity>
          </View>
          
          {upcomingAssignments.length > 0 ? (
            upcomingAssignments.map((assignment, index) => (
              <Animated.View 
                key={assignment.id}
                entering={FadeInRight.duration(400).delay(150 * index)}
                style={styles.assignmentItem}
              >
                <TouchableOpacity 
                  style={styles.assignmentContent}
                  onPress={() => handleAssignmentPress(assignment.id, assignment.status)}
                >
                  <View style={styles.assignmentLeft}>
                    <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                    <Text style={styles.assignmentSubject}>{assignment.subject}</Text>
                  </View>
                  <View style={styles.assignmentRight}>
                    <Text style={styles.dueDateText}>{assignment.dueDate}</Text>
                    <View style={styles.statusRow}>
                      <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(assignment.priority) }]} />
                      <View style={styles.statusIndicator}>
                        {assignment.status === 'completed' ? (
                          <CheckCircle2 size={16} color="#34C759" />
                        ) : (
                          <View style={[styles.statusDot, { backgroundColor: getStatusColor(assignment.status) }]} />
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))
          ) : (
            <Animated.View entering={FadeInDown.duration(400)} style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No upcoming assignments</Text>
              <Text style={styles.emptyStateSubtext}>All caught up! 🎯</Text>
            </Animated.View>
          )}
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.duration(600).delay(600)} style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleAddNote}
          >
            <BookOpen size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Add Note</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryAction]}
            onPress={handleAddAssignment}
          >
            <Plus size={24} color="#007AFF" />
            <Text style={[styles.actionButtonText, styles.secondaryActionText]}>New Task</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Study Tip */}
        <Animated.View entering={FadeInDown.duration(600).delay(700)} style={styles.tipCard}>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>💡 Study Tip</Text>
            <Text style={styles.tipText}>
              {stats.dueSoon > 0 
                ? `You have ${stats.dueSoon} assignment${stats.dueSoon > 1 ? 's' : ''} due soon. Start working on them now to avoid last-minute stress!`
                : "Great job staying on top of your assignments! Keep up the good work and maintain this momentum."
              }
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
    textAlign: 'center',
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
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
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
    minWidth: 60,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  durationText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  scheduleContent: {
    flex: 1,
  },
  subjectText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  roomText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  subjectIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#8E8E93',
  },
  assignmentItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  assignmentContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  assignmentLeft: {
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
  assignmentRight: {
    alignItems: 'flex-end',
  },
  dueDateText: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryAction: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryActionText: {
    color: '#007AFF',
  },
  tipCard: {
    marginHorizontal: 20,
    backgroundColor: '#E3F2FD',
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