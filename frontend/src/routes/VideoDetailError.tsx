import React, { useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import ErrorPage from 'routes/ErrorPage';

function VideoDetailError() {
  const [searchParams] = useSearchParams();
  const [shouldRedirect, redirect] = React.useState(false);

  useEffect(() => {
    if (searchParams.get('playlist')) {
      redirect(true);
    }
  }, [searchParams]);

  return shouldRedirect ? (
    <Navigate to={`/playlist/${searchParams.get('playlist')}`} />
  ) : (
    <ErrorPage />
  );
}

export default VideoDetailError;
