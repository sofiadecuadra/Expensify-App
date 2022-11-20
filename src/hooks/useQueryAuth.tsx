import {useInfiniteQuery, useQuery} from 'react-query';
import {useContext} from 'react';
import {AuthContext} from '../context/AuthContext';

const useQueryAuth = (queryKey, queryFn, options) => {
  const {signOut} = useContext(AuthContext);
  const onErrorToken = (error) => {
    if (
      error.response.data.errorType === 'TOKEN_ERROR' ||
      error.response.status === 401
    ) {
      signOut();
      return;
    }
    options.onError(error);
  };
  options.onError = onErrorToken;
  return useQuery(queryKey, queryFn, options);
};

const useInfiniteQueryAuth = (queryKey, queryFn, options) => {
  const {signOut} = useContext(AuthContext);
  const onErrorToken = (error) => {
    if (
      error.response.data.errorType === 'TOKEN_ERROR' ||
      error.response.status === 401
    ) {
      signOut();
      return;
    }
    options.onError(error);
  };
  options.onError = onErrorToken;

  return useInfiniteQuery(queryKey, queryFn, options);
};

export default {useQueryAuth, useInfiniteQueryAuth};
