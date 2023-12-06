const express1 = require('express');
const parser = require('body-parser')
const path = require('path');
const { deleteModel } = require('mongoose');
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
    else if (check.Designation == 'Admin') {
        const model2 = require(`${dir}/Jobseeker_database.js`);
        const data = await model2.find()


        const model3 = require(`${dir}/Employer1_database.js`);
        const Job = await model3.find()
        resp.render('Admin', { check, data, Job })

    }

})

app.get('/signup', (req, resp) => {

    resp.sendFile(`${dir}/regis.html`);

})
app.post('/signup', middle, async (req, resp) => {

    const model = await require(`${dir}/login_database.js`);
    const count = await model.count();
    const d = await new model({ user_Id: count + 1, Designation: req.body.Designation, Name: req.body.name, Number: req.body.Number, Password: req.body.password ,email:req.body.email})
    const df = await d.save();
    if (df) {
        resp.sendFile(`${dir}/responce.html`);
    }

})

app.post('/employer', async (req, resp) => {

    const model2 = require(`${dir}/Employer1_database.js`);
    const userdata = await require(`${dir}/login_database.js`);
    const check = await userdata.findOne({ 'Number': req.body.Registered_Number })
    if (check == null) {

        resp.send(`<center><h1 style='font-size:150%;'>Plz enter right Registered Number</h1></center>`)

    }
    else {
        const userId = check.user_Id;
        const user1 = await model2.findOne({ 'Job_Name': req.body.Job_Name })
        if (user1 == null) {
            const count = await model2.count();

            const fd = await new model2({ user_Id: userId, Serial_Number: count + 1, Company: req.body.Company, email: req.body.email, Number: req.body.Registered_Number, Job_Name: req.body.Job_Name, Id: req.body.ID })
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
    if (check == null) {

        resp.send(`<canter><h1 style='font-size:150%;'>Plz enter right Registered Number</h1></center>`)

    }
    else {
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


const middleApply= async (req, resp, next) => {      //checking Number and password for login
    const model2 = require(`${dir}/Jobseeker_database.js`);
    
    const userdata = await require(`${dir}/login_database.js`);
    const check = await userdata.findOne({ 'Number': req.body.Registered_Number })
    const userId = check.user_Id; 

    const Apply = require(`${dir}/Employer1_database.js`);
    const checkApply = await Apply.findOne({ 'Company': req.body.Company})

    
    if(checkApply==null)
    {

    resp.send(`<canter><h1 style='font-size:150%;'>Plz enter right Company</h1></center>`)

    }
    else
    {
    
    
        const Array=checkApply.myarray
        let t=Array.includes(req.body.Registered_Number)
        if(t==true)
        {
            resp.send(`<canter><h1 style='font-size:150%;'>You have already applied in this Company ,Wait for Response !</h1></center>`)
        }
        else{
            next()
        }
       
        
     
      }
}


app.post('/Applied', middleApply,async (req, resp) => {

    // console.log(req.body);
    const model2 = require(`${dir}/Jobseeker_database.js`);
    
    const userdata = await require(`${dir}/login_database.js`);
    const check = await userdata.findOne({ 'Number': req.body.Registered_Number })
    const userId = check.user_Id; 

    const Apply = require(`${dir}/Employer1_database.js`);

    
        const fd = await Apply.updateOne({ Company: req.body.Company}, {
          $push: {
              myarray: req.body.Registered_Number
                //   userId: ObjectId("570ca5e48dbe673802c2d035"),
                   }
        })
        console.log(fd);
        console.log(req.body.Registered_Number);

        const model3 = require(`${dir}/Employer1_database.js`);
        const Job = await model3.find();


        const data = await model2.find({ 'user_Id': userId })

        resp.render('aspirant', { check, data, Job });
        // resp.send(`<canter><h1 style='font-size:150%;'>Successfully applied in this Company ,Wait for Response !</h1></center>`)
     
      }
 
)


app.post('/status', async (req, resp) => {

    
    const Apply = require(`${dir}/Employer1_database.js`);
    const checkApply = await Apply.findOne({ 'Company': req.body.Company})
    const Apply1= require(`${dir}/login_database.js`);
    if(checkApply==null)
    {

    resp.send(`<canter><h1 style='font-size:150%;'>Plz enter right Company</h1></center>`)

    }
    else
     {  
        
       const Array=checkApply.myarray
    
       const l=Array.length
    
      let Ar=[]
     

       for(let i=0;i<l;i++)
       {
        Ar[i]=await Apply1.findOne({ 'Number':`${Array[i]}` })
       }

        resp.render('status.ejs', {Ar});
        
}}

)

const middleHired= async (req, resp, next) => {      //checking Number and password for login
    const model2 = require(`${dir}/Employer1_database.js`);
    
    const userdata = await require(`${dir}/login_database.js`);
    const check = await userdata.findOne({ 'Number': req.body.Registered_Number })
    const userId = check.user_Id; 

    const Apply = require(`${dir}/Jobseeker_database.js`);
    const checkApply = await Apply.findOne({ 'Company': req.body.Company})

    
    if(checkApply==null)
    {

    resp.send(`<canter><h1 style='font-size:150%;'>Plz enter right Company</h1></center>`)

    }
    else
    {
    
    
        const Array=checkApply.myarray
        let t=Array.includes(req.body.Registered_Number)
        if(t==true)
        {
            resp.send(`<canter><h1 style='font-size:150%;'>You have already applied in this Company ,Wait for Response !</h1></center>`)
        }
        else{
            next()
        }
       
        
     
      }
}


app.post('/Hired', middleHired,async (req, resp) => {
    
    // // console.log(req.body);
    const model2 = require(`${dir}/Employer1_database.js`);
    
    const userdata = await require(`${dir}/login_database.js`);
    const check = await userdata.findOne({ 'Number': req.body.Registered_Number })
    const userId = check.user_Id; 

    const Apply = require(`${dir}/Jobseeker_database.js`);

    
        const fd = await Apply.updateOne({ Company: req.body.Company}, {
          $push: {
              myarray: req.body.Registered_Number
                //   userId: ObjectId("570ca5e48dbe673802c2d035"),
                   }
        })
        // console.log(fd);
        // console.log(req.body.Registered_Number);

        const model3 = require(`${dir}/Jobseeker_database.js`);
        const Job = await model3.find();


        const data = await model2.find({ 'user_Id': userId })

        resp.render('employer', { check, data, Job });
          
      }
 
)

app.post('/CResponce', async (req, resp) => {

    
    const Apply = require(`${dir}/Jobseeker_database.js`);
    const checkApply = await Apply.findOne({ 'Company': req.body.Company})
    const Apply1= require(`${dir}/login_database.js`);
    if(checkApply==null)
    {
        
    resp.send(`<canter><h1 style='font-size:150%;'>Plz enter right Company</h1></center>`)

    }
    else
     {  
        
       const Array=checkApply.myarray
    
       const l=Array.length
    
      let Ar=[]
     

       for(let i=0;i<l;i++)
       {
        Ar[i]=await Apply1.findOne({ 'Number':`${Array[i]}` })
       }

        resp.render('responce.ejs', {Ar});
        
    
}}
)


app.post('/Edelete', async (req, resp) => {

    const model2 = require(`${dir}/Employer1_database.js`);
    const userdata = await require(`${dir}/login_database.js`);
    const check = await userdata.findOne({ 'Number': req.body.Registered_Number })
    if (check == null) {

        resp.send(`<center><h1 style='font-size:150%;'>Plz enter right Registered Number</h1></center>`)

    }
    else {
        const userId = check.user_Id;
        // const user1 = await model2.findOne({ 'Job_Name': req.body.Registered_Number })
            const count = await model2.count();

            const fd = await model2.deleteOne({ 'Number': req.body.Registered_Number  })
            // const data1 = await fd.save();
            const Employ = await model2.find();

            const model3 = require(`${dir}/Jobseeker_database.js`);
            const Job = await model3.find();


            const data = await model2.find({ 'user_Id': userId })


            resp.render('employer', { check, data, Job });
            // console.log(fd);
        
        }
    }



)

app.post('/EUpdate', async (req, resp) => {

    const model2 = require(`${dir}/Employer1_database.js`);
    const userdata = await require(`${dir}/login_database.js`);
    const check = await userdata.findOne({ 'Number': req.body.Registered_Number })
    if (check == null) {

        resp.send(`<center><h1 style='font-size:150%;'>Plz enter right Registered Number</h1></center>`)

    }
    else {
        const userId = check.user_Id;
        // const user1 = await model2.findOne({ 'Job_Name': req.body.Registered_Number })
            const count = await model2.count();

            const fd = await model2.updateOne({ 'Number': req.body.Registered_Number  },{$set :{Company: req.body.Company, email: req.body.email, Number: req.body.Registered_Number, Job_Name: req.body.Job_Name}})
            // const data1 = await fd.save();
            const Employ = await model2.find();

            const model3 = require(`${dir}/Jobseeker_database.js`);
            const Job = await model3.find();


            const data = await model2.find({ 'user_Id': userId })


            resp.render('employer', { check, data, Job });
        
        }
    }
)


app.post('/Rdelete', async (req, resp) => {

    const model2 = require(`${dir}/Jobseeker_database.js`);
    const userdata = await require(`${dir}/login_database.js`);
    const check = await userdata.findOne({ 'Number': req.body.Registered_Number })
    if (check == null) {

        resp.send(`<center><h1 style='font-size:150%;'>Plz enter right Registered Number</h1></center>`)

    }
    else {
        const userId = check.user_Id;
        // const user1 = await model2.findOne({ 'Job_Name': req.body.Registered_Number })
            const count = await model2.count();

            const fd = await model2.deleteOne({ 'Number': req.body.Registered_Number  })
            // const data1 = await fd.save();
            const Employ = await model2.find();

            const model3 = require(`${dir}/Employer1_database.js`);
            const Job = await model3.find();
            

            const data = await model2.find({ 'user_Id': userId })


            resp.render('employer', { check, data, Job });
            // console.log(fd);
        
        }
    }



)

app.post('/RUpdate', async (req, resp) => {

    const model2 = require(`${dir}/Jobseeker_database.js`);
    
    const userdata = await require(`${dir}/login_database.js`);
    const check = await userdata.findOne({ 'Number': req.body.Registered_Number })
    if (check == null) {

        resp.send(`<center><h1 style='font-size:150%;'>Plz enter right Registered Number</h1></center>`)

    }
    else {
        const userId = check.user_Id;
        // const user1 = await model2.findOne({ 'Job_Name': req.body.Registered_Number })
            const count = await model2.count();

            const fd = await model2.updateOne({ 'Number': req.body.Registered_Number  },{$set :{Company: req.body.Company, email: req.body.email, Number: req.body.Registered_Number, Job_Name: req.body.Job_Name}})
            // const data1 = await fd.save();
            const Employ = await model2.find();

            const model3 = require(`${dir}/Employer1_database.js`);
            const Job = await model3.find();


            const data = await model2.find({ 'user_Id': userId })


            resp.render('employer', { check, data, Job });
        
        }
    }
)
app.post('/Adelete', async (req, resp) => {

    const model = await require(`${dir}/login_database.js`);
    const check = await model.findOne({ 'Number': req.body.Registered_Number })
    if (check.Designation == 'Employer') {


        const model2 = require(`${dir}/Employer1_database.js`);
        const userdata = await require(`${dir}/login_database.js`);
        const check = await userdata.findOne({ 'Number': req.body.Registered_Number })
        if (check == null) {
    
            resp.send(`<center><h1 style='font-size:150%;'>Plz enter right Registered Number</h1></center>`)
    
        }
        else {
            const userId = check.user_Id;
            // const user1 = await model2.findOne({ 'Job_Name': req.body.Registered_Number })
                const count = await model2.count();
    
                const fd = await model2.deleteOne({ 'Number': req.body.Registered_Number  })
                // const data1 = await fd.save();
                const Employ = await model2.find();
    
                const model3 = require(`${dir}/Jobseeker_database.js`);
                const Job = await model3.find();
    
    
                const data = await model2.find()
    
    
                resp.render('Admin', { data, Job });
                // console.log(fd);
            
            }


    }
    else if (check.Designation == 'Aspirant') {
        const model2 = require(`${dir}/Jobseeker_database.js`);
    const userdata = await require(`${dir}/login_database.js`);
    const check = await userdata.findOne({ 'Number': req.body.Registered_Number })
    if (check == null) {

        resp.send(`<center><h1 style='font-size:150%;'>Plz enter right Registered Number</h1></center>`)

    }
    else {
        const userId = check.user_Id;
        // const user1 = await model2.findOne({ 'Job_Name': req.body.Registered_Number })
            const count = await model2.count();

            const fd = await model2.deleteOne({ 'Number': req.body.Registered_Number  })
            // const data1 = await fd.save();
            const Employ = await model2.find();

            const model3 = require(`${dir}/Employer1_database.js`);
            const Job = await model3.find();
            

            const data = await model2.find()


            resp.render('Admin', {data, Job });
            // console.log(fd);
        
        }
    }
}



)



app.listen(3000)
