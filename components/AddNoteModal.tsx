import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

interface AddNoteModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (note: { title: string; subject: string; content: string }) => void;
  editingNote: { title: string; subject: string; content: string } | null;
}

export default function AddNoteModal({ visible, onClose, onSave, editingNote }: AddNoteModalProps) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setSubject(editingNote.subject);
      setContent(editingNote.content);
    } else {
      setTitle('');
      setSubject('');
      setContent('');
    }
  }, [editingNote, visible]);

  const handleSave = () => {
    if (!title.trim() || !subject.trim() || !content.trim()) {
      alert('Please fill in all fields');
      return;
    }
    onSave({ title, subject, content });
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
          <Text style={styles.title}>{editingNote ? 'Edit Note' : 'Add New Note'}</Text>

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
            style={[styles.input, styles.textArea]}
            placeholder="Start writing your note..."
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={5}
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
  textArea: {
    height: 120,
    textAlignVertical: 'top',
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
