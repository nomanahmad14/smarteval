import jwt from "jsonwebtoken"


//api for admin login

const loginAdmin = async (req, res) => {
    const { email, password } = req.body
    try {
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: true, message: "invalid credentials" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }



}

export {loginAdmin}