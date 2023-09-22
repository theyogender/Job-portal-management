const express1 = require('express');
const parser = require('body-parser')
const path = require('path');
const dir = path.join(__dirname)
const app = express1();

app.use(parser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use(express1.static(dir))

const middle1 = async (req, resp, next) => {      //checking Number and password for login
    const model = await require(`${dir}/login_database.js`);
    const check = await model.findOne({ 'Number': req.body.Number })

    if (check == null) {

        await resp.sendFile(`${dir}/regis.html`);
    }

    else {
        if (req.body.Number == check.Number) {
            if (check.Password == req.body.Password)
                next()
            else
                resp.send('<h1>Plz Enter Right Password</h1>')

        }
    }
}


const middle = async (req, resp, next) => {          //Checking whether this number is registered or not
    const model = await require(`${dir}/login_database.js`);
    const check = await model.findOne({ 'Number': req.body.Number })

    if (check == null) {
        next()
    }
    else { resp.send(`<canter><h1 style='font-size:150%;'>You already Have an acount with this number</h1></center>`); }

}



app.post('/login', middle1, async (req, resp) => {

    const model = await require(`${dir}/login_database.js`);
    const check = await model.findOne({ 'Number': req.body.Number })
    if (check.Designation == 'Employer') {


        const model2 = require(`${dir}/Employer1_database.js`);
        const data = await model2.find({ 'user_Id': check.user_Id })


        const model3 = require(`${dir}/Jobseeker_database.js`);
        const Job = await model3.find()
        resp.render('employer', { check, data, Job })


    }
    else if (check.Designation == 'Aspirant') {
        const model2 = require(`${dir}/Jobseeker_database.js`);
        const data = await model2.find({ 'user_Id': check.user_Id })


        const model3 = require(`${dir}/Employer1_database.js`);
        const Job = await model3.find()
        resp.render('aspirant', { check, data, Job })

    }

})

app.get('/signup', (req, resp) => {

    resp.sendFile(`${dir}/regis.html`);

})
app.post('/signup', middle, async (req, resp) => {

    const model = await require(`${dir}/login_database.js`);
    const count = await model.count();
    const d = await new model({ user_Id: count + 1, Designation: req.body.Designation, Name: req.body.name, Number: req.body.Number, Password: req.body.password })
    const df = await d.save();
    if (df) {
        resp.sendFile(`${dir}/responce.html`);
    }

})

app.post('/employer', async (req, resp) => {

    const model2 = require(`${dir}/Employer1_database.js`);
    const userdata = await require(`${dir}/login_database.js`);
    const check = await userdata.findOne({ 'Number': req.body.Registered_Number })
    if(check==null)
    {

    resp.send(`<canter><h1 style='font-size:150%;'>Plz enter right Registered Number</h1></center>`)

    }
    else{
        const userId = check.user_Id;
    const user1 = await model2.findOne({ 'Job_Name': req.body.Job_Name })
    if (user1 == null) {
        const count = await model2.count();

        const fd = await new model2({ user_Id: userId, Serial_Number: count + 1, Company: req.body.Company, email: req.body.email, Number: req.body.Number, Job_Name: req.body.Job_Name, Id: req.body.ID })
        const data1 = await fd.save();
        const Employ = await model2.find();

        const model3 = require(`${dir}/Jobseeker_database.js`);
        const Job = await model3.find();


        const data = await model2.find({ 'user_Id': userId })


        resp.render('employer', { check, data, Job });
    }
      else {
         const Employ = await model2.find();

        const model3 = require(`${dir}/Jobseeker_database.js`);
        const Job = await model3.find();


        const data = await model2.find({ 'user_Id': userId })


         resp.render('employer', { check, data, Job });
      }
    }
    
}

)


app.post('/aspirant', async (req, resp) => {


    const model2 = require(`${dir}/Jobseeker_database.js`);
    const userdata = await require(`${dir}/login_database.js`);
    const check = await userdata.findOne({ 'Number': req.body.Registered_Number })
    if(check==null)
    {

    resp.send(`<canter><h1 style='font-size:150%;'>Plz enter right Registered Number</h1></center>`)

    }
    else
    {
    const userId = check.user_Id;
    const user1 = await model2.findOne({ 'Job_Name': req.body.Job_Name })
    if (user1 == null) {
        const count = await model2.count();

        const fd = await new model2({ user_Id: userId, Serial_Number: count + 1, Company: req.body.Company, email: req.body.email, Number: req.body.Number, Job_Name: req.body.Job_Name, Id: req.body.ID })
        const data1 = await fd.save();

        const model3 = require(`${dir}/Employer1_database.js`);
        const Job = await model3.find();


        const data = await model2.find({ 'user_Id': userId })

        resp.render('aspirant', { check, data, Job });
      }
      else {
        const model3 = require(`${dir}/Employer1_database.js`);
        const Job = await model3.find();


        const data = await model2.find({ 'user_Id': userId })
              
        resp.render('aspirant', { check, data, Job });
      }
    }

}
)



app.listen(2001)
