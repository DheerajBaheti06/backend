/**
 * Request Validation Middleware.
 * Uses Zod schemas to validate request body.
 *
 * @param {import("zod").ZodSchema} schema - Zod validation schema
 * @returns {Function} Express middleware function
 */
export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    // Passing the full error to the global error handler
    next(error);
  }
};

// LEARNING:
/*
* Concept: "Currying" + "Closures". 
* {ZodSchema} schema - Passed via CURRYING to inner function--->(req,res,next)
* 1. CURRYING: We pass the 'schema' first, so we can use the result as an Express middleware.
* 2. CLOSURE: The inner function (req, res, next) "remembers" the 'schema' from its 
parent's scope even after the outer function has finished executing.
*/
