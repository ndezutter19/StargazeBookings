'use client';
import { useEffect, useState } from 'react';
import { bookEvent, getToken } from '@/lib/api';
import axios from 'axios';

type Event = {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
};

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/events');
        setEvents(res.data);
      } catch (err) {
        console.error('Failed to fetch events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleBook = async (eventId: number) => {
    try {
      await bookEvent(eventId);
      alert('Booking successful!');
    } catch (err: any) {
      const message = err?.response?.data?.error || 'Booking failed';
      alert(message);
    }
  };

  return (
    <main className="max-w-3xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold">Upcoming Astronomy Events</h1>

      {loading ? (
        <p>Loading events...</p>
      ) : events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        events.map((event) => (
          <div key={event.id} className="p-4 border rounded shadow space-y-2">
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <p>{event.description}</p>
            <p className="text-sm text-gray-600">
              📍 {event.location} | 🗓️ {new Date(event.date).toLocaleDateString()}
            </p>
            {getToken() ? (
              <button
                className="bg-blue-600 text-white py-1 px-4 rounded"
                onClick={() => handleBook(event.id)}
              >
                Book
              </button>
            ) : (
              <p className="text-sm text-red-500">Log in to book</p>
            )}
          </div>
        ))
      )}
    </main>
  );
}
