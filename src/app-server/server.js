require([
	"dojo/node!express",
    "dojo/node!jade",
    "dojo/node!http-auth"
], function(express, jade, auth){
    var app = express(), listenPort = 3000;
    var digest = auth.digest(
        {realm: "demo", file: "data/users.htpasswd"}
    );

    app.configure(function(){
        app.locals.debug = true;
        app.locals.pretty = true;
        app.set('view engine', 'jade');
        app.set('views', 'views');
        app.use(express.logger());
        app.use(auth.connect(digest));
    });

    app.get('/', function(request, response){
        response.render('index');
    });

    app.listen(listenPort);
    console.log('Listening on port 3000');
});
