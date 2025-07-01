import { useState } from 'react';

import { SlotButton } from '@/features/slot/SlotButton';

export const SlotSettingPage = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggle = (id: string) =>
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]));

  return (
    <div>
      <SlotButton selectedIds={selectedIds} onToggle={toggle} />
    </div>
  );
};
