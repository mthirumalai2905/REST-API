const express = require('express');
const fs = require('fs');
const users = require('./MOCK_DATA.json');

const app = express();
const PORT = 8000;

// Middlewares - Plugin
app.use(express.urlencoded({extended: false}));

// Routes

// Shows the entire users JSON
app.get('/api/users', (req, res) => {
    return res.json(users);
});

// Shows the unique user with respective id
app.get('/api/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
});

// Shows the users to the audience
app.get('/users', (req, res) => {
    const html = `
    <ul>
    ${users.map((user) => `<li>${user.first_name}</li>`)}
    </ul>
    `;
    res.send(html);
});

// Add a new user
app.post("/api/users", (req, res) => {
    const body = req.body;
    users.push({...body, id: users.length + 1});
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
        return res.json({status: "success", id: users.length});
    });
});

// Delete a user by id
app.delete('/api/users/:id', (req, res) => {
    // Delete the user
    const id = Number(req.params.id);
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        users.splice(index, 1);
        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
            return res.json({status: "success", message: `User with id ${id} deleted`});
        });
    } else {
        return res.status(404).json({status: "error", message: `User with id ${id} not found`});
    }
});

// Update a user by id
app.patch('/api/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const body = req.body;
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        // Update the user with new data
        users[index] = {...users[index], ...body};
        // Rewrite the updated users array to the JSON file
        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
            if (err) {
                return res.status(500).json({status: "error", message: "Failed to update user data"});
            }
            return res.json({status: "success", message: `User with id ${id} updated`, updatedUser: users[index]});
        });
    } else {
        return res.status(404).json({status: "error", message: `User with id ${id} not found`});
    }
});


app.listen(PORT, () => console.log(`Server started at the port ${PORT}`));
