import bcrypt from 'bcrypt'
import jwt  from 'jsonwebtoken'
import UserModel from '../models/User.js'

export const register = async (req,res) => {    
    try {
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
    
        const doc = new UserModel({
            phone_number: req.body.email,
            fullName: req.body. fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        })
    
        const user = await doc.save()
    
        const token = jwt.sign(
            {
                _id: user._id,
            }, 
            process.env.KEY,
            {
                expiresIn: '30d',
            }
        )

        const {passwordHash, ...userData} = user._doc  

        res.json({... userData, token,}) 
    }catch(err) {
        res.status(500).json({
            message: 'Գրանցումը չի կատարվել․․․',
            error: err
        })
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({email:req.body.email})
    
        if(!user){
            return req.status(404).json({
                message: "Օգտատերը չի գտնվել․․․"
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)
    
        if(!isValidPass){
            return req.status(403).json({
                message: "Սխալ գաղտնանուն կամ գաղտնաբառ"
            })
        }

        const token = jwt.sign(
            {
                _id: user._id,
            }, 
            process.env.KEY,
            {
                expiresIn: '30d',
            }
        )

        const {passwordHash, ...userData} = user._doc

        res.json({
            ...userData,
            token,
        })
    }catch(err){
        res.status(500).json({
            message: 'Չհաջողվեց մուտք գործել համակարգ․․․',
            error: err,
        })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)

        if(!user){
            return res.status(404).json({
                message:'Օգտատերը չի գտնվել․․․'
            })
        }

        const {passwordHash, ...userData} = user._doc  
        res.json(userData) 

    }catch(err) {
        res.status(500).json({
            message: 'Դուք չունեք հասանելիություն...',
            error: err
        })
    }
}

export const getUserById = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userData = {
        fullName:user.fullName,
        avatarUrl:user.avatarUrl
    }
    res.json(userData);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
}