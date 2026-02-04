import React, { useEffect, useState } from 'react';
import { FiLoader } from 'react-icons/fi';
import '../styles/Loading.scss';

const LoadingSpinner = ({ delay = 400, message }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 100);
    const hideTimer = setTimeout(() => setShow(false), delay);
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [delay]);

  return (
    <div className={`loading-container ${show ? 'show' : ''}`}>
      <div className="loading-spinner"><FiLoader size={48} /></div>
      <p className="loading-text">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
