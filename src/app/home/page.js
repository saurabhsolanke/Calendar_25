// home.js
'use client';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import { useRef } from 'react';
import React from 'react';

export default function Home() {
  const [calendarData, setCalendarData] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateTasks, setSelectedDateTasks] = useState([]);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editedTaskText, setEditedTaskText] = useState('');
  const [token, setToken] = useState('');
  const BASE_URL1 = process.env.NEXT_PUBLIC_BASE_URL;
  console.log(BASE_URL1, "base url");
  
    
  useEffect(() => {
    // Safely access localStorage only on the client side
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token') || '');
    }
  }, []);

  useEffect(() => {
    // Only run this effect if token is available
    if (!token) return;
    
    const fetchCalendarData = async () => {
      try {
        const response = await fetch(BASE_URL1 + '/calendar', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include',
          mode: "cors"
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
  }, [token, BASE_URL1]);

  const handleEditTask = async (taskId, newDescription) => {
    if (!token) return;
    
    try {
      const response = await fetch(BASE_URL1 + '/calendar/edit', {
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
        const updatedResponse = await fetch(BASE_URL1 + '/calendar', {
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
    if (!token) return;
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const response = await fetch(BASE_URL1 + '/calendar/delete', {
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
        const updatedResponse = await fetch(BASE_URL1 + '/calendar', {
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
    if (!token) return;
    if (!taskText.trim()) return;

    try {
      const response = await axios.post(BASE_URL1 + '/calendar/add',
        { date: selectedDate, task: taskText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        const updatedResponse = await fetch(BASE_URL1 + '/calendar', {
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
              <div className={'text-xs text-blue-600'}>
                {calendarData[dayKey].length} <p className={` ${calendarData[dayKey].length > 0 ? 'hidden md:block' : 'hidden'}`}>
                  task(s) </p>
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
    const [localEditingTask, setLocalEditingTask] = useState(null);
    const [localEditedTaskText, setLocalEditedTaskText] = useState('');

    useEffect(() => {
      if (localEditingTask) {
        setLocalEditedTaskText(localEditingTask.description); // Keep value on edit
      }
    }, [localEditingTask]);

    const handleTaskSubmit = async () => {
      if (!taskInput.trim()) return;
      await handleAddTask(taskInput);
      setTaskInput('');
    };

    const handleLocalEditTask = async (taskId, newDescription) => {
      if (!newDescription.trim()) return;
      await handleEditTask(taskId, newDescription);
      setTimeout(() => {
        setLocalEditingTask(null);
        setLocalEditedTaskText('');
      }, 100); // Prevents premature reset
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
                          value={localEditedTaskText}
                          onChange={(e) => setLocalEditedTaskText(e.target.value)}
                          className="w-full p-2 border rounded-lg resize-none h-24"
                          autoFocus
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingTask(null);
                              setLocalEditedTaskText('');
                            }}
                            className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleLocalEditTask(task._id, localEditedTaskText)}
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
                              setLocalEditedTaskText(task.description);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            🗑️
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
      <div className="p-4 lg:p-16"> {/* Adjust padding for mobile */}
        <div className='border-2 stroke-neutral-400 p-4 lg:p-6'> {/* Adjust padding for mobile */}
          {/* Navigation Controls */}
          <div className="flex flex-col lg:flex-row justify-between items-center mb-4"> {/* Stack items on mobile */}
            <div className="flex gap-2 mb-2 lg:mb-0"> {/* Add margin for mobile */}
              <button
                onClick={() => changeYear(-1)}
                className="px-3 py-1 border rounded hover:bg-gray-100 bg-sky-500/50 transition duration-200"
              >
                ←Year
              </button>
              <button
                onClick={() => changeMonth(-1)}
                className="px-3 py-1 border rounded hover:bg-gray-100 bg-green-500/50 transition duration-200"
              >
                ←Month
              </button>
            </div>

            <div className="text-xl font-bold text-center">
              {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
            </div>

            <div className="flex gap-2 mb-2 lg:mb-0">
              <button
                onClick={() => changeMonth(1)}
                className="px-3 py-1 border rounded hover:bg-gray-100 bg-green-500/50 transition duration-200"
              >
                Month→
              </button>
              <button
                onClick={() => changeYear(1)}
                className="px-3 py-1 border rounded hover:bg-gray-100 bg-sky-500/50 transition duration-200"
              >
                Year→
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold">
                {day}
              </div>
            ))}
          </div>

          <div id="calendarDays" className="grid grid-cols-7 sm:grid-cols-7 md:grid-cols-5 lg:grid-cols-7 grid-rows-5 gap-2 text-center">
            {renderCalendar()}
          </div>

          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
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