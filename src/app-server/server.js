require([
	"dojo/node!express",
    "dojo/node!jade"
], function(express, jade){
    var app = express(), listenPort = 3000;

    app.configure(function(){
        app.locals.debug = true;
        app.locals.pretty = true;
        app.set('view engine', 'jade');
        app.set('views', 'views');
        app.use(express.logger());
    });

    app.get('/', function(request, response){
        response.render('index');
    });

    app.listen(listenPort);
    console.log('Listening on port 3000');
});
