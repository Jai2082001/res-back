const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoConnect = require('./database/database').mongoConnect;
const cookieParser = require('cookie-parser');
const productroute = require('./routes/products');
const userroutes = require('./routes/userflow')
const categoriesroute = require('./routes/category');
const passport = require('./passport/passport');
const cartroutes = require('./routes/cart');
const jwt = require('jsonwebtoken');
const addressrouter = require('./routes/addresses');
const User = require('./models/User');

let port = process.env.PORT || 5000




app.use(cors({
    origin: true,
    credentials: true
}));

app.use(passport.initialize())

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

app.get(
    '/auth/google/callback',
    passport.authenticate('google', { session: false }),
    async (req, res) => {
        // Generate JWT
        const existingUser = await User.findOne({ googleId: req.user.uid });
        let response;
        if (!existingUser) {

            const newUser = new User({
                email: req.user.email,
                googleId: req.user.uid
            })

            response = await newUser.save();
        }else{
            console.log(req.user.uid);
            response = {};
            response._id = existingUser._id
        }

        const token = jwt.sign(
            { uid: req.user.uid, email: req.user.email, id: response._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expiry time
        );

        res.cookie('token', token, {
            httpOnly: true,  // Prevents JavaScript access to the cookie
            secure: process.env.NODE_ENV === 'production',  // Only send in production over HTTPS
            sameSite: 'Strict',  // Limits cookie to your site only
            maxAge: 24 * 60 * 60 * 1000  // 1 day
        });

        
        // Send the token as a response to the frontend
        res.redirect('http://localhost:3000/account')
    }
);


app.use(cookieParser())
app.use(bodyParser.json({ limit: '100mb' }))
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

app.post('/api/products', productroute);
app.post('/categories/add', categoriesroute)
app.get('/api/categories', categoriesroute)
app.get('/api/products', productroute)



app.post('/api/user/login', userroutes)
app.post('/api/user/register', userroutes);
app.get('/api/user/check-auth', userroutes);
app.get('/api/addresses', addressrouter)
app.post('/api/addresses', addressrouter)

app.get('/cart', cartroutes);
app.post('/cart', cartroutes);
app.get('/cart/delete/productId', cartroutes)


app.get('/', (req, res, next) => {
    console.log('here we are');
    console.log(req.cookies)
    res.send({ status: 'hello' })
})
mongoConnect(() => {
    app.listen(port, () => {
        console.log('Connected at ' + port)
    });
})