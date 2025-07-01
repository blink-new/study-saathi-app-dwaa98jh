import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { Plus, Filter, Calendar, Clock, CheckCircle2, Circle, AlertCircle, Trash2, Edit2 } from 'lucide-react-native';
import { useState, useMemo, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddAssignmentModal from '@/components/AddAssignmentModal';

const STORAGE_KEY = 'assignments_data';

const initialAssignments = [
  {
    id: 1,
    title: 'Calculus Problem Set',
    subject: 'Mathematics',
    dueDate: 'Today, 11:59 PM',
    priority: 'high',
    status: 'pending',
    progress: 0,
    description: 'Complete exercises 1-15 from Chapter 4'
  },
  {
    id: 2,
    title: 'History Essay: World War II',
    subject: 'History',
    dueDate: 'Tomorrow, 3:00 PM',
    priority: 'high',
    status: 'in-progress',
    progress: 65,
    description: 'Write a 1500-word essay on the causes of WWII'
  },
  {
    id: 3,
    title: 'Chemistry Lab Report',
    subject: 'Chemistry',
    dueDate: 'Friday, 2:00 PM',
    priority: 'medium',
    status: 'pending',
    progress: 0,
    description: 'Analyze the results of the acid-base titration experiment'
  },
  {
    id: 4,
    title: 'Physics Homework',
    subject: 'Physics',
    dueDate: 'Next Monday',
    priority: 'low',
    status: 'completed',
    progress: 100,
    description: "Solve problems on Newton's laws of motion"
  },
  {
    id: 5,
    title: 'English Literature Review',
    subject: 'English',
    dueDate: 'Next Week',
    priority: 'medium',
    status: 'in-progress',
    progress: 30,
    description: 'Read and analyze "To Kill a Mockingbird" chapters 1-5'
  },
];

export default function Assignments() {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [activeFilter, setActiveFilter] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [editAssignment, setEditAssignment] = useState(null);

  useEffect(() => {
    loadAssignments();
  }, []);

  useEffect(() => {
    saveAssignments();
  }, [assignments]);

  const loadAssignments = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        setAssignments(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Failed to load assignments', e);
    }
  };

  const saveAssignments = async () => {
    try {
      const jsonValue = JSON.stringify(assignments);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Failed to save assignments', e);
    }
  };

  const filteredAssignments = useMemo(() => {
    if (activeFilter === 'All') return assignments;
    return assignments.filter(a => a.status.replace('-', ' ').toLowerCase() === activeFilter.toLowerCase());
  }, [assignments, activeFilter]);

  const stats = useMemo(() => ({
    dueSoon: assignments.filter(a => a.dueDate.includes('Today') || a.dueDate.includes('Tomorrow')).length,
    inProgress: assignments.filter(a => a.status === 'in-progress').length,
    completed: assignments.filter(a => a.status === 'completed').length,
  }), [assignments]);

  const handleStatusChange = (id: number) => {
    setAssignments(prev =>
      prev.map(assignment => {
        if (assignment.id === id) {
          let newStatus = assignment.status;
          let newProgress = assignment.progress;
          if (assignment.status === 'pending') {
            newStatus = 'in-progress';
            newProgress = 50;
          } else if (assignment.status === 'in-progress') {
            newStatus = 'completed';
            newProgress = 100;
          } else {
            newStatus = 'pending';
            newProgress = 0;
          }
          return { ...assignment, status: newStatus, progress: newProgress };
        }
        return assignment;
      })
    );
  };

  const handleAdd = (assignment) => {
    if (editAssignment) {
      // Edit existing
      setAssignments(prev => prev.map(a => a.id === editAssignment.id ? { ...a, ...assignment } : a));
      setEditAssignment(null);
    } else {
      // Add new
      const newAssignment = {
        id: Date.now(),
        status: 'pending',
        progress: 0,
        ...assignment
      };
      setAssignments(prev => [newAssignment, ...prev]);
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Assignment', 'Are you sure you want to delete this assignment?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        setAssignments(prev => prev.filter(a => a.id !== id));
      } }
    ]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#34C759';
      case 'in-progress': return '#007AFF';
      case 'pending': return '#8E8E93';
      default: return '#8E8E93';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#FF3B30';
      case 'medium': return '#FF9500';
      case 'low': return '#34C759';
      default: return '#8E8E93';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle2;
      case 'in-progress': return Clock;
      case 'pending': return Circle;
      default: return Circle;
    }
  };

  const getDueDateColor = (dueDate: string) => {
    if (dueDate.includes('Today')) return '#FF3B30';
    if (dueDate.includes('Tomorrow')) return '#FF9500';
    return '#8E8E93';
  };

  const filterTabs = ['All', 'Pending', 'In Progress', 'Completed'];

  return (
    <SafeAreaView style={styles.container}>
      <AddAssignmentModal
        visible={modalVisible}
        onClose={() => { setModalVisible(false); setEditAssignment(null); }}
        onAdd={handleAdd}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={styles.title}>Assignments</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => console.log('Filter pressed')}
            >
              <Filter size={20} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setModalVisible(true)}
            >
              <Plus size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Quick Stats */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.dueSoon}</Text>
            <Text style={styles.statLabel}>Due Soon</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.inProgress}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </Animated.View>

        {/* Filter Tabs */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.filterTabs}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
            {filterTabs.map(tab => (
              <TouchableOpacity 
                key={tab}
                style={[styles.tab, activeFilter === tab && styles.activeTab]}
                onPress={() => setActiveFilter(tab)}
              >
                <Text style={[styles.tabText, activeFilter === tab && styles.activeTabText]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Assignments List */}
        <Animated.View entering={FadeInDown.duration(600).delay(300)} style={styles.assignmentsList}>
          {filteredAssignments.map((assignment, index) => {
            const StatusIcon = getStatusIcon(assignment.status);
            return (
              <Animated.View 
                key={assignment.id}
                entering={FadeInRight.duration(400).delay(100 * index)}
                style={styles.assignmentCard}
              >
                <View style={styles.assignmentHeader}>
                  <TouchableOpacity 
                    style={styles.statusButton}
                    onPress={() => handleStatusChange(assignment.id)}
                  >
                    <StatusIcon 
                      size={20} 
                      color={getStatusColor(assignment.status)} 
                    />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.assignmentInfo}
                    onPress={() => {
                      setEditAssignment(assignment);
                      setModalVisible(true);
                    }}
                  >
                    <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                    <Text style={styles.assignmentSubject}>{assignment.subject}</Text>
                  </TouchableOpacity>
                  <View style={styles.assignmentMeta}>
                    <View style={[styles.priorityTag, { backgroundColor: getPriorityColor(assignment.priority) + '20' }]}>
                      <Text style={[styles.priorityText, { color: getPriorityColor(assignment.priority) }]}>
                        {assignment.priority.toUpperCase()}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => handleDelete(assignment.id)}>
                      <Trash2 size={20} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.assignmentDescription}>{assignment.description}</Text>

                <View style={styles.assignmentFooter}>
                  <View style={styles.dueDateContainer}>
                    <Calendar size={14} color={getDueDateColor(assignment.dueDate)} />
                    <Text style={[styles.dueDateText, { color: getDueDateColor(assignment.dueDate) }]}>
                      {assignment.dueDate}
                    </Text>
                  </View>
                  
                  {assignment.status === 'in-progress' && (
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View 
                          style={[
                            styles.progressFill, 
                            { width: `${assignment.progress}%` }
                          ]} 
                        />
                      </View>
                      <Text style={styles.progressText}>{assignment.progress}%</Text>
                    </View>
                  )}
                </View>

                {assignment.dueDate.includes('Today') && (
                  <View style={styles.urgentBanner}>
                    <AlertCircle size={14} color="#FF3B30" />
                    <Text style={styles.urgentText}>Due today!</Text>
                  </View>
                )}
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  filterTabs: {
    marginBottom: 20,
  },
  tabsScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  activeTab: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  assignmentsList: {
    paddingHorizontal: 20,
  },
  assignmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  assignmentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  statusButton: {
    marginRight: 12,
    marginTop: 2,
  },
  assignmentInfo: {
    flex: 1,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  assignmentSubject: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  assignmentMeta: {
    alignItems: 'flex-end',
  },
  priorityTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
  },
  assignmentDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 16,
  },
  assignmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dueDateText: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    width: 60,
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#007AFF',
  },
  urgentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
  },
  urgentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF3B30',
  },
  quickAddSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  quickAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    borderStyle: 'dashed',
  },
  quickAddText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
  },
});