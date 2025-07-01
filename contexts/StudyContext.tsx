import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  dueDateTime: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  description?: string;
}

export interface Class {
  id: string;
  subject: string;
  time: string;
  duration: string;
  room?: string;
  day: string;
  color: string;
}

export interface Note {
  id: string;
  title: string;
  subject: string;
  content: string;
  type: 'text' | 'image' | 'video';
  createdAt: Date;
  updatedAt: Date;
}

export interface StudyStats {
  totalNotes: number;
  completedAssignments: number;
  studyHours: number;
  currentStreak: number;
  classesToday: number;
  dueSoon: number;
  overallProgress: number;
}

interface StudyContextType {
  // Data
  assignments: Assignment[];
  classes: Class[];
  notes: Note[];
  stats: StudyStats;

  // Assignment methods
  addAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;

  // Class methods
  addClass: (classItem: Omit<Class, 'id'>) => void;
  updateClass: (id: string, updates: Partial<Class>) => void;
  deleteClass: (id: string) => void;

  // Note methods
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  // Utility methods
  getTodayClasses: () => Class[];
  getUpcomingAssignments: (limit?: number) => Assignment[];
  getRecentNotes: (limit?: number) => Note[];
  refreshStats: () => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

// Sample data
const initialAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Math Homework - Chapter 5',
    subject: 'Mathematics',
    dueDate: 'Today',
    dueDateTime: new Date(),
    priority: 'high',
    status: 'pending',
    description: 'Complete exercises 5.1 to 5.3'
  },
  {
    id: '2',
    title: 'History Essay - World War II',
    subject: 'History',
    dueDate: 'Tomorrow',
    dueDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    priority: 'medium',
    status: 'in-progress',
    description: 'Write 1000 words on causes of WWII'
  },
  {
    id: '3',
    title: 'Science Lab Report',
    subject: 'Physics',
    dueDate: 'Friday',
    dueDateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    priority: 'low',
    status: 'pending',
    description: 'Submit pendulum experiment report'
  },
  {
    id: '4',
    title: 'English Presentation',
    subject: 'English',
    dueDate: 'Next Week',
    dueDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    priority: 'medium',
    status: 'pending',
    description: 'Prepare presentation on Shakespeare'
  }
];

const initialClasses: Class[] = [
  { id: '1', subject: 'Mathematics', time: '9:00 AM', duration: '1h', room: 'Room 101', day: 'Monday', color: '#007AFF' },
  { id: '2', subject: 'Physics', time: '11:00 AM', duration: '1h', room: 'Lab 201', day: 'Monday', color: '#34C759' },
  { id: '3', subject: 'English', time: '2:00 PM', duration: '45m', room: 'Room 205', day: 'Monday', color: '#FF9500' },
  { id: '4', subject: 'Chemistry', time: '9:00 AM', duration: '1h', room: 'Lab 301', day: 'Tuesday', color: '#FF3B30' },
  { id: '5', subject: 'History', time: '10:30 AM', duration: '1h', room: 'Room 102', day: 'Tuesday', color: '#AF52DE' },
  { id: '6', subject: 'Mathematics', time: '1:00 PM', duration: '1h', room: 'Room 101', day: 'Tuesday', color: '#007AFF' },
];

const initialNotes: Note[] = [
  {
    id: '1',
    title: 'Quadratic Equations - Chapter 4',
    subject: 'Mathematics',
    content: 'A quadratic equation is a polynomial equation of degree 2...',
    type: 'text',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: '2',
    title: 'Newton\'s Laws of Motion',
    subject: 'Physics',
    content: 'First Law: An object at rest stays at rest...',
    type: 'text',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  }
];

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [classes, setClasses] = useState<Class[]>(initialClasses);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [stats, setStats] = useState<StudyStats>({
    totalNotes: 0,
    completedAssignments: 0,
    studyHours: 156,
    currentStreak: 7,
    classesToday: 0,
    dueSoon: 0,
    overallProgress: 0
  });

  // Assignment methods
  const addAssignment = (assignment: Omit<Assignment, 'id'>) => {
    const newAssignment: Assignment = {
      ...assignment,
      id: Date.now().toString(),
    };
    setAssignments(prev => [...prev, newAssignment]);
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignments(prev =>
      prev.map(assignment =>
        assignment.id === id ? { ...assignment, ...updates } : assignment
      )
    );
  };

  const deleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(assignment => assignment.id !== id));
  };

  // Class methods
  const addClass = (classItem: Omit<Class, 'id'>) => {
    const newClass: Class = {
      ...classItem,
      id: Date.now().toString(),
    };
    setClasses(prev => [...prev, newClass]);
  };

  const updateClass = (id: string, updates: Partial<Class>) => {
    setClasses(prev =>
      prev.map(classItem =>
        classItem.id === id ? { ...classItem, ...updates } : classItem
      )
    );
  };

  const deleteClass = (id: string) => {
    setClasses(prev => prev.filter(classItem => classItem.id !== id));
  };

  // Note methods
  const addNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    };
    setNotes(prev => [...prev, newNote]);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === id ? { ...note, ...updates, updatedAt: new Date() } : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  // Utility methods
  const getTodayClasses = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return classes.filter(classItem => classItem.day === today);
  };

  const getUpcomingAssignments = (limit = 5) => {
    return assignments
      .filter(assignment => assignment.status !== 'completed')
      .sort((a, b) => a.dueDateTime.getTime() - b.dueDateTime.getTime())
      .slice(0, limit);
  };

  const getRecentNotes = (limit = 5) => {
    return notes
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, limit);
  };

  const refreshStats = () => {
    const completedAssignments = assignments.filter(a => a.status === 'completed').length;
    const totalAssignments = assignments.length;
    const todayClasses = getTodayClasses().length;
    const dueSoon = assignments.filter(a => {
      const daysDiff = (a.dueDateTime.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 2 && a.status !== 'completed';
    }).length;
    
    const overallProgress = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;

    setStats({
      totalNotes: notes.length,
      completedAssignments,
      studyHours: 156, // Static for now
      currentStreak: 7, // Static for now
      classesToday: todayClasses,
      dueSoon,
      overallProgress
    });
  };

  // Refresh stats when data changes
  useEffect(() => {
    refreshStats();
  }, [assignments, classes, notes]);

  const value: StudyContextType = {
    assignments,
    classes,
    notes,
    stats,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    addClass,
    updateClass,
    deleteClass,
    addNote,
    updateNote,
    deleteNote,
    getTodayClasses,
    getUpcomingAssignments,
    getRecentNotes,
    refreshStats,
  };

  return (
    <StudyContext.Provider value={value}>
      {children}
    </StudyContext.Provider>
  );
}

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (context === undefined) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};