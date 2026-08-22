'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { createPortal } from 'react-dom';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null);

  const confirm = useCallback((options) => {
    const opts = typeof options === 'string' ? { message: options } : options;
    return new Promise((resolve) => {
      setState({ ...opts, resolve });
    });
  }, []);

  function handleClose(result) {
    state?.resolve(result);
    setState(null);
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state &&
        typeof document !== 'undefined' &&
        createPortal(
          <>
            <div className="fixed inset-0 z-[100] bg-black/30" onClick={() => handleClose(false)} />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-5">
                <div className="flex items-start gap-3 mb-5">
                  <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <svg
                      className="h-5 w-5 text-amber-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v4m0 4h.01M10.29 3.86l-8.18 14.18A1.5 1.5 0 003.5 20.5h17a1.5 1.5 0 001.4-2.46L13.7 3.86a1.5 1.5 0 00-2.6 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-text">{state.title || 'Xác nhận'}</h3>
                    <p className="text-text/60 text-sm mt-1">{state.message}</p>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleClose(false)}
                    className="px-4 py-2 rounded-xl border border-primary/30 text-text hover:bg-text/5 text-sm transition-colors"
                  >
                    {state.cancelLabel || 'Huỷ'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleClose(true)}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
                  >
                    {state.confirmLabel || 'Xoá'}
                  </button>
                </div>
              </div>
            </div>
          </>,
          document.body
        )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error('useConfirm phải được dùng bên trong <ConfirmProvider>');
  }
  return ctx;
}
