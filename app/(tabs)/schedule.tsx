import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { Plus, Clock, MapPin, Trash2 } from 'lucide-react-native';
import { useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddScheduleModal from '@/components/AddScheduleModal';

const SCHEDULE_STORAGE_KEY = 'schedule_data';

const initialSchedule = {
  Monday: [
    { id: 1, subject: 'Mathematics', time: '9:00 - 10:00 AM', room: 'Room 101', color: '#007AFF' },
    { id: 2, subject: 'Physics', time: '11:00 - 12:00 PM', room: 'Lab 201', color: '#34C759' },
  ],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: [],
};

export default function Schedule() {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [selectedDay, setSelectedDay] = useState('Monday');

  useEffect(() => {
    loadSchedule();
  }, []);

  useEffect(() => {
    saveSchedule();
  }, [schedule]);

  const loadSchedule = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(SCHEDULE_STORAGE_KEY);
      if (jsonValue != null) {
        setSchedule(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Failed to load schedule', e);
    }
  };

  const saveSchedule = async () => {
    try {
      const jsonValue = JSON.stringify(schedule);
      await AsyncStorage.setItem(SCHEDULE_STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Failed to save schedule', e);
    }
  };

  const handleSaveSchedule = (scheduleData) => {
    const { day } = scheduleData;
    if (editingSchedule) {
      setSchedule(prev => ({
        ...prev,
        [day]: prev[day].map(s => s.id === editingSchedule.id ? { ...s, ...scheduleData } : s)
      }));
    } else {
      const newSchedule = {
        id: Date.now(),
        color: '#007AFF',
        ...scheduleData
      };
      setSchedule(prev => ({
        ...prev,
        [day]: [...prev[day], newSchedule]
      }));
    }
    setEditingSchedule(null);
  };

  const handleDeleteSchedule = (id, day) => {
    Alert.alert('Delete Class', 'Are you sure you want to delete this class?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        setSchedule(prev => ({
          ...prev,
          [day]: prev[day].filter(s => s.id !== id)
        }));
      } }
    ]);
  };

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const daySchedule = schedule[selectedDay] || [];

  return (
    <SafeAreaView style={styles.container}>
      <AddScheduleModal 
        visible={modalVisible}
        onClose={() => { setModalVisible(false); setEditingSchedule(null); }}
        onSave={handleSaveSchedule}
        editingSchedule={editingSchedule}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={styles.title}>Schedule</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>

        {/* Week View */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.weekContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weekScroll}>
            {weekDays.map((day, index) => (
              <TouchableOpacity 
                key={day}
                style={[
                  styles.dayButton,
                  selectedDay === day && styles.activeDayButton
                ]}
                onPress={() => setSelectedDay(day)}
              >
                <Text style={[
                  styles.dayText,
                  selectedDay === day && styles.activeDayText
                ]}>
                  {day.substring(0, 3)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Today's Classes */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.todaySection}>
          <Text style={styles.sectionTitle}>{selectedDay}'s Classes</Text>
          {daySchedule.length > 0 ? (
            daySchedule.map((classItem, index) => (
              <Animated.View 
                key={classItem.id}
                entering={FadeInRight.duration(400).delay(100 * index)}
                style={styles.classCard}
              >
                <TouchableOpacity 
                  style={{flex: 1}} 
                  onPress={() => {
                    setEditingSchedule({...classItem, day: selectedDay});
                    setModalVisible(true);
                  }}
                >
                  <View style={[styles.colorIndicator, { backgroundColor: classItem.color }]} />
                  <View style={styles.classContent}>
                    <Text style={styles.subjectName}>{classItem.subject}</Text>
                    <View style={styles.classDetails}>
                      <View style={styles.detailItem}>
                        <Clock size={14} color="#8E8E93" />
                        <Text style={styles.detailText}>{classItem.time}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <MapPin size={14} color="#8E8E93" />
                        <Text style={styles.detailText}>{classItem.room}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionsButton} onPress={() => handleDeleteSchedule(classItem.id, selectedDay)}>
                  <Trash2 size={20} color="#FF3B30" />
                </TouchableOpacity>
              </Animated.View>
            ))
          ) : (
            <Animated.View entering={FadeInDown.duration(400)} style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No classes scheduled for {selectedDay}</Text>
              <Text style={styles.emptyStateSubtext}>Enjoy your free day! 🎉</Text>
            </Animated.View>
          )}
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekContainer: {
    marginBottom: 24,
  },
  weekScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  dayButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    minWidth: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activeDayButton: {
    backgroundColor: '#007AFF',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  activeDayText: {
    color: '#FFFFFF',
  },
  todaySection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  classCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  colorIndicator: {
    width: 4,
    height: 50,
    borderRadius: 2,
    marginRight: 16,
  },
  classContent: {
    flex: 1,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  classDetails: {
    gap: 6,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  optionsButton: {
    padding: 8,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#8E8E93',
  },
});