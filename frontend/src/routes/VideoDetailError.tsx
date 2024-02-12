import React, { useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import ErrorPage from 'routes/ErrorPage';

function VideoDetailError() {
  const [searchParams] = useSearchParams();
  const [shouldRedirect, setShouldRedirect] = React.useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (searchParams.get('playlist')) {
      setShouldRedirect(true);
    } else {
      setShouldRedirect(false);
    }
  }, [searchParams]);

  return shouldRedirect === true ? (
    <Navigate to={`/playlist/${searchParams.get('playlist')}`} />
  ) : (
    shouldRedirect === false && <ErrorPage />
  );
}

export default VideoDetailError;
