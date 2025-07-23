const Planning=require("../models/planningSchema")
async function createPlan(req,res){
    const userId=req.user;
    try{
        const {events,goals,date}=req.body;
         const newPlan = new Planning({
              user: userId,
              events,goals,date
            });
            await newPlan.save();
     res
      .status(201)
      .json({ success: true, message: "Tommorow planned", plan: newPlan });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function getPlan(req,res){
    const userId=req.user;
    const {date}=req.query;
    try {
         const myPlans = await Planning.findOne({ user: userId, date:date  });
            res
              .status(201)
              .json({
                success: true,
                message: "Plans fetched successfully",
                plans: myPlans,
              });

    } catch (error) {
         
    return res.status(500).json({
      message: error.message,
    });
  
    }
}

async function updatePlan(req,res){
    const userId=req.user;
    try{
        const {events,goals,date,planId}=req.body;
const plan=await Planning.findOne({_id:planId});
        if(!plan){
            return res.status(500).json({
        message: "Blog is not found",
      });
        }

plan.events=events;
plan.goals=goals;
await plan.save();

return res.status(200).json({
    success:true,
    message:"Plan updated successfully",
    plan
});


  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}


module.exports={createPlan,getPlan,updatePlan}