// home.js
'use client';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import { useRef } from 'react';
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import AOS from 'aos';
import 'aos/dist/aos.css';

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
  const BASE_URL1 = process.env.NEXT_PUBLIC_BASE_URL || 'https://two025planner.onrender.com';
  const notify = () => toast("User not logged in!");
  const [loading, setLoading] = useState(false);
  const [deletingTask, setDeletingTask] = useState(false);
  const [addingTask, setAddTask] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);


  useEffect(() => {
    AOS.init();
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token') || '';
      const username = localStorage.getItem('username');
      setToken(storedToken);

      if (!storedToken && !username) {
        notify();
        window.location.href = '/login';
      }
    }
    if (!token) return;
    setLoading(true);
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
      } finally {
        setLoading(false);
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
    setDeletingTaskId(taskId);
    setDeletingTask(true);
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
    } finally {
      setDeletingTask(false);
      setDeletingTaskId(null);
    }
  };

  const handleAddTask = async (taskText) => {
    if (!token) return;
    if (!taskText.trim()) return;
    setAddTask(true);
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
    } finally {
      setAddTask(false);
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
              <div className={'text-xs text-blue-600 flex justify-center'}>
                {calendarData[dayKey].length}&nbsp;
                <span className={` ${calendarData[dayKey].length > 0 ? 'hidden md:block' : 'hidden'}`}>
                  task(s)
                </span>
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
      setTaskInput(newDescription);
      setTimeout(() => {
        setLocalEditingTask(null);
        setLocalEditedTaskText('');
      }, 100); // Prevents premature reset
    };


    return (
      <div data-aos="zoom-out-up" className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`bg-white p-6 rounded-lg w-96 transition-transform duration-300 transform ${isOpen ? 'scale-100' : 'scale-95'}`}>
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
                          {deletingTaskId === task._id ?(
                            <div className="flex justify-center items-center">
                              <div className="loader"></div> {/* Loader component */}
                            </div>
                          ) : (
                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              🗑️
                            </button>
                          )}
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
                {addingTask ? (
                  <button className="px-4 py-2 bg-blue-200 text-white rounded hover:bg-blue-600" disabled>
                   <div className='loader'></div>
                  </button>
                ) : (
                  <button
                    onClick={handleTaskSubmit} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Save Task
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex justify-end gap-2">
              {!editingTask && (
                <>
                  <button onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-100">
                    Close
                  </button>
                  <button onClick={() => {setShowAddTaskForm(true); setTaskInput('')}}  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
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
      {/* <ToastContainer /> */}
      <div className="p-4 lg:p-16">
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <div className="loader"></div>
          </div>
        ) : (
          <div className='border-2 stroke-neutral-400 p-4 lg:p-6'>
            <div className="flex flex-col lg:flex-row justify-between items-center mb-4">
              <div className="flex gap-2 mb-2 lg:mb-0">
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
              {/* <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="20" width="100" height="90" rx="8" ry="8" fill="#ffffff" stroke="#2c3e50" stroke-width="2" />

              <rect x="10" y="20" width="100" height="20" fill="#3498db" />

              <text x="60" y="35" fill="#ffffff" font-family="Arial, sans-serif" font-size="12" text-anchor="middle">
                Calendar
              </text>

              <line x1="10" y1="40" x2="110" y2="40" stroke="#ecf0f1" stroke-width="1" />
              <line x1="10" y1="55" x2="110" y2="55" stroke="#ecf0f1" stroke-width="1" />
              <line x1="10" y1="70" x2="110" y2="70" stroke="#ecf0f1" stroke-width="1" />
              <line x1="10" y1="85" x2="110" y2="85" stroke="#ecf0f1" stroke-width="1" />

              <line x1="40" y1="20" x2="40" y2="110" stroke="#ecf0f1" stroke-width="1" />
              <line x1="70" y1="20" x2="70" y2="110" stroke="#ecf0f1" stroke-width="1" />
              <line x1="100" y1="20" x2="100" y2="110" stroke="#ecf0f1" stroke-width="1" />

              <circle cx="85" cy="75" r="6" fill="#e74c3c" />
            </svg> */}
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
        )}
      </div>
    </>
  );
}