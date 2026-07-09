/**
 * A reusable controller wrapper that standardizes the API response format
 * and automatically catches asynchronous errors to forward to Express error middleware.
 * 
 * Expected return structure from handler:
 * - { statusCode: 200, message: "...", data: {} }
 * - OR a direct value/object which will be treated as the data payload.
 * 
 * Output response format:
 * {
 *   success: true,
 *   message: "...",
 *   data: {}
 * }
 * 
 * @param {Function} handler - Async function representing the controller logic.
 * @returns {Function} Express middleware handler.
 */
export const createController = (handler) => {
  return async (req, res, next) => {
    try {
      const result = await handler(req, res, next);

      // If response has already been sent (e.g. streaming or file download), do nothing
      if (res.headersSent) return;

      const statusCode = result?.statusCode || 200;
      const message = result?.message || 'Success';
      
      // Determine what to place in 'data'. If the result is an object with a 'data' key,
      // we check if it has statusCode or message. If it does not, or if it is just a plain structure,
      // we unpack it or use the whole object.
      let data = result;
      if (result && typeof result === 'object') {
        const keys = Object.keys(result);
        const hasControlKeys = keys.includes('statusCode') || keys.includes('message') || keys.includes('data');
        if (hasControlKeys) {
          data = result.data !== undefined ? result.data : null;
        }
      }

      res.status(statusCode).json({
        success: true,
        message,
        data
      });
    } catch (error) {
      next(error);
    }
  };
};
