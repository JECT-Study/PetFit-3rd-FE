import type { RemarkFormData } from '@/apis/note';
import type { Note } from '@/types/note';

import { formatDate } from '../calendar';

export const toRemarkFormData = (note: Note, date: Date): RemarkFormData => ({
  title: note.title,
  content: note.content,
  remarkDate: formatDate(date), // 'YYYY-MM-DD'
});
