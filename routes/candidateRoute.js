const express = require('express'); 
const router = express.Router();
const Candidate = require("../models/candidate");
const {jwtAuthMiddleware,generateToken} = require("../jwt");

const checkAdminRole = async (userId) =>{
  try{
    const user = await User.findById(userId);
    if(user.role === 'admin'){
      return true;
    }
  }catch(err){
    return false;
  }
}


      router.post("/", jwtAuthMiddleware,async (req,res)=>{
      try{
        if(! await checkAdminRole(req.user.id)){
          return res.status(403).json({message:"user has not admin role"});
        }
        const data = req.body
        const newCandidate = new Candidate(data);
        
        const response = await newCandidate.save();

        const payload = {
          id : response.id
        }

        const token  = generateToken(payload)
        res.status(200).json({response : response});

      }catch(err){
        console.log(err);
        res.status(500).json({error : "internal server error"});
        }
      })

      router.put('/:candidateID',jwtAuthMiddleware, async (req,res)=>{
        try{
        if(!checkAdminRole(req.user.id)){
          return res.status(403).json({message:"user has not admin role"});
        }
           const candidateID = req.params.candidateID;
           const updatedcandidateData = req.body;

           const response = await Candidate.findByIdAndUpdate(candidateID,updatedcandidateData,{
            new:true,
            runValidators:true
           })

           if (!response){
            return res.status(404).json({error:"candidate not found"});
           }
           console.log("candidate data updated");
            res.status(200).json(response);
        }catch(err){
            console.log(err);
            res.status(500).json({error : "internal server error"});
        }
      })

      router.delete('/:candidateID',jwtAuthMiddleware, async (req,res)=>{
        try{
        if(!checkAdminRole(req.user.id)){
          return res.status(403).json({message:"user has not admin role"});
        }
           const candidateID = req.params.candidateID;
  

           const response = await Candidate.findByIdAndDelete(candidateID);
            

           if (!response){
            return res.status(404).json({error:"candidate not found"});
           }
           console.log("candidate deleted");
            res.status(200).json(response);
        }catch(err){
            console.log(err);
            res.status(500).json({error : "internal server error"});
        }
      })

       router.post('/vote/:candidateID',jwtAuthMiddleware, async (req,res)=>{
        candidateID = req.params.candidateID;
        userId = req.user.id;
        try{
          const candidate = await Candidate.findById(candidateID);
          if(!candidate){
            return res.status(404).json({message:"candidate not found"});
          }
          const user = await User.findById(userId);
          if(!user){
            return res.status(404).json({message:"user not found"});
          }
          if(user.isVoted){
            res.status(400).json({message:"you have already voted"});
          }
          if(user.role == 'admin'){
            res.status(403).json({message:"admin is not allowed"});
          }

          candidate.votes.push({user:userId})
          candidate.voteCount++;
          await candidate.save();

          user.isVoted=true;
          await user.save();

          res.status(200).json({message:"vote recorded successfully"});
        }catch(err){
           console.log(err);
           res.status(500).json({error : "internal server error"});
        }
       })

       router.get('/vote/count', async (req,res)=>{
        try{
           const candidate = await Candidate.find().sort({voteCount:'desc'});

           const voteRecord = candidate.map((data)=>{
            return{
              party: data.party,
              count:data.voteCount
            }
           })
           return res.status(200).json(voteRecord);

        }catch(err){
          console.log(err);
          res.status(500).json({error : "internal server error"});
        }
       })

       router.get('/candidate', async (req,res)=>{
        try{
          const candidates = await Candidate.find();
          res.status(200).json(candidates);
        }catch(err){
          console.log(err);
          res.status(500).json({error : "internal server error"});
        }
       })


      module.exports = router; 

      