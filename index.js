const express = require('express');
const fs = require('fs');
const users = require('./MOCK_DATA.json');

const app = express();
const PORT = 8000;

//Middlewares - Plugin
app.use(express.urlencoded({extended: false}));


//Routes

//Shows the entire users JSON
app.get('/api/users', (req,res) => {
    return res.json(users);
})






//Shows the unique user with respective id
app.get('/api/users/:id', (req,res) =>{
        const id = Number(req.params.id);
        const user = users.find((user) => user.id === id);
        return res.json(user);
});





//Shows the users to audience 
app.get('/users', (req,res)=>{
    const html = `
    <ul>
    ${users.map((user) => `<li>${user.first_name}</li>`)}
    </ul>
    `;
    res.send(html);
})






app.post("/api/users", (req,res) => {
    const body = req.body;
    users.push({...body, id: users.length + 1});
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err,data) => {
        return res.json({status: "success", id: users.length});
    });
});





app.patch('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const updatedData = req.body;

    // Find the index of the user in the array based on the provided ID
    const userIndex = users.findIndex(user => user.id === parseInt(userId));

    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's data
    users[userIndex] = { ...users[userIndex], ...updatedData };

    // Write the updated data back to the file
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        return res.status(200).json({ status: "success", user: users[userIndex] });
    });
});





app.delete('/api/users/:id', (req,res) => {
    //Delete the users
    return res.json({status : pedning});
})



app.listen(PORT, () => console.log(`Server started at the port ${PORT}`));