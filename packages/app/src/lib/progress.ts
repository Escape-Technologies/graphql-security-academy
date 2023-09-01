/**
 * Very simple progress tracker, using local storage.
 *
 * @remarks
 *   Since it uses local storage, it is client-side only.
 * @module
 */

export const getCompleted = () => {
  const progress = localStorage.getItem('progress');
  if (!progress) return new Map<string, Date>();
  try {
    const parsed = JSON.parse(progress);
    return new Map<string, Date>(
      parsed.map(([id, date]: [string, string]) => [id, new Date(date)]),
    );
  } catch {
    return new Map<string, Date>();
  }
};

export const markCompleted = (id: string) => {
  const progress = getCompleted();
  progress.set(id, new Date());
  localStorage.setItem('progress', JSON.stringify([...progress]));
};

export const deleteCompleted = (id: string) => {
  const progress = getCompleted();
  progress.delete(id);
  localStorage.setItem('progress', JSON.stringify([...progress]));
};
