import { User } from "../models/userModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async(req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body
        if( !fullName || !username || !password || !confirmPassword || !gender ){
            return res.status(400).json({
                message: "All fields compulsory"
            })
        }
        if(password != confirmPassword){
            return res.status(400).json({
                message: "Passwords do not match"
            })
        }

        const user = await User.findOne({username})
        if(user){
            return res.status(400).json({
                message: "User with this username already exists"
            })
        }

        const hashPassword = await bcrypt.hash(password, 5);

        const maleProfileAvatar = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const femaleProfileAvatar = `https://avatar.iran.liara.run/public/girl?username=${username}`

        await User.create({
            fullName,
            username,
            password: hashPassword,
            profilePhoto: gender === 'male' ? maleProfileAvatar : femaleProfileAvatar,
            gender
        })
        return res.status(201).json({
            message: 'User registered successfully',
            success: true
        })

    } catch (error) {
        console.log(error);
    }
}

export const login = async(req, res) => {
    try {
        const { username, password } = req.body
        if(!username || !password){
            return res.status(400).json({
                message: "All fields compulsory"
            })
        }

        const user = await User.findOne({username})
        if(!user){
            return res.status(400).json({
                message: "Incorrect Credentials",
                success: false
            })
        }

        const decodedPassword = await bcrypt.compare(password, user.password)
        
        if(!decodedPassword){
            return res.status(400).json({
                message: "Incorrect Credentials"
            })
        }

        const tokenData={
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' })
        
        return res.status(200).cookie("token", token, {maxAge: 1*24*60*60*1000, httpOnly: true, sameSite:'strict'}).json({
            _id: user._id,
            username: user.username,
            fullName: user.fullName,
            profilePhoto: user.profilePhoto,
        })

    } catch (error) {   
        console.log(error);
    }
}

export const logout = async(req, res) => {
    try {
        return res.status(200).cookie("token", '', {maxAge:0}).json({
            message: "Logged out successful"
        })
    } catch (error) {
        console.log(error);
    }
}