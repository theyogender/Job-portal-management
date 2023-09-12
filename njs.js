const express1 = require('express');
const parser = require('body-parser')
const path = require('path');
const dir = path.join(__dirname)
const app = express1();

app.use(parser.urlencoded({ extended: true }));



app.set('view engine','ejs');

app.use(express1.static(dir))

const middle1 = async (req, resp, next) => {
    const model = await require(`${dir}/login_database.js`);
    const check = await model.findOne({ 'Number': req.body.Number })
    // check.Employer=='on'
   if(check==null){
        
        await resp.sendFile(`${dir}/regis.html`);
    }
         
    else {
            if (req.body.Number==check.Number) {  
               if (check.Password == req.body.Password)
            next()
            else
             resp.send('<h1>Plz Enter Right Password</h1>')
    
           }
    } 
}


const middle = async (req, resp, next) => {
    const model = await require(`${dir}/login_database.js`);
    const check = await model.findOne({ 'Number': req.body.Number })
    
    if (check == null) {
               next()
                  }
    else { resp.send(`<canter><h1 style='font-size:150%;'>You already Have an acount with this number</h1></center>`); }
   
}

// app.get('/login',(req,resp)=>{

//     resp.sendFile(`${dir}/index.html`);

// })

app.post('/login',middle1,async (req,resp)=>{

    const model=await require(`${dir}/login_database.js`);
    const check = await model.findOne({ 'Number': req.body.Number })
    if(check.Designation=='Employer')
    {
        // resp.sendFile(`${dir}/employer_profile.html`);
        resp.render('data1',{check})

    }
   else if(check.Designation=='Aspirant')
    {
        // resp.sendFile(`${dir}/employer_profile.html`);
        resp.render('data',{check})
    }

})

app.get('/signup', (req, resp) => {

    resp.sendFile(`${dir}/regis.html`);

})  
app.post('/signup',middle, async (req, resp) => {

    const model = await require(`${dir}/login_database.js`);
    const d = await new model({Designation: req.body.Designation, Name: req.body.name,Number:req.body.Number, Password: req.body.password})
    const df = await d.save();
    
})



app.post('/aspirant', async (req, resp) => {

    const model = require(`${dir}/Jobseeker_database.js`);
    // app.use(parser.urlencoded({ extended: true }));
    const count= await model.count();
    // console.log(count);
    const fd = await new model({ Serial_Number:count+1,Name: req.body.Name, email: req.body.email, Number: req.body.Number, Job_Name: req.body.Job_Name, Id: req.body.ID })
    const data = await fd.save();
    
    
      const Job = await model.find();
      const model1 = require(`${dir}/Employer1_database.js`);

      const Employ=await model1.find();
        
    
        resp.render('table',{Job,Employ});
      
    
    
    }
)


    app.post('/employer', async (req, resp) => {

        const model2 = require(`${dir}/Employer1_database.js`);
        
        const count= await model2.count();
        // console.log(count);
        const fd = await new model2({ Serial_Number:count+1,Company: req.body.Company, email: req.body.email, Number: req.body.Number, Job_Name: req.body.Job_Name, Id: req.body.ID })
        const data = await fd.save();
          const Employ = await model2.find();
          const model3 = require(`${dir}/Jobseeker_database.js`);
    
          const Job=await model3.find();
            
        
            // resp.render('table',{Job,Employ});
            resp.render('precE',{Job,Employ});
          
        
        
        }
    
)




app.listen(2001)
