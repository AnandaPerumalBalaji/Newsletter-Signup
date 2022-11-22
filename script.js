const express = require("express")

const bodyParser = require("body-parser")

const https = require("https")

const app = express()

app.use(express.static("public"))

app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html")
    
})

app.post("/", function(req, res){
    const firstName = req.body.fname
    const lastName = req.body.lname
    const emailAddress = req.body.email_address

    //console.log(firstName, lastName, emailAddress)

    const data = {
        members: [
            {
                email_address: emailAddress,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }

            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/539dc2fd2e"
    
    const options = {
        method: "POST",
        auth: "anand_pb:8fae251e7a901da27467520fbda5346d-us21"

    }

    const request = https.request(url, options, function(response){
        console.log(response.statusCode)

        if(response.statusCode === 200){
            //res.send("<h3>Successfully subscribed!</h3>")
            res.sendFile(__dirname + "/success.html")
        }
        else{
            //res.send("There was an error signing Up!")
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", function(data){
            console.log(JSON.parse(data))
        })

    })

    request.write(jsonData)
    request.end()

})

app.post("/failure", function(req, res){
    res.redirect("/")
})

app.listen(process.env.PORT || 3000, function(){
    console.log("server available at port 3000")
})

//API key 8fae251e7a901da27467520fbda5346d-us21
//Audience ID  539dc2fd2e