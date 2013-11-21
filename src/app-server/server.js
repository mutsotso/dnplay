require([
	"dojo/node!express",
    "dojo/node!jade",
    "dojo/node!http-auth",
    "dojo/node!mongoose",
    "dojo/node!passport",
    "dojo/node!passport-local",
    "dojo/node!bcrypt",
    "app/models"
], function(express, jade, auth, mongoose, passport, passport_local, bcrypt, models){
    mongoose.connect('mongodb://localhost/cgca');
    var app = express(),
        listenPort = 3000,
        LocalStrategy = passport_local.Strategy,
        db = mongoose.connection,
        digest = auth.digest(
            {realm: "demo", file: "data/users.htpasswd"}
        ),
        User = models.User;

    function isAuthenticated(request, response, next){
        if(request.isAuthenticated()){
            return next();
        }
        response.redirect('/login');
    }

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback(){
        console.log("Connection to mongodb successful!");

        // passport
        passport.use(new LocalStrategy(
            function (username, password, done){
                console.log(username);
                User.findOne({username: username}, function(err, user){
                    if(err){return done(err);}
                    if(!user){
                        return done(null, false, {message: "Incorrect username."});
                    }
                    if(!user.validPassword(password)){
                        return done(null, false, {message: "Incorrect password."});
                    }
                    return done(null, user);
                });
            }
        ));
        passport.serializeUser(function(user, done){
            done(null, user.id);
        });

        passport.deserializeUser(function(id, done){
            User.findById(id, function(err, user){
                done(err,  user);
            });
        });

        // create default admin on startup
        User.find(function(err, users){
            if (err){
                console.log(err);
            }
            if(users.length === 0){
                var admin = new User({username: 'admin', first_name: 'admin', other_names: ''}),
                    pwd = 'admin';
                admin.setPassword(pwd);
                admin.save();
            }
        });

        app.configure(function(){
            app.locals.debug = false;
            app.locals.pretty = true;
            app.set('view engine', 'jade');
            app.set('views', 'views');
            app.use(express.cookieParser());
            app.use(express.urlencoded());
            app.use(express.json());
            app.use(express.session({secret: "cgcan"}));
            app.use(express.logger());
            app.use(passport.initialize());
            app.use(passport.session());
        });

        app.get('/', isAuthenticated, function(request, response){
            response.render('index');
        });

        app.get('/login', function(request, response){
            response.render('login', {messages: request.session.messages});
        });

        app.post('/login', function(request, response, next) {
            passport.authenticate('local', function(err, user, info){
                if(err){ return next(err); }
                if(!user){
                    if(info.message){
                        request.session.messages = info.message;
                    }
                    return response.redirect('/login');
                }
                request.login(user, function(err){
                    if(err){ return next(err); }
                    return response.redirect('/');
                });
            })(request, response, next);
        });

        app.get('/logout', function(request, response, next){
            request.logout();
            response.redirect('/');
        });

        app.listen(listenPort);
        console.log('Listening on port 3000');

    });
});
