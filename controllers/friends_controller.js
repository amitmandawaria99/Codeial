const User = require("../models/user");
const Friendship = require("../models/friendships");



module.exports.addFriend = async function(request , response){
    try{
        let existingFriendship = await Friendship.findOne({
            from_user : request.user._id,
            to_user : request.query.id,
        });


        let toUser = await User.findById(request.query.id);
        let fromUser = await User.findById(request.user._id);
    
        let deleted = false;
        if(existingFriendship){
            await toUser.friends.pull(existingFriendship._id);
            await fromUser.friends.pull(existingFriendship._id);
            await toUser.save();
            await fromUser.save();
            await existingFriendship.remove();
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