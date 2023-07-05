const {User, Thought} = require('../models');

module.exports = {

    //GET all users
    async getUsers(req, res){
        try{
            const users = await User.find();
            res.json(users);
        }catch(err){
            res.status(500).json(err)
        }
    },

    //GET single user by userID
    async getSingleUser(req, res){
        try{
            const user = await User.findOne({ _id: req.params.userId });

            if(!user){
                return res.status(404).json({
                    message: 'No user with this ID!'
                })
            }
            res.json(user);
        }catch(err){
            res.status(500).json(err);
        }
    },

    //POST (create) new user
    async createUser(req, res){
        try{
            const dbUserData = await User.create(req.body);
            res.json(dbUserData);
        }catch(err){
            res.status(500).json(err);
        }
    },

    //PUT (update) a user by userID
    async updateUser(req, res){
        try{
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId},
                { $set: req.body},
                { runValidators: true, new: true}
            );
            if(!user){
                return res.status(404).json({message: 'No user with this ID!'});
            }
            res.json(user);
        }catch(err){
            console.log(err);
            res.status(500).json(err);
        }
    },

    //DELETE user by userID
    async deleteUser(req, res){
        try{
            const user = await User.findOneAndRemove({ _id: req.params.userId});

            if(!user){
                return res.status(404).json({message: 'No user with this ID!'});
            }
            
            await Thought.deleteMany({ _id: {$in: user.thoughts}});
            res.json({message: 'User and thoughts are deleted!'});
        }catch(err){
            res.status(500).json(err);
        }
    },

    //POST (add) a friend by friendID
    async addFriend(req,res){
        try{
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.body } },
                { runValidators: true, new: true }
            );
            if(!user){
                return res.status(404).json({ message: 'No User with this id!' });
            }
            res.json(user);
        }catch(err){
            res.status(500).json(err);
        }
    },

    //DELETE friend by friendId
    async removeFriend(req,res){
        try{
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: { friendId: req.params.friendId } } },
                { runValidators: true, new: true }
            );

            if(!user){
                return res.status(404).json({ message: 'No User with this id!' });
            }
            res.json(user);
        }catch(err){
            res.status(500).json(err);
        }
    }


}