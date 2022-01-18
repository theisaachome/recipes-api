//  Testing how middleware work in each http request 
const logger = (req,res,next)=>{
    // console.log(req);
    console.log(`${req.method} ${req.protocol}://${req.host}:${req.originalUrl}`);

    next();
}

module.exports = logger;