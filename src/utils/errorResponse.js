
class ErrorResponse extends Error  {

    constructor(message,statusCode) {
     super(message,statusCode);
    }
}
module.exports = ErrorResponse;