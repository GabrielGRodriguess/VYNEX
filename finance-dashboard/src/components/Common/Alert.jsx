import React from 'react';
import { CheckCircle2, AlertCircle, Info, XCircle } from 'lucide-react';

const Alert = ({ type = 'info', title, message, children, className = '' }) => {
  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle2 size={20} />;
      case 'error': return <XCircle size={20} />;
      case 'warning': return <AlertCircle size={20} />;
      default: return <Info size={20} />;
    }
  };

  const getStyleClass = () => {
    switch (type) {
      case 'success': return 'alert-success';
      case 'error': return 'alert-error';
      case 'warning': return 'alert-warning';
      default: return 'alert-info';
    }
  };

  return (
    <div className={`alert-box ${getStyleClass()} ${className}`}>
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        {title && (
          <p className="text-[11px] font-black uppercase tracking-tight mb-0.5">
            {title}
          </p>
        )}
        {message && (
          <p className="text-[10px] font-bold opacity-80 leading-snug">
            {message}
          </p>
        )}
        {children}
      </div>
    </div>
  );
};

export default Alert;
