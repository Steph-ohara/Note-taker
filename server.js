const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));



require('./routing/apiroute')(app);
require('./routing/htmlroute')(app);


app.listen(PORT, function() {
 console.log(`Server is listening on PORT: ${PORT}`);
});