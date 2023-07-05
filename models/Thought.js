const { Schema, model } = require('mongoose');

//for subdoc
const reactionSchema = require('./Reaction');
const { Reaction } = require('.');

//thought schema
const thoughtSchema = new Schema(
    {
        thoughtText:{
            type: String,
            required: true,
            minLength: 1,
            maxlength: 280,
        },
        createdAt:{
            type: Date,
            default: Date.now,
            get: (date)=> date.toLocalDateString("en-us"),
        },
        userName:{
           type:String,
           required: true, 
        },
        reactions: [reactionSchema],
    },
    {
        toJSON:{
            virtuals:true,
            getters:true,
        },
        id: false,
    }
)

//virtual
thoughtSchema.virtual('reactionCount').get(function(){
    return this.reactions.length;
});

const Thought = model('thought', thoughtSchema);

module.exports = Thought;

