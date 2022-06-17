const User = require("../models/user");
const Friendship = require("../models/friendships");



module.exports.addFriend = async function(request , response){
    try{
        let existingFriendship1 = await Friendship.findOne({
            from_user : request.user._id,
            to_user : request.query.id,
        });

        let existingFriendship2 = await Friendship.findOne({
            from_user : request.query.id,
            to_user : request.user._id,
        });

        let toUser = await User.findById(request.query.id);
        let fromUser = await User.findById(request.user._id);
    
        let deleted = false;
        if(existingFriendship1){
            await toUser.friends.pull(existingFriendship1._id);
            await fromUser.friends.pull(existingFriendship1._id);
            await toUser.save();
            await fromUser.save();
            await existingFriendship1.remove();
            deleted = true;
            removeFriend = true;
        }else if(existingFriendship2){
            await toUser.friends.pull(existingFriendship2._id);
            await fromUser.friends.pull(existingFriendship2._id);
            await toUser.save();
            await fromUser.save();
            await existingFriendship2.remove();
            deleted = true;
            removeFriend = true;
        }else{
            let friendship = await Friendship.create({
                to_user : request.query.id,
                from_user : request.user._id
            });
    
            await toUser.friends.push(friendship);
            await fromUser.friends.push(friendship);
            await toUser.save();
            await fromUser.save();
        }
    
        if(request.xhr){
            return response.status(200).json({
                deleted : deleted , 
                message : "Request Successful",
            });
        }
    
    
         return response.redirect("back");
    }catch(error){
        console.log("Error", error);
        return;
    }
}