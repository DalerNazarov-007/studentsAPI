const http = require("node:http")

const IO = require("./utils/io")
const Students = new IO ("src/database/students.json")
const Student = require("./models/model")
const Parse = require("./utils/parser")

const server = async (req, res) => {
    res.setHeader("Content-Type", "application/json")
    if (req.url == "/students" && req.method == "GET") {
        const data = await Students.read()
        console.log(data);
        const final = data.sort((a, b) => a.name.localeCompare(b.name));
        res.writeHead(200)
        return res.end(JSON.stringify(final))
    }
    else if (req.url == "/students/getByClassname" && req.method == "GET"){
        const {classname} = await Parse(req)
        const data = await Students.read()
        const foundData = data.filter(student => student.classname == classname)
        if (!foundData) {
            res.writeHead(404)
            return res.end(JSON.stringify({message : "Classname not found"}))
        }
        res.writeHead(200)
        return res.end(JSON.stringify(foundData))
    }
    else if (req.url == "/students/post" && req.method == "POST") {
        const { name, surname, classname, coursename } = await Parse(req);
        const validClassnames = ["N-20", "N-19", "N-21"]
        const validCoursenames = ["IT", "SMM", "QA"]
        if (!validClassnames.includes(classname)) {
            res.writeHead(400);
            return res.end(JSON.stringify({ message: "Invalid classname! Classname should be N-21, N-20 or N-19" }));
        }
        if (!validCoursenames.includes(coursename)) {
            res.writeHead(400);
            return res.end(JSON.stringify({ message: "Invalid coursename! Coursename should be IT, SMM, QA" }));
        }
        const data = await Students.read();
        const id = Number(data[data.length - 1].id) + 1
        const newStudent = new Student(id, name, surname, classname, coursename);
        const finalData = data.length ? [...data, newStudent] : [newStudent]
        await Students.write(finalData);
        res.writeHead(200);
        return res.end(JSON.stringify({ message: "New Student Added!" }));
    }
    
    else if (req.url == "/students/edit" && req.method == "PUT"){
        const {id, name, surname, classname, coursename} = await Parse(req)
        const data = await Students.read()
        const updatedData = data.map((student) => student.id == id ? {...student, name, surname, classname, coursename} : student)
        await Students.write(updatedData)
        res.writeHead(200)
        return res.end(JSON.stringify({message: "Student Info Updated!"}))
    }
    else if (req.url == "/students/delete" && req.method == "DELETE"){
        const {id} = await Parse(req)
        const data = await Students.read()
        const filteredData = data.filter(student => student.id !== id)
        await Students.write(filteredData)
        res.writeHead(200)
        return res.end(JSON.stringify({message: "Data deleted!"}))
    }
    else {
        res.writeHead(404)
        res.end(JSON.stringify({message: "Route not found!"}))
    }
}

http.createServer(server).listen((5555), () => {
    console.log("Server running on port 5555");
    
})