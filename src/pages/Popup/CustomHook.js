import React from 'react';
const useStateWithLocalStorage = (localStorageKey) => {
  const [value, setValue] = React.useState(
    chrome.storage.local.get([localStorageKey], function (result) {
      console.log('result', result);
      return result;
    })
  );

  React.useEffect(() => {
    chrome.storage.sync.set({ myKey: value });
  }, [value]);

  return [value, setValue];
};

export default useStateWithLocalStorage;
