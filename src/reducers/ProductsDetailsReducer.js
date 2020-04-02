const INITIAL_STATE = { products  : null, images: [], comments: [], loader : true };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'productDetails':{
            console.log('payload ===', action.data);
            return ({...state,
                products            : action.payload,
                images              : action.payload.images,
                comments            : action.payload.comments ,
                // loader              : action.payload.key === 1 ? false : true
            });
        }
        default:
            return state;
    }
};
