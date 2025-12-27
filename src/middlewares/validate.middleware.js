/*
    * Concept: "Currying" + "Closures". 
    * {ZodSchema} schema - Passed via CURRYING to inner function--->(req,res,next)
    * 1. CURRYING: We pass the 'schema' first, so we can use the result as an Express middleware.
    * 2. CLOSURE: The inner function (req, res, next) "remembers" the 'schema' from its 
                  parent's scope even after the outer function has finished executing.
*/
export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body); // Accesses 'schema' via Closure
    next();
  } catch (error) {
    const errorMessage = error.errors?.[0]?.message || "Invalid Input";
    throw new ApiError(400, errorMessage);
  }
};

/*
 * Currying (The Structure): Splitting fn(schema, req, res) into fn(schema)(req, res).
 * Closure (The Memory): The "hidden backpack" that keeps the schema alive for the inner function to use later.
 */
