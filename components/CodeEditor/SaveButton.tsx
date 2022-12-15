import { useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

export default function SaveButton({ onClick }: { onClick: () => Promise<void> }) {
  const [loading, setLoading] = useState(false);

  return <LoadingButton
    onClick={async () => {
      setLoading(true);
      await onClick();
      setLoading(false);
    }}
    loading={loading}
    loadingPosition="start"
    startIcon={<SaveIcon />}
    variant="contained"
  >
    Save
  </LoadingButton>;
}