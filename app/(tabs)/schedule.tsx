import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { Plus, Clock, MapPin } from 'lucide-react-native';

export default function Schedule() {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const currentDay = 2; // Wednesday

  const schedule = {
    Monday: [
      { id: 1, subject: 'Mathematics', time: '9:00 - 10:00 AM', room: 'Room 101', color: '#007AFF' },
      { id: 2, subject: 'Physics', time: '11:00 - 12:00 PM', room: 'Lab 201', color: '#34C759' },
      { id: 3, subject: 'English', time: '2:00 - 3:00 PM', room: 'Room 205', color: '#FF9500' },
    ],
    Tuesday: [
      { id: 4, subject: 'Chemistry', time: '9:00 - 10:00 AM', room: 'Lab 301', color: '#FF3B30' },
      { id: 5, subject: 'History', time: '10:30 - 11:30 AM', room: 'Room 102', color: '#AF52DE' },
      { id: 6, subject: 'Mathematics', time: '1:00 - 2:00 PM', room: 'Room 101', color: '#007AFF' },
    ],
    Wednesday: [
      { id: 7, subject: 'English', time: '9:00 - 10:00 AM', room: 'Room 205', color: '#FF9500' },
      { id: 8, subject: 'Physics', time: '11:00 - 12:00 PM', room: 'Lab 201', color: '#34C759' },
      { id: 9, subject: 'Biology', time: '2:00 - 3:00 PM', room: 'Lab 401', color: '#00C7BE' },
    ],
    Thursday: [
      { id: 10, subject: 'Mathematics', time: '9:00 - 10:00 AM', room: 'Room 101', color: '#007AFF' },
      { id: 11, subject: 'Chemistry', time: '10:30 - 11:30 AM', room: 'Lab 301', color: '#FF3B30' },
      { id: 12, subject: 'History', time: '1:00 - 2:00 PM', room: 'Room 102', color: '#AF52DE' },
    ],
    Friday: [
      { id: 13, subject: 'Biology', time: '9:00 - 10:00 AM', room: 'Lab 401', color: '#00C7BE' },
      { id: 14, subject: 'English', time: '11:00 - 12:00 PM', room: 'Room 205', color: '#FF9500' },
      { id: 15, subject: 'Study Hall', time: '2:00 - 3:00 PM', room: 'Library', color: '#8E8E93' },
    ],
    Saturday: [],
    Sunday: [],
  };

  const selectedDay = weekDays[currentDay];
  const daySchedule = schedule[selectedDay + 'day'] || schedule[Object.keys(schedule)[currentDay]];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={styles.title}>Schedule</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => console.log('Add class pressed')}
          >
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
                  index === currentDay && styles.activeDayButton
                ]}
                onPress={() => console.log('Day selected:', day)}
              >
                <Text style={[
                  styles.dayText,
                  index === currentDay && styles.activeDayText
                ]}>
                  {day}
                </Text>
                <Text style={[
                  styles.dateText,
                  index === currentDay && styles.activeDateText
                ]}>
                  {15 + index}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Today's Classes */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.todaySection}>
          <Text style={styles.sectionTitle}>Today's Classes</Text>
          {daySchedule && daySchedule.length > 0 ? (
            daySchedule.map((classItem, index) => (
              <Animated.View 
                key={classItem.id}
                entering={FadeInRight.duration(400).delay(100 * index)}
                style={styles.classCard}
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
                <TouchableOpacity 
                  style={styles.optionsButton}
                  onPress={() => console.log('Class options pressed:', classItem.subject)}
                >
                  <View style={styles.optionsDot} />
                  <View style={styles.optionsDot} />
                  <View style={styles.optionsDot} />
                </TouchableOpacity>
              </Animated.View>
            ))
          ) : (
            <Animated.View entering={FadeInDown.duration(400)} style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No classes scheduled for today</Text>
              <Text style={styles.emptyStateSubtext}>Enjoy your free day! 🎉</Text>
            </Animated.View>
          )}
        </Animated.View>

        {/* Study Time Suggestion */}
        <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.suggestionCard}>
          <View style={styles.suggestionContent}>
            <Text style={styles.suggestionTitle}>💡 Study Tip</Text>
            <Text style={styles.suggestionText}>
              You have a 1-hour gap between Physics and Biology. Perfect time for a quick revision!
            </Text>
          </View>
        </Animated.View>

        {/* Quick Add Section */}
        <Animated.View entering={FadeInDown.duration(600).delay(500)} style={styles.quickAddSection}>
          <TouchableOpacity 
            style={styles.quickAddButton}
            onPress={() => console.log('Add new class pressed')}
          >
            <Plus size={24} color="#007AFF" />
            <Text style={styles.quickAddText}>Add New Class</Text>
          </TouchableOpacity>
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
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    marginBottom: 4,
  },
  activeDayText: {
    color: '#FFFFFF',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  activeDateText: {
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
    alignItems: 'center',
    gap: 2,
  },
  optionsDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#8E8E93',
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
  suggestionCard: {
    marginHorizontal: 20,
    backgroundColor: '#E3F2FD',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  suggestionContent: {
    gap: 8,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  suggestionText: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
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