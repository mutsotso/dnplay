define([
    "dojo/node!mongoose",
    "app/schema"
], function(mongoose, schema){
    var models = {
        User: mongoose.model('User', schema.UserSchema),
        Employee: mongoose.model('Employee', schema.EmployeeSchema)
    };
    return models;
});
