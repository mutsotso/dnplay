define([
    "dojo/node!mongoose",
    "dojo/node!bcrypt"
], function(mongoose, bcrypt){
    var Schema = mongoose.Schema;

    var UserSchema = Schema({
        username: {type: String, index: true},
        first_name: String,
        other_names: String,
        hash: String,
        date_created: {type: Date, "default": Date.now},
        date_modified: {type: Date, "default": Date.now}
    });

    UserSchema.methods.full_name = function(cb){
        var name = this.first_name;
        if(this.other_names !== ""){
            name += " " + this.other_names;
        }
        return name;
    };

    UserSchema.methods.validPassword = function(password){
        return bcrypt.compareSync(password, this.hash);
    };

    UserSchema.methods.setPassword = function(password){
        this.hash = bcrypt.hashSync(password, 10);
    };

    var EmployeeSchema = Schema({
        staff_number: {type: String, index: true},
        username: {type: String, index: true},
        first_name: String,
        other_names: String,
        Grades: String,
        title: String,
        unit: String,
        date_of_birth: {type: Date},
        date_of_appointment:{type: Date},
        end_of_appointment:{type: Date},
        duty_post: String,
        recruitment_mode: String,
        supervisor: String,
        qualifications: [{qualification: String, discipline: String}],
        gender: String,
        date_created: {type: Date, "default": Date.now},
        date_modified: {type: Date, "default": Date.now}
    });

    return {
        UserSchema: UserSchema, EmployeeSchema: EmployeeSchema
    };
}
);
