import {HANDLE_CLICK_MENU} from '../constants/menuConstants'


const initialState = true
export const handleClickMenu = (state = initialState, action: {type: string}) => {
    switch (action.type) {
        case HANDLE_CLICK_MENU:
          return !state
        default :
          return state
    }   
}