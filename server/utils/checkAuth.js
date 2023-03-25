import jwt from 'jsonwebtoken'

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    
    if(token){
        try{
            const decode = jwt.verify(token, process.env.KEY)
        
            req.userId = decode._id
            next()
        }catch(err){
            return res.status(403).json({
                message: 'Դուք չունեք հասանելիություն...',
                error: err,
            })
        }
    }else{
       return res.status(403).json({
            message: 'Դուք չունեք հասանելիություն...'
        })
    }
}