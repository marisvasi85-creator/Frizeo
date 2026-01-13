export function useToast() {
  return {
    success: (message: string) => {
      alert(message);
    },
    error: (message: string) => {
      alert(message);
    },
  };
}
