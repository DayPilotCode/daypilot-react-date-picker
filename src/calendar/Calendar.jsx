import React, { useEffect, useRef, useState } from 'react';
import { DayPilot, DayPilotCalendar } from '@daypilot/daypilot-lite-react';
import './Calendar.css';

export default function Calendar() {
  const calendarRef = useRef(null);
  const dateRef = useRef(null);
  const datePickerRef = useRef(null);

  const [startDate, setStartDate] = useState('2026-09-07');
  const [events, setEvents] = useState([]);

  const calendar = () => calendarRef.current?.control;

  useEffect(() => {
    setEvents([
      { id: 1, text: 'Event 1', start: '2026-09-09T10:30:00', end: '2026-09-09T13:00:00' }, // Wed
      { id: 2, text: 'Event 2', start: '2026-09-10T09:30:00', end: '2026-09-10T11:30:00', backColor: '#6aa84f' }, // Thu
      { id: 3, text: 'Event 3', start: '2026-09-10T12:00:00', end: '2026-09-10T15:00:00', backColor: '#f1c232' }, // Thu
      { id: 4, text: 'Event 4', start: '2026-09-08T11:30:00', end: '2026-09-08T14:30:00', backColor: '#cc4125' }, // Tue
    ]);

    datePickerRef.current = new DayPilot.DatePicker({
      target: dateRef.current,
      pattern: 'MMMM d, yyyy',
      date: '2026-09-07',
      onTimeRangeSelected: (args) => {
        setStartDate(args.start);
      },
    });

  }, []);

  const onTimeRangeSelected = async (args) => {
    const modal = await DayPilot.Modal.prompt('Create a new event:', 'Event 1');
    calendar()?.clearSelection();
    if (!modal.result) return;
    calendar()?.events.add({
      start: args.start,
      end: args.end,
      id: DayPilot.guid(),
      text: modal.result,
    });
  };

  const onEventClick = async (args) => {
    const modal = await DayPilot.Modal.prompt('Update event text:', args.e.text());
    if (!modal.result) return;
    const e = args.e;
    e.data.text = modal.result;
    calendar()?.events.update(e);
  };

  const onBeforeEventRender = args => {
    const backColor = args.data.backColor || "#6aa84f";

    args.data.fontColor = "#ffffff";
    args.data.backColor = backColor + "77"; // add transparency
    args.data.borderColor = "darker";
    args.data.html = "";
    args.data.areas = [
      {
        left: 4,
        top: 4,
        right: 4,
        height: 26,
        text: args.data.text,
        padding: 2,
        backColor: backColor + "cc",
        fontColor: "#ffffff",
        verticalAlignment: "center",
        horizontalAlignment: "center",
        borderRadius: 4,
      }
    ];
  };

  const changeDate = () => {
    datePickerRef.current?.show();
  };

  return (
    <div>
      <div className="toolbar">
        <span ref={dateRef} style={{display: "inline-block"}}></span>{' '}
        <button onClick={changeDate}>Change date</button>
      </div>

      <DayPilotCalendar
        ref={calendarRef}
        viewType="Week"
        durationBarVisible={false}
        startDate={startDate}
        events={events}
        timeRangeSelectedHandling="Enabled"
        onTimeRangeSelected={onTimeRangeSelected}
        onBeforeEventRender={onBeforeEventRender}
        eventDeleteHandling="Update"
        onEventClick={onEventClick}
      />
    </div>
  );
}
