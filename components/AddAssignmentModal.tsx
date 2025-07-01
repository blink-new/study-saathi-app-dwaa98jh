import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

interface AddAssignmentModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (assignment: {
    title: string;
    subject: string;
    dueDate: string;
    priority: string;
    description: string;
  }) => void;
}

export default function AddAssignmentModal({ visible, onClose, onAdd }: AddAssignmentModalProps) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [description, setDescription] = useState('');

  const handleAdd = () => {
    if (!title.trim() || !subject.trim() || !dueDate.trim()) {
      alert('Please fill in Title, Subject, and Due Date');
      return;
    }
    onAdd({ title, subject, dueDate, priority, description });
    setTitle('');
    setSubject('');
    setDueDate('');
    setPriority('medium');
    setDescription('');
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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add New Assignment</Text>

          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Subject"
            value={subject}
            onChangeText={setSubject}
          />
          <TextInput
            style={styles.input}
            placeholder="Due Date (e.g. Today, Tomorrow)"
            value={dueDate}
            onChangeText={setDueDate}
          />
          <TextInput
            style={styles.input}
            placeholder="Priority (high, medium, low)"
            value={priority}
            onChangeText={setPriority}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />

          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.buttonCancel} onPress={onClose}>
              <Text style={styles.buttonTextCancel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonAdd} onPress={handleAdd}>
              <Text style={styles.buttonTextAdd}>Add</Text>
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  buttonCancel: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#E5E5EA',
    borderRadius: 8,
  },
  buttonAdd: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  buttonTextCancel: {
    color: '#1C1C1E',
    fontWeight: '600',
  },
  buttonTextAdd: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
