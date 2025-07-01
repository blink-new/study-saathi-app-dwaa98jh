import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

interface AddScheduleModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (schedule: { subject: string; time: string; room: string; day: string }) => void;
  editingSchedule: { subject: string; time: string; room: string; day: string } | null;
}

export default function AddScheduleModal({ visible, onClose, onSave, editingSchedule }: AddScheduleModalProps) {
  const [subject, setSubject] = useState('');
  const [time, setTime] = useState('');
  const [room, setRoom] = useState('');
  const [day, setDay] = useState('Monday');

  useEffect(() => {
    if (editingSchedule) {
      setSubject(editingSchedule.subject);
      setTime(editingSchedule.time);
      setRoom(editingSchedule.room);
      setDay(editingSchedule.day);
    } else {
      setSubject('');
      setTime('');
      setRoom('');
      setDay('Monday');
    }
  }, [editingSchedule, visible]);

  const handleSave = () => {
    if (!subject.trim() || !time.trim() || !room.trim()) {
      alert('Please fill in all fields');
      return;
    }
    onSave({ subject, time, room, day });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.modalContent}>
          <Text style={styles.title}>{editingSchedule ? 'Edit Class' : 'Add New Class'}</Text>

          <TextInput
            style={styles.input}
            placeholder="Subject"
            value={subject}
            onChangeText={setSubject}
          />
          <TextInput
            style={styles.input}
            placeholder="Time (e.g. 9:00 - 10:00 AM)"
            value={time}
            onChangeText={setTime}
          />
          <TextInput
            style={styles.input}
            placeholder="Room (e.g. Room 101)"
            value={room}
            onChangeText={setRoom}
          />
          <TextInput
            style={styles.input}
            placeholder="Day (e.g. Monday)"
            value={day}
            onChangeText={setDay}
          />

          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.buttonCancel} onPress={onClose}>
              <Text style={styles.buttonTextCancel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSave} onPress={handleSave}>
              <Text style={styles.buttonTextSave}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1C1C1E',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
    color: '#1C1C1E',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  buttonCancel: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#E5E5EA',
    borderRadius: 8,
  },
  buttonSave: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  buttonTextCancel: {
    color: '#1C1C1E',
    fontWeight: '600',
  },
  buttonTextSave: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
