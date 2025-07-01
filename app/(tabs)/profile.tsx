import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { 
  User, 
  Settings, 
  Bell, 
  BookOpen, 
  Trophy, 
  Target, 
  Calendar, 
  Clock,
  ChevronRight,
  HelpCircle,
  Shield,
  Moon,
  Smartphone
} from 'lucide-react-native';

export default function Profile() {
  const stats = [
    { label: 'Total Notes', value: '68', icon: BookOpen, color: '#007AFF' },
    { label: 'Completed Tasks', value: '24', icon: Trophy, color: '#34C759' },
    { label: 'Study Hours', value: '156', icon: Clock, color: '#FF9500' },
    { label: 'Current Streak', value: '7 days', icon: Target, color: '#AF52DE' },
  ];

  const achievements = [
    { id: 1, title: 'Early Bird', description: 'Studied before 8 AM for 7 days', icon: '🐦', earned: true },
    { id: 2, title: 'Note Master', description: 'Created 50+ notes', icon: '📝', earned: true },
    { id: 3, title: 'Consistent Learner', description: 'Study 7 days in a row', icon: '🔥', earned: true },
    { id: 4, title: 'Subject Expert', description: 'Complete all Math assignments', icon: '🎯', earned: false },
  ];

  const menuItems = [
    { id: 1, title: 'Notifications', icon: Bell, color: '#FF9500', hasToggle: true },
    { id: 2, title: 'Study Reminders', icon: Calendar, color: '#007AFF', hasToggle: true },
    { id: 3, title: 'Dark Mode', icon: Moon, color: '#8E8E93', hasToggle: true },
    { id: 4, title: 'Privacy & Security', icon: Shield, color: '#34C759', hasToggle: false },
    { id: 5, title: 'Help & Support', icon: HelpCircle, color: '#AF52DE', hasToggle: false },
    { id: 6, title: 'About App', icon: Smartphone, color: '#00C7BE', hasToggle: false },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => console.log('Settings pressed')}
          >
            <Settings size={20} color="#007AFF" />
          </TouchableOpacity>
        </Animated.View>

        {/* Profile Info */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.profileSection}>
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <User size={32} color="#FFFFFF" />
              </View>
              <View style={styles.onlineIndicator} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Priya Sharma</Text>
              <Text style={styles.profileClass}>Class 12, Science Stream</Text>
              <Text style={styles.profileSchool}>Delhi Public School</Text>
            </View>
          </View>
        </Animated.View>

        {/* Stats Grid */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Animated.View 
                  key={stat.label}
                  entering={FadeInRight.duration(400).delay(50 * index)}
                  style={styles.statCard}
                >
                  <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                    <IconComponent size={20} color="#FFFFFF" />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>

        {/* Achievements */}
        <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.achievementsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <TouchableOpacity onPress={() => console.log('See all achievements pressed')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.achievementsScroll}>
            {achievements.map((achievement, index) => (
              <Animated.View 
                key={achievement.id}
                entering={FadeInRight.duration(400).delay(100 * index)}
                style={[
                  styles.achievementCard,
                  !achievement.earned && styles.achievementCardLocked
                ]}
              >
                <TouchableOpacity onPress={() => console.log('Achievement pressed:', achievement.title)}>
                  <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                  <Text style={[
                    styles.achievementTitle,
                    !achievement.earned && styles.achievementTitleLocked
                  ]}>
                    {achievement.title}
                  </Text>
                  <Text style={[
                    styles.achievementDescription,
                    !achievement.earned && styles.achievementDescriptionLocked
                  ]}>
                    {achievement.description}
                  </Text>
                </TouchableOpacity>
                {achievement.earned && (
                  <View style={styles.earnedBadge}>
                    <Trophy size={12} color="#FFD700" />
                  </View>
                )}
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Settings Menu */}
        <Animated.View entering={FadeInDown.duration(600).delay(600)} style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Animated.View 
                key={item.id}
                entering={FadeInRight.duration(400).delay(50 * index)}
                style={styles.menuItem}
              >
                <TouchableOpacity 
                  style={styles.menuButton}
                  onPress={() => console.log('Menu item pressed:', item.title)}
                >
                  <View style={styles.menuLeft}>
                    <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                      <IconComponent size={18} color={item.color} />
                    </View>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                  </View>
                  <View style={styles.menuRight}>
                    {item.hasToggle ? (
                      <TouchableOpacity 
                        style={styles.toggle}
                        onPress={() => console.log('Toggle pressed:', item.title)}
                      >
                        <View style={styles.toggleThumb} />
                      </TouchableOpacity>
                    ) : (
                      <ChevronRight size={18} color="#8E8E93" />
                    )}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </Animated.View>

        {/* Study Quote */}
        <Animated.View entering={FadeInDown.duration(600).delay(800)} style={styles.quoteCard}>
          <Text style={styles.quoteText}>
            "The beautiful thing about learning is that no one can take it away from you."
          </Text>
          <Text style={styles.quoteAuthor}>- B.B. King</Text>
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
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#34C759',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  profileClass: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
    marginBottom: 2,
  },
  profileSchool: {
    fontSize: 14,
    color: '#8E8E93',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
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
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
    textAlign: 'center',
  },
  achievementsSection: {
    marginBottom: 28,
  },
  achievementsScroll: {
    paddingHorizontal: 20,
    gap: 16,
  },
  achievementCard: {
    width: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  achievementCardLocked: {
    backgroundColor: '#F8F8F8',
    opacity: 0.6,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementTitleLocked: {
    color: '#8E8E93',
  },
  achievementDescription: {
    fontSize: 11,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 16,
  },
  achievementDescriptionLocked: {
    color: '#C7C7CC',
  },
  earnedBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  menuRight: {
    alignItems: 'center',
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-end',
  },
  quoteCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#1C1C1E',
    lineHeight: 24,
    marginBottom: 12,
  },
  quoteAuthor: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
    textAlign: 'right',
  },
});