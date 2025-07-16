import {createSlice} from "@reduxjs/toolkit"
const userSlice=createSlice({
    name:"userSlice",
    initialState:JSON.parse(localStorage.getItem("user"))|| {
    token: null,
    name: null,
    username: null,
    email: null,
    id: null,
    profilePic: null,
    habits:[],
    tasks:[],
  },

    reducers:{
login(state,action){
localStorage.setItem(
        "user",
        JSON.stringify({ habits: [], tasks: [], ...action.payload })
      );
      return { habits: [], tasks: [], ...action.payload };
},
    logout(state,action ){
          localStorage.removeItem("user");
  return { token: null }; 
    },
    updateUser(state, action) {
      const updatedUser = { ...state, ...action.payload };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    },
    
}


})


export const {login,logout,updateUser}=userSlice.actions;
export default userSlice.reducer;