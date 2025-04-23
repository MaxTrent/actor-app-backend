/**
 * Truncates a message to a specified length, ensuring words are not cut off.
 * Adds ellipsis if the message is truncated.
 *
 * @param {string} message - The message text to be truncated.
 * @param {number} maxLength - The maximum length of the truncated message.
 * @returns {string} - The truncated message with ellipsis if needed.
 */
export function truncateMessage(message: string, maxLength: number = 60): string {
  if (message.length <= maxLength) {
    return message;
  }

  const truncated = message.slice(0, maxLength + 1); // Slice to one character more to handle edge cases
  const lastSpaceIndex = truncated.lastIndexOf(" ");

  if (lastSpaceIndex === -1) {
    // No space found, truncate at maxLength
    return message.slice(0, maxLength) + "...";
  }

  // Truncate at the last space within maxLength
  return message.slice(0, lastSpaceIndex) + "...";
}
