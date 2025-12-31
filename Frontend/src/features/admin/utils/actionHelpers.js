/**
 * Handle action errors with consistent format
 */
export function handleActionError(error, action = "operation") {
  console.error(`Failed to ${action}:`, error);
  return {
    success: false,
    message: error.response?.data?.message || `Failed to ${action}`,
  };
}

/**
 * Create success response
 */
export function handleActionSuccess(message = "Operation completed successfully") {
  return { success: true, message };
}
