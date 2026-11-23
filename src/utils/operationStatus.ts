const statusStyles = {
  green: { bgcolor: '#e8f3ee', color: '#2f6553' },
  blue: { bgcolor: '#e8eef7', color: '#315a89' },
  red: { bgcolor: '#fde8e8', color: '#a32727' },
  purple: { bgcolor: '#f1e8f7', color: '#653d80' },
};

export function getOperationStatusStyle(status: string) {
  const normalized = status.trim().toUpperCase();

  if (normalized.includes('REFINANCI')) return statusStyles.red;
  if (normalized.includes('REESTRUCTUR')) return statusStyles.purple;
  if (normalized === 'ORIGINAL') return statusStyles.green;
  return statusStyles.blue;
}
