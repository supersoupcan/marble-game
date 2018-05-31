var app = require('../src/app');

app.listen(process.env.PORT, function (){
    console.log('app running on port ' + process.env.PORT);
});