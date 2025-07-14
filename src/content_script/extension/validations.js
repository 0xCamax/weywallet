export function validateSender(sender) {
  if (!sender || sender.id !== chrome.runtime.id) {
    console.warn(
      "[Content Script] Message rejected: sender not authorized",
      sender?.id
    );
    return false;
  }
  return true;
}
