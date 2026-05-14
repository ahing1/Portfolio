let listener = null;

export const registerToastListener = (fn) => {
  listener = fn;
};

export const unregisterToastListener = () => {
  listener = null;
};

export const showToast = (msg) => {
  if (listener) listener(msg);
};
