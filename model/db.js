var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var empSchema = new Schema({
    _id: Number,
    fName: String,
    lName: String,
    mName: String,
  },
  {
    collection: 'employees'
  }
);

empSchema.pre('save', function(next){
    var currentDate = new Date();

    this.updated_at = currentDate;
    if (!this.created_at){
        this.created_at = new Date();
    }
    next();
});

var employees = mongoose.model('employee', empSchema);

module.exports = employees;
