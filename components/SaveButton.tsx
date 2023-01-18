import { useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

export default function SaveButton({ onClick }: { onClick: () => Promise<void> }) {
  const [saving, setSaving] = useState(false);

  return <LoadingButton
    onClick={async () => {
      setSaving(true);
      await onClick();
      setSaving(false);
    }}
    loading={saving}
    loadingPosition="start"
    startIcon={<SaveIcon />}
    variant="contained"
  >
    Save
  </LoadingButton>;
}