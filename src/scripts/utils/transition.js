const applyViewTransition = async (callback) => {
    if (!document.startViewTransition) {
      callback();
      return;
    }
  
    document.startViewTransition(() => {
      callback();
    });
  };
  
  export default applyViewTransition;
  