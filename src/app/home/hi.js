'use client';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import { useRef } from 'react';

export default function Home() {
  const [calendarData, setCalendarData] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateTasks, setSelectedDateTasks] = useState([]);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editedTaskText, setEditedTaskText] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/calendar', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch calendar data');
        }

        const data = await response.json();
        const transformedData = data.tasks.reduce((acc, item) => {
          const date = new Date(item.date);
          const dayKey = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
          const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
          acc[key] = item.tasks;
          acc[dayKey] = item.tasks;
          return acc;
        }, {});
        setCalendarData(transformedData);
      } catch (error) {
        console.error('Error fetching calendar data:', error);
      }
    };

    fetchCalendarData();
  }, []);

  const handleEditTask = async (taskId, newDescription) => {
    try {
      const response = await fetch(`http://localhost:8000/calendar/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          date: selectedDate,
          taskId: taskId,
          newDescription: newDescription
        }),
      });

      if (response.status === 200) {
        const token = localStorage.getItem('token');
        const updatedResponse = await fetch('http://localhost:8000/calendar', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!updatedResponse.ok) {
          throw new Error('Failed to fetch updated calendar data');
        }

        const data = await updatedResponse.json();
        const transformedData = data.tasks.reduce((acc, item) => {
          const date = new Date(item.date);
          const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
          const dayKey = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
          acc[key] = item.tasks;
          acc[dayKey] = item.tasks;
          return acc;
        }, {});
        setCalendarData(transformedData);

        const dateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;
        setSelectedDateTasks(transformedData[dateKey] || []);

        setEditingTask(null);
        setEditedTaskText('');
      }
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const response = await fetch(`http://localhost:8000/calendar/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          date: selectedDate,
          taskId: taskId
        }),
      });

      if (response.ok) {
        const token = localStorage.getItem('token');
        const updatedResponse = await fetch('http://localhost:8000/calendar', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!updatedResponse.ok) {
          throw new Error('Failed to fetch updated calendar data');
        }

        const data = await updatedResponse.json();
        const transformedData = data.tasks.reduce((acc, item) => {
          const date = new Date(item.date);
          const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
          const dayKey = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
          acc[key] = item.tasks;
          acc[dayKey] = item.tasks;
          return acc;
        }, {});
        setCalendarData(transformedData);

        const dateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;
        setSelectedDateTasks(transformedData[dateKey] || []);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleAddTask = async (taskText) => {
    if (!taskText.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8000/calendar/add',
        { date: selectedDate, task: taskText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        const updatedResponse = await fetch('http://localhost:8000/calendar', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await updatedResponse.json();
        const transformedData = data.tasks.reduce((acc, item) => {
          const date = new Date(item.date);
          const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
          const dayKey = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
          acc[key] = item.tasks;
          acc[dayKey] = item.tasks;
          return acc;
        }, {});
        setCalendarData(transformedData);
        
        const dateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;
        setSelectedDateTasks(transformedData[dateKey] || []);
        setShowAddTaskForm(false);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const changeMonth = (offset) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const changeYear = (offset) => {
    setCurrentDate(new Date(currentDate.getFullYear() + offset, currentDate.getMonth(), 1));
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateKey = `${clickedDate.getFullYear()}-${clickedDate.getMonth()}-${day}`;
    const tasksForDate = calendarData[dateKey] || [];
    setSelectedDate(clickedDate);
    setSelectedDateTasks(tasksForDate);
    setIsModalOpen(true);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="p-2 text-gray-400"></div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        day === new Date().getDate() &&
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear();
      const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
      const dayKey = `${day}-${currentDate.getMonth()}-${currentDate.getFullYear()}`;
      const hasTasks = calendarData && calendarData[dayKey]?.length > 0;

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`p-2 border rounded-lg cursor-pointer transition-colors
          ${isToday ? 'bg-blue-100 font-bold' : 'hover:bg-gray-100'}
          ${hasTasks ? 'border-blue-500' : ''}
        `}
        >
          <div className="min-h-[40px]">
            {day}
            {hasTasks && (
              <div className="text-xs text-blue-600">
                {calendarData[dayKey].length} task(s)
              </div>
            )}
          </div>
        </div>
      );
    }
    return days;
  };

  function DateModal({ isOpen, onClose, selectedDate, tasks }) {
    if (!isOpen) return null;
    
    const [taskInput, setTaskInput] = useState('');
    
    const handleTaskSubmit = async () => {
      if (!taskInput.trim()) return;
      await handleAddTask(taskInput);
      setTaskInput('');
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {selectedDate?.toLocaleDateString('default', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="mb-4">
            {tasks.length > 0 ? (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task._id}
                    className={`p-2 rounded ${task.status === 'Completed' ? 'bg-green-100' : 'bg-yellow-100'}`}
                  >
                    {editingTask === task._id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editedTaskText}
                          onChange={(e) => setEditedTaskText(e.target.value)}
                          className="w-full p-2 border rounded-lg resize-none h-24"
                          autoFocus
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingTask(null);
                              setEditedTaskText('');
                            }}
                            className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleEditTask(task._id, editedTaskText)}
                            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div>
                          <p>{task.description}</p>
                          <p className="text-sm text-gray-600">Status: {task.status}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingTask(task._id);
                              setEditedTaskText(task.description);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No tasks for this date</p>
            )}
          </div>

          {showAddTaskForm ? (
            <div className="mb-4">
              <textarea
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                className="w-full p-2 border rounded-lg resize-none h-24"
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-2">
                <button 
                  onClick={() => {
                    setShowAddTaskForm(false);
                    setTaskInput('');
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleTaskSubmit} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Save Task
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end gap-2">
                {!editingTask && (
                  <>
                    <button onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-100">
                      Close
                    </button>
                    <button onClick={() => setShowAddTaskForm(true)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                      Add Task
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }
  
    return (
      <>
        <Navbar />
        <div className="p-16">
          <div className='border-2 stroke-neutral-400 p-6'>
            {/* Navigation Controls */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => changeYear(-1)}
                  className="px-3 py-1 border rounded hover:bg-gray-100 bg-sky-500/50"
                >
                  ←Year
                </button>
                <button
                  onClick={() => changeMonth(-1)}
                  className="px-3 py-1 border rounded hover:bg-gray-100 bg-green-500/50"
                >
                  ←Month
                </button>
              </div>
  
              <div className="text-xl font-bold">
                {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
              </div>
  
              <div className="flex gap-2">
                <button
                  onClick={() => changeMonth(1)}
                  className="px-3 py-1 border rounded hover:bg-gray-100 bg-green-500/50"
                >
                  Month→
                </button>
                <button
                  onClick={() => changeYear(1)}
                  className="px-3 py-1 border rounded hover:bg-gray-100 bg-sky-500/50"
                >
                  Year→
                </button>
              </div>
            </div>
  
            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center font-semibold">
                  {day}
                </div>
              ))}
            </div>
  
            {/* Calendar Grid */}
            <div id="calendarDays" className="grid grid-cols-7 grid-rows-5 gap-2 text-center">
              {renderCalendar()}
            </div>
  
            {/* Today Button */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Today
              </button>
            </div>
            <DateModal
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setShowAddTaskForm(false);
                setEditingTask(null);
                setEditedTaskText('');
              }}
              selectedDate={selectedDate}
              tasks={selectedDateTasks}
            />
          </div>
        </div>
      </>
    );
  }