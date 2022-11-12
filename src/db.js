const mongoose = require('mongoose')
require('dotenv').config();


(async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('db connected')
    }
    catch(err){
        console.log('an  error encountered');
    }
})();
