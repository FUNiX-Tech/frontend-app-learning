
import { postSetLang , patchPreferences , getLanguage} from "./api"


export async function fetchPreferences (username,code) {
    return patchPreferences(username,{prefLang : code })
}


export async function fetchDataLanguage (code){
   
    return postSetLang(code)
}

export async function fetchLanguage (username){
    return getLanguage(username)
}