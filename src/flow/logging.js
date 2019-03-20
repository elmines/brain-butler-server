//@flow
function log(message: string = "", level: string ="I")
{
   console.log(`${level} ${new Date(Date.now()).toLocaleString()}: ${message}`);
}

exports.log = log;
