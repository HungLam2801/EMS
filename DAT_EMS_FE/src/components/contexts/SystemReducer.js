
const INITIAL_STATE = {
    userId: -1,
    username: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    roleName: "",
    image: "",
    permissions: [],
    status: false,
};

const SystemReducer = (state, action) => {
    switch (action.type) {
        case 'LOAD_USR':
            return {
                ...state,
                userId: action.payload.userId,
                username: action.payload.username,
                name: action.payload.name,
                email: action.payload.email,
                phone: action.payload.phone,
                address: action.payload.address,
                roleName: action.payload.roleName,
                image: action.payload.image,
                permissions: action.payload.permissions,
                status: action.payload.status
            }
        case 'UPDATE_YOUR_ROLE':
            if (state.roleName === action.payload.roleName) {
                return {
                    ...state,
                    permissions: action.payload.permissions
                }
            } else {
                return {
                    ...state
                }
            }
        default:
            return state;
    }
}

export { INITIAL_STATE }
export default SystemReducer;