import { useSelector } from 'react-redux';

function TaskHistory() {
  const history = useSelector((state) => state.tasks.history) || [];

  return (
    <div>
      <h2>Task History</h2>
      <ul>
        {Array.isArray(history) && history.length > 0 ? (
          history.map((entry, index) => (
            <li key={index}>
              {entry.content || 'No content'} - {entry.status || 'No status'} at {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : 'Invalid date'}
            </li>
          ))
        ) : (
          <li>No task history available.</li>
        )}
      </ul>
    </div>
  );
}

export default TaskHistory;
