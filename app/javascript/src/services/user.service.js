import { walletConstants } from "../constants/wallet.constants"

// const saveUserInfo = async(data)=>{
//     try {
//         await AsyncStorage.setItem('@user', data)


      
//     } catch (e) {
//         console.log(JSON.stringify(e.message))
//       }
// }


// const getUserInfo = async()=>{
//     try {
//         const value = await AsyncStorage.getItem('@user')
//         return value;
        
//       } catch(e) {
//         // error reading value
//       }
// }

const getAccessToken = async () => {
  // try {
  //   const value = await AsyncStorage.getItem('@user');
  //   const token  =  JSON.parse(value);
  //   if(value !== null) {
  //     // value previously stored
  //     return token["token"];
  //   }
  // } catch(e) {
  //   // error reading value
  // }
}

// const clearUserData = async()=>{
//     try {
//         await AsyncStorage.clear()
      
//     } catch (e) {
//         console.log(JSON.stringify(e.message))
//       }
// }

const saveUserId = id => localStorage.setItem(walletConstants.USER_KEY, id)
const getUserId = () => localStorage.getItem(walletConstants.USER_KEY)

export {
  getAccessToken,
  saveUserId,
  getUserId
}
